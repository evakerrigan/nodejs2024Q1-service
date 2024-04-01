# Home Library Service

## Clone the repo:

```
git clone https://github.com/evakerrigan/nodejs2024Q1-service.git
```

## Change the directory:

```
cd nodejs2024Q1-service
```

## Change the branch:

```
git checkout part3
```

## Install dependencies:

```
npm i
```

## Create .env file (based on .env.example):

```
cp .env.example .env
```

# Start app. Open in docker

## Make sure that docker is running. Run containers

```
npm run docker
```

## Open another terminal and run the command:

```
npm run test
npm run test:auth
npm run test:refresh
```

## OpenAPI documentation:

```
http://localhost:4000/doc
```

# Check writing logs:

## To check list files

```
docker exec -it eva-library-app ls -ls logs
```

## To see content of log file

```
docker exec -it eva-library-app cat ./logs/0.logs.log
```

# Auto-fix and format

```
npm run lint
```

```
npm run format
```

# Scanning

```
npm run docker:scan
```
