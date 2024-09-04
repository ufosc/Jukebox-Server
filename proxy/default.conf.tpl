upstream api {
  server "server:8000";
}

server {
  listen 80;
  
  location /api {
    proxy_pass http://api;
  }
  
  location / {
    root /vol/client;
    index index.html index.htm;
    
    # try_files $uri $uri/ index.html;
    error_page 404 =200 /index.html;
  }
  
}