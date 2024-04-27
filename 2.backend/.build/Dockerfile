# Imagen de base alpine para que cargue lo minimo posible
FROM node:20.11.1-alpine

# Definimos unas variables de entorno iniciales
# que después sobreescribiremos desde nuestro
# docker-compose.yml
ENV PROJECT_ACRONYM=bono
ENV MONGO_DB_URL=mongodb://mongodb:27017/bono?tls=false
ENV NODE_ENV=development
ENV API_PORT=8091
ENV API_URL_BASE_PATH=/api
ENV CUT_TIME=7
ENV TZ=Europe/Madrid
ENV MAIL_USERNAME=Bonodere
ENV MAIL_PASSWORD=fg_O6Cl?T93*
ENV OAUTH_CLIENTID=257001888568-tgjb19cp0r9ct25rbrsgqfo36nckestn.apps.googleusercontent.com
ENV OAUTH_CLIENT_SECRET=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
ENV OAUTH_REFRESH_TOKEN=1//04ZVZiOUCwB69CgYIARAAGAQSNwF-L9Ir_WpV16wQvQpk0EP2cftasBCIgutxxmDorEMytwPmVjPjLYwp1_pP_uWNLvuIKi87998
   


# Usar usuario ROOT de node y 
# modificar el espacio de trabajo
USER root
WORKDIR /home/backend

# Copiar nuestro código fuente a la
# instancia de docker
COPY ./2-backend/ .

# Instalar las dependencias en modo produccion
# para evitar codigo innecesario
RUN npm install --production

# Exponemos el puerto para que sea accesible desde fuera
EXPOSE 8084

# Comando por defecto que ejecutara 
# Docker al cargar el contenedor 
CMD [ "node", "server.js" ]