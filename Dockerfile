FROM node:20-alpine
WORKDIR /app
COPY package.json server.js ./
RUN npm install --omit=dev && mkdir -p /usr/share/nginx/html
COPY landing_page.html customers.html work.html Educare.html tahatzomot.html hz_labs_logo_futuristic.svg logo-L.avif tahatzomot.avif shutafimlamasa-og.png shutafimlamasa-dashboard.webp og-image.png /usr/share/nginx/html/
COPY educare-proposal-short.pdf educare-proposal-full.pdf taatzumot-proposal-short.pdf taatzumot-proposal-full.pdf hokhmat-hazdaknut-proposal.pdf hokhmat-hazdaknut-proposal-full.pdf /usr/share/nginx/html/
COPY robots.txt sitemap.xml llms.txt /usr/share/nginx/html/
EXPOSE 80
ENV PORT=80
CMD ["node", "server.js"]
