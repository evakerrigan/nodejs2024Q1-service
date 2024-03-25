# Используем официальный образ Node.js
FROM node:20.11-alpine3.19 as builder

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY ["package.json", "package-lock.json*", "./"]

# Устанавливаем зависимости
RUN npm ci && npm cache clean --force

# Копируем исходный код приложения
COPY . .

# Собираем приложение
RUN npm run build

FROM node:20.11-alpine3.19 as runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE ${PORT}

# Запускаем приложение
CMD ["npm", "run", "start:dev"]