#STEPS TO RUN
# BUILD IMAGE USING COMMAND: docker build -t backend-image .
#THEN CHECN THE IMAGE using > docker images
    #backend-image                  latest          c1a2568c5db4   10 seconds ago   1.37GB
#docker run -d -p 3500:3500 -e MONGO_CONN_STR="mongodb://host.docker.internal:27017/tasksdb" -e PORT=3500 --name backend-container backend-image

#THEN docker ps to see the list of running container
#THEN VISIT to localhost:3000

FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]