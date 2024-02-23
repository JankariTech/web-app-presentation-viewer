FROM node:18-alpine as BUILD_STAGE

WORKDIR /extension

COPY . .

RUN npm install --silent -g pnpm
RUN pnpm install
RUN pnpm build

FROM owncloudops/nginx

WORKDIR /var/lib/nginx/html

RUN rm -f /var/lib/nginx/html/*

ADD docker/vhost.conf /etc/nginx/vhost.conf
COPY --from=BUILD_STAGE /extension/dist /var/lib/nginx/html

EXPOSE 8080

USER nginx

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
