FROM nginx:alpine
COPY landing_page.html customers.html Educare.html tahatzomot.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif shutafimlamasa-screenshot.png og-image.png /usr/share/nginx/html/
COPY customers/educare-proposal-short.pdf customers/educare-proposal-full.pdf customers/taatzumot-proposal-short.pdf customers/taatzumot-proposal-full.pdf customers/hokhmat-hazdaknut-proposal.pdf customers/hokhmat-hazdaknut-proposal-full.pdf /usr/share/nginx/html/
COPY robots.txt sitemap.xml llms.txt /usr/share/nginx/html/
COPY nginx-container.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
