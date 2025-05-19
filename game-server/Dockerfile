FROM node:24-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Открываем нужный порт
EXPOSE 2567

# Healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s CMD curl -f http://localhost:2567/ping || exit 1

# Запускаем напрямую с tsx
CMD ["npx", "tsx", "src/index.ts"]