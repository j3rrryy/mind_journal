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

![Architecture](https://github.com/j3rrryy/mind_journal/blob/main/images/architecture.webp?raw=true)

> [!NOTE]
> Grafana находится по адресу `/admin/grafana`

## :computer: Что нужно для запуска

- Docker **(dev)**
- Kubernetes + Helm **(dev + prod)**

## :hammer_and_wrench: Начало работы

- **(Для dev-docker)** Скопируйте файлы `.env` и `.env.frontend` из `examples/` в папку `docker/` и заполните их

- **(Для dev-docker)** Скопируйте файл `redis.conf` из `examples/` в папку `docker/` и заполните его

- **(Для k8s)** Установите NGINX Ingress Controller

  ```shell
  helm install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace --set controller.allowSnippetAnnotations=true --set controller.config.annotations-risk-level=Critical
  ```

- **(Для dev-k8s)** Скопируйте файл `values-dev.yaml` из `examples/` в папку `k8s/` и заполните его

- **(Для prod-k8s)** Добавьте все необходимые секреты в GitHub Actions

- **(Для prod-k8s)** Установите cert-manager и сконфигурируйте ClusterIssuer

  ```shell
  helm install cert-manager jetstack/cert-manager --repo https://charts.jetstack.io --namespace cert-manager --create-namespace --set installCRDs=true
  kubectl apply -f - <<EOF
  apiVersion: cert-manager.io/v1
  kind: ClusterIssuer
  metadata:
    name: letsencrypt-prod
  spec:
    acme:
      server: https://acme-v02.api.letsencrypt.org/directory
      email: <your_email>
      privateKeySecretRef:
        name: letsencrypt-prod
      solvers:
        - http01:
            ingress:
              class: nginx
  EOF
  ```

### :rocket: Запуск

- Запуск **dev-версии**

  - Только приложение

    ```shell
    docker compose --profile app up --build -d
    ```

  - Приложение + мониторинг

    ```shell
    docker compose --profile all up --build -d
    ```

  - Используя Kubernetes

    ```shell
    helm dependency update ./k8s
    helm upgrade --install mind-journal ./k8s -f ./k8s/values-dev.yaml --namespace mind-journal --create-namespace
    ```

- Запуск **prod-версии**

  Используйте CI/CD пайплайн для деплоя приложения

### :x: Остановка

- Используя Docker

  ```shell
  docker compose stop
  ```

- Используя Kubernetes

  ```shell
  helm uninstall mind-journal --namespace mind-journal
  ```

### :bar_chart: Демо

- Запустите **dev-docker-версию** с переменными окружения `WORKER_DEBUG=1` и `DEBUG=0` (это увеличит частоту обновления аналитики и рекомендаций)
- Создайте аккаунт
- Скопируйте ID пользователя из профиля
- Сгенерируйте данные:

  ```shell
  docker exec -it wellness_dev uv run ./demo_generator.py --user_id <ID пользователя> --pattern stressed --anomaly-prob 0.1 --trend-strength 5 --clear
  ```

- Аналитика и рекомендации скоро появятся
