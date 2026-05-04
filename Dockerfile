FROM node:20-alpine
WORKDIR /app
COPY package.json server.js ./
RUN npm install --omit=dev && mkdir -p /usr/share/nginx/html
COPY landing_page.html customers.html work.html hz_labs_logo_futuristic.svg shutafimlamasa-dashboard.webp og-image.png /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY robots.txt sitemap.xml llms.txt /usr/share/nginx/html/
EXPOSE 80
ENV PORT=80
CMD ["node", "server.js"]
