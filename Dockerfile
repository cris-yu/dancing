FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css script.js ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
