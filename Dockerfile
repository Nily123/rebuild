# 使用 Node 環境來建置 Vue 專案
FROM node:22.12.0 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# 使用 Nginx 作為靜態伺服器
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]