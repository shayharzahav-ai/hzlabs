FROM nginx:alpine
COPY landing_page.html customers.html Educare.html tahatzomot.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif shutafimlamasa-screenshot.png /usr/share/nginx/html/
COPY educare-proposal-short.pdf educare-proposal-full.pdf taatzumot-proposal-short.pdf taatzumot-proposal-full.pdf /usr/share/nginx/html/
COPY nginx-container.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
