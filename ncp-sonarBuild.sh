#!/bin/bash
currentDirectory=$(pwd)
SONAR_SCANNER_HOME="$currentDirectory/.sonar/sonar-scanner-4.7.0.2747-linux"
curl --create-dirs -sSLo "$currentDirectory/.sonar/sonar-scanner.zip" https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip
unzip "$currentDirectory/.sonar/sonar-scanner.zip" -d "$currentDirectory/.sonar/"
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'Sonarqube install failed'; exit $EXIT_CODE
fi
export PATH="$SONAR_SCANNER_HOME/bin:$PATH"
export SONAR_SCANNER_OPTS="-server"
chmod 755 "${SONAR_SCANNER_HOME}/jre/bin/java"
chmod +x "${SONAR_SCANNER_HOME}/bin/sonar-scanner"
echo Sonarqube analysis...
sonar-scanner -Dsonar.token="$SONAR_TOKEN" -Dsonar.projectKey="$PROJECT_KEY" -Dsonar.projectName="$PROJECT_KEY" -Dsonar.sources=. -Dsonar.host.url="$SONAR_HOST_URL"
sleep 60
curl -u $SONAR_ID:$SONAR_PWD $SONAR_HOST_URL/api/qualitygates/project_status\?projectKey\=$PROJECT_KEY > result.json
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'Sonarqube analysis failed'; exit $EXIT_CODE
fi
QAULITY_GATES=$(jq -r '.projectStatus.status' result.json)
echo "$QAULITY_GATES"
if [ "$QAULITY_GATES" = "ERROR" ]; then
  CODEBUILD_BUILD_SUCCEEDING=0
fi
echo "Code scan completed on $(date)"
if [ "$CODEBUILD_BUILD_SUCCEEDING" -eq 0 ]; then
  exit 1
fi
set -x