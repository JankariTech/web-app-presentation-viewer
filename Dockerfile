FROM owncloudops/nginx

RUN rm -f /var/lib/nginx/html/*

ADD docker/vhost.conf /etc/nginx/vhost.conf
ADD dist /var/lib/nginx/html

EXPOSE 8080

USER nginx

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
WORKDIR /var/lib/nginx/html
