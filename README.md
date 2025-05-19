# Запуск проекта с Docker Compose

В этом проекте используются два сервиса: frontend (React + Vite) и game-server (Colyseus сервер). Оба сервиса запускаются в Docker-контейнерах через docker-compose.

## Требования

Docker установлен и запущен на вашей машине

Docker Compose (часто идёт в комплекте с Docker)

## Инструкция по запуску

### Клонирование репозитория:

```bash
git clone <url-репозитория>
cd <папка_проекта>
```

### Запуск в докере:

```bash
docker-compose up --build
```

### Запуск отдельного игрового сервера:

```bash
docker-compose up --build game-server
```

### Остановка контейнеров:

```bash
docker-compose down
```
