FROM nginx:alpine
COPY landing_page.html customers.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif /usr/share/nginx/html/
COPY nginx-container.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
