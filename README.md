# pulsar-sidecar

🚗 A companion api that allows you to publish messages to your locally running Pulsar container

## Getting Started

### Running Standalone

```bash
# Copy/hydrate .env
cp -n .env.example .env && nano .env

# Start the pulsar container
docker compose up -d pulsar-wait

# Build image
docker build . -t pulsar-sidecar

# Start the api @ http://localhost:3500
docker run --publish 3500:3500 pulsar-sidecar

# Publish a message
curl --request POST \
  --url http://localhost:3500/publish \
  --header 'Content-Type: application/json' \
  --data '
  {
    "message": {
      "data": {
      "test": 1
      },
      "messageType": "entity.updated"
    },
    "topic": "my-topic"
  }
  '
```

## Local Development

### Install Dependencies

```bash
nvm install
npm install
```

### Native (recommended)

```bash
# Start the pulsar container
docker compose up -d pulsar-wait

# Start in watch mode
npm run dev
```

### Docker

```bash
# Start up api in a container
docker compose up --build service
```

## Publishing Messages

```bash
curl --request POST \
  --url http://localhost:3500/publish \
  --header 'Content-Type: application/json' \
  --data '{
  "message": {
    "data": {
      "test": 1
    },
    "messageType": "entity.updated"
  },
  "topic": "my-topic"
}'
```
