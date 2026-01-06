#STEPS TO RUN
# BUILD IMAGE USING COMMAND: docker build -t frontend-image .
#THEN CHECN THE IMAGE using > docker images
# RUN CONTAINER USING COMMAND: docker run -d -p 3000:3000 --name frontend-container frontend-image
#THEN docker ps to see the list of running container
#THEN VISIT to localhost:3000


FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]

