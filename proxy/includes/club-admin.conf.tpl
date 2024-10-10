server {
  listen 8081;
  
  location /static {
    alias /vol/static;
  }
  
  location / {
    uwsgi_pass "$CLUB_MANAGER_URI";
    
    proxy_set_header        Host "$host";
    proxy_set_header        X-Forwarded-For "$proxy_add_x_forwarded_for";
    uwsgi_pass_header       Token;
    
    client_max_body_size    32M;
    include /etc/nginx/uwsgi_params;
  }
}
