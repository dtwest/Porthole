# Porthole

<p align="center">
  <img src="./client/assets/porthole.png?raw=true"
    alt="Porthole icon"
    width="250"
    height="250"
  />
</p>

A Toy application which exposes an API to do port scanning

## Getting Started

### Pre-requisites

You need [docker](https://docs.docker.com/get-docker/) to be installed and configured on your computer / server.

You need python, and pip installed. This project is built using [python 3.9.x](https://www.python.org/downloads/release/python-390/), but will work so long as you are running python 3.8 or greater.

Finally you should have [node & npm](https://nodejs.org/en/) installed.

**Note**: _Examples and setup scripts are for unix / linux based systems, not windows._

### Setting Up Your Environment

Clone the repo and run the setup script, which will:

- Create a virtual env
- Activate the environment
- Install dependencies listed in the `requirements.txt` file

```bash
git clone https://github.com/dtwest/Porthole.git
cd Porthole
. ./setup.sh
```

### Building

```bash
. ./build.sh
```

## Starting / Stopping the Server

### Start

```bash
. ./build.sh && docker-compose -f docker-compose.dev.yml up --remove-orphans
# smack CTRL + C a couple times then teardown to stop the stack
```

From here go to [localhost:8000](http://localhost:8000), and submit addresses to scan.

#### Clean Build & Start

```bash
docker-compose -f docker-compose.dev.yml build --no-cache && docker-compose -f docker-compose.dev.yml up --remove-orphans
# smack CTRL + C a couple times then teardown to stop the stack
```

### Teardown

```bash
. ./teardown.sh
```

### Caveats

This is not a production solution, it's a toy application.

If for instance you wanted to make this more of a prod service you could do breaking this app up, and ditching the queue implementation for a better one.

#### Logging

I'm logging with `gunicorn.error` only for demonstration purposes, so that the logs appear in the terminal when you compose application. Don't do this in prod.

#### NMAP

Right now the app is using a tcp scan strategy as I'm running under the assumption that not everyone who runs this will have root access which is required to do a use a syn scan strategy.

Additionally, to make sure that scans are reasonably fast for the purposes of demonstration, I'm not using options such as `-p-` to scan all ports, and I'm doing -F for speed.

If you have root access, and want it all... well tweak the options, and scan strategy.

#### MySQL / Datastore

This app has one table, and MySQL was chosen because it was the fastest DB to standup, and the simplest. That being said there is a hack in place for IDs since MySQL does not support UUIDs natively, you may want to consider your options here, but it really is much of a muchness.

**Note:** _The database credentials are hard coded in the app, this can not be the case for a prod app, it's ok here because this is a toy application. Migrate to something like AWS Secrets Manager with it's integration with RDS services._

#### Queues

If you were to make this a prod app, the biggest thing you'd change would most likely be the queue implementation. Specifically, I would break the solution up such that there were the following components:

- API Endpoints, potentially run lambdas & API Gateway. Write to datastore and then put an event onto an SQS queue
- Datastore, potentially running Aurora MySQL / Postgres
- Queue & Queue workers, potentially a FIFO SQS queue + DLQ, and a queue processing Fargate service

#### Front End

Well pick your poison, I'm using a react spa here, but you can deploy this however you like, be it the way it is currently, or pushed to S3 + Cloudfront and served that way.

#### Authentication / Authorisation

This is not implemented in this app, this should damn well be implemented if this is a prod service.

### Tech Stack

- Docker (debian based, using python official images)
- Python3.9
- Flask & SQLAlchemy
- MySQL (official docker image)
- React + Material-UI (create-react-app)
