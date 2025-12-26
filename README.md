# MindJournal

<p align="center">
  <a href="https://github.com/j3rrryy/mind_journal/actions/workflows/main.yml">
    <img src="https://github.com/j3rrryy/mind_journal/actions/workflows/main.yml/badge.svg" alt="СI/CD">
  </a>
  <a href="https://codecov.io/gh/j3rrryy/mind_journal">
    <img src="https://codecov.io/gh/j3rrryy/mind_journal/graph/badge.svg?token=" alt="Codecov">
  </a>
  <a href="https://nodejs.org/docs/latest-v20.x/api/index.html">
    <img src="https://img.shields.io/badge/Node.js-20-8DBB39.svg" alt="Node.js 20">
  </a>
  <a href="https://www.python.org/downloads/release/python-3120/">
    <img src="https://img.shields.io/badge/Python-3.12-FFD64E.svg" alt="Python 3.12">
  </a>
  <a href="https://github.com/j3rrryy/mind_journal/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License">
  </a>
  <a href="https://github.com/astral-sh/ruff">
    <img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json" alt="Ruff">
  </a>
  <a href="https://github.com/astral-sh/uv">
    <img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json" alt="uv">
  </a>
</p>

## :book: Key features

- Microservice architecture
- gRPC between services
- Main DB - PostgreSQL
- DB for cache - Redis
- Message broker between Gateway and Mail service - Apache Kafka
- Monitoring - Prometheus & Grafana
- Log aggregation - Promtail & Loki & Grafana

> [!NOTE]
> Grafana located at `/admin/grafana`

## :computer: Requirements

- Docker

## :hammer_and_wrench: Getting started

- Copy `.env` and `.env.frontend` files from `examples/dev/` to `dev/` folder and fill them in

- **(For dev/prod)** Copy `redis.conf` file from `examples/` to `dev/` or `prod/` folder and fill it in

- **(For prod)** Copy `.env` and `.env.frontend` files from `examples/prod/` to `prod/` folder and fill them in

- **(For prod)** Copy `nginx.conf` file from `examples/prod/` to `prod/` folder and fill it in

- **(For prod)** Copy `docker-compose.cert.yml` file from `examples/prod/` to `prod/` folder and fill it in

### :rocket: Start

- Run the **dev ver.**

  - Only app

    ```shell
    docker compose -f docker-compose.dev.yml --profile app up --build -d
    ```

  - App + monitoring

    ```shell
    docker compose -f docker-compose.dev.yml --profile all up --build -d
    ```

- Run the **prod ver.** and get a SSL certificate

  - Create the directory on the server

    ```shell
    mkdir -p /mind_journal/
    ```

  - Use SCP to copy the prod files to the server

    ```shell
    scp -r ./prod/* <username>@<host>:/mind_journal/
    ```

  - Run the deploy script

    ```shell
    bash deploy.sh
    ```

### :x: Stop

```shell
docker compose -f docker-compose.<dev/prod>.yml stop
```
