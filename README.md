# MindJournal

<p align="center">
  <a href="https://github.com/j3rrryy/mind_journal/actions/workflows/main.yml">
    <img src="https://github.com/j3rrryy/mind_journal/actions/workflows/main.yml/badge.svg" alt="СI/CD">
  </a>
  <a href="https://codecov.io/gh/j3rrryy/mind_journal">
    <img src="https://codecov.io/gh/j3rrryy/mind_journal/graph/badge.svg?token=PFWPAH79T0" alt="Codecov">
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

## :book: Ключевые особенности

- Ежедневный ввод метрик самочувствия
- Эволюционная аналитическая система: эвристические правила → упрощенные модели → полный ML-анализ по мере накопления данных
- Генерация инсайтов и рекомендаций
- Визуализация метрик с помощью интерактивных графиков
- Интернационализация: поддержка языков RU и EN

- Микросервисная архитектура
- gRPC между сервисами
- Основная БД - PostgreSQL
- БД для кэша - Redis
- Брокер сообщений между API-гейтвеем и Mail-сервисом - Apache Kafka
- Мониторинг - Prometheus & Grafana
- Агрегация логов - Promtail & Loki & Grafana

> [!NOTE]
> Grafana находится по адресу `/admin/grafana`

## :computer: Что нужно для запуска

- Docker

## :hammer_and_wrench: Начало работы

- **(Для dev/prod)** Скопируйте файл `.env` из `examples/<dev/prod>/` в папку `<dev/prod>/` и заполните его (для быстроты можно использовать значения из `test/.env`)

- **(Для dev/prod)** Скопируйте файл `redis.conf` из `examples/` в папку `<dev/prod>/` и заполните его

- **(Для prod)** Скопируйте файл `nginx.conf` из `examples/prod/` в папку `prod/` и заполните его

- **(Для prod)** Скопируйте файл `docker-compose.cert.yml` из `examples/prod/` в папку `prod/` и заполните его

### :rocket: Запуск

- Запуск **dev-версии**

  - Только приложение

    ```shell
    docker compose -f docker-compose.dev.yml --profile app up --build -d
    ```

  - Приложение + мониторинг

    ```shell
    docker compose -f docker-compose.dev.yml --profile all up --build -d
    ```

- Запуск **prod-версии** и получение SSL-сертификата

  - Создайте директорию на сервере

    ```shell
    mkdir -p /mind_journal/
    ```

  - Используйте SCP, чтобы скопировать prod-файлы на сервер

    ```shell
    scp -r ./prod/* <username>@<host>:/mind_journal/
    ```

  - Запустите deploy-скрипт

    ```shell
    bash deploy.sh
    ```

### :x: Остановка

```shell
docker compose -f docker-compose.<dev/prod>.yml stop
```

### :bar_chart: Демо

- Запустите **dev-версию** с переменными окружения `WORKER_DEBUG=1` и `DEBUG=0` (это увеличит частоту обновления аналитики и рекомендаций)
- Создайте аккаунт
- Скопируйте ID пользователя из профиля
- Сгенерируйте данные:

  ```shell
  docker exec -it wellness_dev uv run ./demo_generator.py --user_id <ID пользователя> --pattern stressed --anomaly-prob 0.1 --trend-strength 5 --clear
  ```

- Аналитика и рекомендации скоро появятся
