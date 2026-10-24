FROM nginx:alpine

COPY index.html personality.html technically.html styles.css script.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
