FROM nginxinc/nginx-unprivileged:1-alpine
LABEL maintainer="web@ikehunter.dev"

COPY ./default.conf.tpl /etc/nginx/default.conf.tpl
COPY ./entrypoint.sh /entrypoint.sh

USER root

RUN mkdir -p /vol/client && \
    chmod 755 /vol/client && \
    mkdir -p /vol/apispec && \
    chmod 755 /vol/apispec && \
    chown nginx:nginx /vol/client && \
    chown -R nginx:nginx /vol/apispec && \
    touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh

USER nginx

EXPOSE 8080
VOLUME /vol/client
VOLUME /vol/apispec

CMD ["/entrypoint.sh"]