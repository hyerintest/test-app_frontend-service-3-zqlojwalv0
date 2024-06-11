#!/bin/bash
echo BUILD START...
COMMIT_ID=`git rev-parse --short HEAD`
echo Building the Docker image...
docker build -t ${IMAGE_REPO_NAME}:${ARGO_APPLICATION}-latest .
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'docker build failed'; exit $EXIT_CODE
fi
echo BUILD END...
docker tag ${IMAGE_REPO_NAME}:${ARGO_APPLICATION}-latest ${IMAGE_REPO_NAME}:${ARGO_APPLICATION}-${COMMIT_ID}
docker login -u ${ACCESS_KEY} -p ${SECRET_KEY} ${IMAGE_REPO_NAME}
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'docker login failed'; exit $EXIT_CODE
fi
docker push ${IMAGE_REPO_NAME}:${ARGO_APPLICATION}-${COMMIT_ID}
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'docker push failed'; exit $EXIT_CODE
fi
docker push ${IMAGE_REPO_NAME}:${ARGO_APPLICATION}-latest
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
  echo 'docker push failed'; exit $EXIT_CODE
fi
echo BUILD END...
