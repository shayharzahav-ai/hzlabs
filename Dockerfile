FROM nginx:alpine
COPY landing_page.html customers.html work.html Educare.html tahatzomot.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif shutafimlamasa-screenshot.png og-image.png /usr/share/nginx/html/
COPY educare-proposal-short.pdf educare-proposal-full.pdf taatzumot-proposal-short.pdf taatzumot-proposal-full.pdf hokhmat-hazdaknut-proposal.pdf hokhmat-hazdaknut-proposal-full.pdf /usr/share/nginx/html/
COPY robots.txt sitemap.xml llms.txt /usr/share/nginx/html/
COPY nginx-container.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
