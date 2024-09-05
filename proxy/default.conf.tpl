upstream apiserver {
  server "$SERVER_URI";
}

upstream websocket {
  hash $remote_addr consistent;
  server "$WEBSOCKET_URI";
}


server {
  listen 8080;
  
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Headers *;
  add_header Access-Control-Allow-Methods *;
  add_header Cross-Origin-Opener-Policy "unsafe-none";
  
  underscores_in_headers on;
  
  location /api {
    proxy_pass http://apiserver;
    
    proxy_set_header Host "$host:$server_port";
    proxy_set_header X-Forwarded-For "$proxy_add_x_forwarded_for";
    proxy_set_header Token "$http_token";
    
    proxy_pass_header  Token;
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