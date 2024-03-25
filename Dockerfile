# Используем официальный образ Node.js
FROM node:20.11.1-alpine3.19

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Собираем приложение
RUN npm run build

# Запускаем приложение
CMD ["npm", "run", "start:dev"]