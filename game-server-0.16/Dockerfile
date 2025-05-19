FROM node:24-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY package*.json ./
RUN npm install

# Копируем остальное
COPY . .

# Сборка TypeScript
RUN npm run build

# Healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s CMD curl -f http://localhost:2567/ping || exit 1

# Запуск
CMD ["node", "build/index.js"]