podTemplate(
    containers: [
        containerTemplate(name: 'podman', image: 'registry.turacocloud.com/turaco-common/podman:ubuntu-16.04', command: 'cat', ttyEnabled: true, privileged: true),
        containerTemplate(name: 'helm-kubectl', image: 'registry.turacocloud.com/turaco-common/helm-kubectl:latest', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'argocd', image: 'registry.turacocloud.com/turaco-common/argocd:latest', command: 'cat', ttyEnabled: true),
    ],
    imagePullSecrets: ['harbor-secret']) {
    node(POD_LABEL) {
        if ("$IS_SONAR" == "true") {
            stage('Sonarqube Build') {
                git (branch: "$BRANCH", url: "https://$SOURCE_REPO_URL/${GROUP_NAME}_${SERVICE_NAME}.git", credentialsId: "$CREDENTIAL_ID")
                def currentDirectory = pwd()
                def SONAR_SCANNER_HOME="$currentDirectory/.sonar/sonar-scanner-4.7.0.2747-linux"
                sh "curl --create-dirs -sSLo $currentDirectory/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip"
                unzip zipFile: "$currentDirectory/.sonar/sonar-scanner.zip", dir: "$currentDirectory/.sonar/"
                def PATH="$SONAR_SCANNER_HOME/bin:$PATH"
                def SONAR_SCANNER_OPTS="-server"
                sh "chmod 755 ${SONAR_SCANNER_HOME}/jre/bin/java"
                sh "chmod +x ${SONAR_SCANNER_HOME}/bin/sonar-scanner"
                sh "${SONAR_SCANNER_HOME}/bin/sonar-scanner -Dsonar.token=$SONAR_TOKEN -Dsonar.projectKey=$PROJECT_KEY -Dsonar.projectName=$PROJECT_KEY -Dsonar.sources=. -Dsonar.host.url=$SONAR_HOST_URL"
                sh "sleep 60"
                sh "curl -u $SONAR_ID:$SONAR_PWD $SONAR_HOST_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY >result.json"
                def QAULITY_GATES = readJSON(file: 'result.json').projectStatus.status
                echo "$QAULITY_GATES"
                sh '''
                    if [ $QAULITY_GATES = ERROR ] ; then CODEBUILD_BUILD_SUCCEEDING = 0 ; fi
                    echo Code scan completed on `date`
                    if [ "$CODEBUILD_BUILD_SUCCEEDING" -eq 0 ]; then exit 1; fi
                    set -x
                '''
            }
        }
        stage('Build') {
            git (branch: "$BRANCH", url: "https://$SOURCE_REPO_URL/${GROUP_NAME}_${SERVICE_NAME}.git", credentialsId: "$CREDENTIAL_ID")
            sh "git rev-parse --short HEAD > commit-id.txt"
            def COMMIT_ID = readFile("commit-id.txt").trim()
            container('podman') {
                sh "podman login -u $HARBOR_USER -p $HARBOR_PASSWORD $IMAGE_REPO_NAME"
                sh "podman build -t $IMAGE_REPO_NAME:$ARGO_APPLICATION-latest ."
                sh "podman tag $IMAGE_REPO_NAME:$ARGO_APPLICATION-latest $IMAGE_REPO_NAME:$ARGO_APPLICATION-$COMMIT_ID"
                sh "podman push $IMAGE_REPO_NAME:$ARGO_APPLICATION-$COMMIT_ID"
                sh "podman push $IMAGE_REPO_NAME:$ARGO_APPLICATION-latest"
            }
            echo "Podman Build ing..."
            git (branch: "master", url: "https://$SOURCE_REPO_URL/${GROUP_NAME}_HelmChart.git", credentialsId: "$CREDENTIAL_ID")
            dir ("$STAGE/$SERVICE_NAME") {
                sh "git rev-parse --short HEAD > commit-id.txt"
                sh "find ./ -name values.yaml -type f -exec sed -i \'s/^\\(\\s*tag\\s*:\\s*\\).*/\\1\"\'$ARGO_APPLICATION-$COMMIT_ID\'\"/\' {} \\;"
                sh 'git config --global user.email "info@twolinecode.com"'
                sh 'git config --global user.name "jenkins-runner"'
                sh 'git add ./values.yaml'
                sh "git commit --allow-empty -m \"Pushed Helm Chart: $ARGO_APPLICATION-$COMMIT_ID\""
                withCredentials([gitUsernamePassword(credentialsId: "$CREDENTIAL_ID", gitToolName: 'git-tool')]) {
                    sh '''
                    while :
                    do
                        git pull --rebase origin master
                        if git push origin master
                        then
                            break
                        fi
                    done
                    '''
                }
            }
        }
        stage('Deploy') {
            dir("$STAGE/Common") {
                container('helm-kubectl'){
                    echo "helm-kubectl ing ..."
                    sh "helm template . > ./common.yaml"
                    sh "kubectl --kubeconfig ../$KUBECONFIG apply -f common.yaml"
                    sh "kubectl --kubeconfig ../$KUBECONFIG get secret argocd-initial-admin-secret -n tlc-support -o jsonpath='{.data.password}' | base64 -d > argocd-password.txt"
                    def PASSWORD = readFile("argocd-password.txt")
                    container('argocd') {
                        echo "Sync ArgoCD ing..."
                        sh "argocd login $ARGO_ENDPOINT:80 --grpc-web-root-path argocd --username admin --password $PASSWORD --plaintext --skip-test-tls"
                        sh "argocd app get $ARGO_APPLICATION --refresh"
                        sh "argocd app sync $ARGO_APPLICATION"
                    }
                }
            }
        }
    }
}
