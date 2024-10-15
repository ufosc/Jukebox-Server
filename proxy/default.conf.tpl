upstream apiserver {
  server "$SERVER_URI";
}

upstream websocket {
  hash $remote_addr consistent;
  server "$WEBSOCKET_URI";
}

include /etc/nginx/conf.d/includes/club-admin.conf;

server {
  listen 8080;
  
  add_header Access-Control-Allow-Origin *;
  # proxy_set_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Headers *;
  add_header Access-Control-Allow-Methods *;
  add_header Cross-Origin-Opener-Policy "unsafe-none";
  
  underscores_in_headers on;
  
  location /static {
    alias /vol/static;
  }
  
  location ~* ^/api/v[0-9]/(spotify|jukebox) {
    proxy_pass http://apiserver;
    
    proxy_set_header Host "$host:$server_port";
    proxy_set_header X-Forwarded-For "$proxy_add_x_forwarded_for";
    proxy_set_header Token "$http_token";
    
    proxy_pass_header Token;
    proxy_pass_header Authorization;
  }
  
  location ~* ^/api/v[0-9]/(docs|schema)/jukebox {
    proxy_pass http://apiserver;
    
    proxy_set_header Host "$host:$server_port";
    proxy_set_header X-Forwarded-For "$proxy_add_x_forwarded_for";
    proxy_set_header Token "$http_token";
    
    proxy_pass_header Token;
    proxy_pass_header Authorization;
  }
  
  location ~* ^/api/v[0-9]/(user|club) {
    uwsgi_pass "$CLUB_MANAGER_URI";
    
    proxy_set_header        Host "$host";
    proxy_set_header        X-Forwarded-For "$proxy_add_x_forwarded_for";
    uwsgi_pass_header       Token;
    
    client_max_body_size    32M;
    include /etc/nginx/uwsgi_params;
  }
  
  location ~* ^/api/v[0-9]/(docs|schema)/club-manager {
    uwsgi_pass "$CLUB_MANAGER_URI";
    
    proxy_set_header        Host "$host";
    proxy_set_header        X-Forwarded-For "$proxy_add_x_forwarded_for";
    uwsgi_pass_header       Token;
    
    client_max_body_size    32M;
    include /etc/nginx/uwsgi_params;
  }
  
  location /api/docs {
    alias /vol/apidoc;
    index index.html;
    
    try_files $uri $uri/ index.html;
  }
  
  location /socket.io {
    # Basic config: https://socket.io/docs/v4/reverse-proxy/
    # Sticky sessions: https://socket.io/docs/v4/using-multiple-nodes/#nginx-configuration
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header Access-Control-Allow-Origin *;
    
    proxy_pass http://websocket;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
  
  location / {
    root /vol/client;
    index index.html index.htm;
    
    # try_files $uri $uri/ index.html;
    error_page 404 =200 /index.html;
  }
  
}