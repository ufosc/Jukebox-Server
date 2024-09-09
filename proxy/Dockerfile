FROM nginxinc/nginx-unprivileged:1-alpine
LABEL maintainer="web@ikehunter.dev"

COPY ./default.conf.tpl /etc/nginx/default.conf.tpl
COPY ./entrypoint.sh /entrypoint.sh

USER root

RUN mkdir -p /vol/client && \
    chmod 755 /vol/client && \
    chown nginx:nginx /vol/client && \
    touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh

USER nginx

EXPOSE 8080
VOLUME /vol/client

CMD ["/entrypoint.sh"]