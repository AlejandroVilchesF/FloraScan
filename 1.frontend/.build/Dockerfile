### MULTI STAGE BUILD  #####
############################

### VUEJS BUILD ########
FROM node:20.11.1-alpine AS VUEJS

# Environment variables for production
ENV FRONTEND_BASEPATH=/
ENV BACKEND_URI=/api
ENV TZ=Europe/Madrid
ENV FRONTEND_PORT=8089

# Create app directory
WORKDIR /usr/src/frontend
# Copy repo to workspace
COPY ./1-frontend/ ./
# If you are building your code for production
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm cache clean --force && npm install && npm run build


### NGINX BUILD ########
# Base image
FROM nginx:1.25.4-alpine
# Copy webpage from VUEJS step
COPY --from=VUEJS /usr/src/frontend/dist /var/www/html
COPY ./1-frontend/.build/nginx/default.conf /etc/nginx/conf.d
# Modify permissions to avois errors
RUN chmod -R 777 /var/www/html
