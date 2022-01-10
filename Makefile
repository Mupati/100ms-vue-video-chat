build:
   npm run-script build
   mkdir -p hms-functions
   GOOS=linux
   GOARCH=amd64
   GO111MODULE=on
   GOBIN=${PWD}/hms-functions go get ./...
   GOBIN=${PWD}/hms-functions go install ./...