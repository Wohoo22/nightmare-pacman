FROM node:12.14.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production
COPY . .
EXPOSE 3000

# name database
ENV DB ''
ENV DB_USER ''
ENV DB_PASS ''
# eg: 192.168.0.111:20217
ENV DB_SERVERS ''

# eg: 192.168.0.111
ENV RABBIT_HOST ''
# eg: 5672
ENV RABBIT_PORT ''
ENV RABBIT_USER ''
ENV RABBIT_PASS ''

#url service permission-operation (eg: http://localhost:8006/authorization) , required /authorization
ENV AUTHORIZATION_URL ''

# url service sdp
ENV SDP_URL 'http://localhost:8005'
ENV SDP_ACCESS_TOKEN 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VzdG9tZXItYmUiLCJpYXQiOjE2MTE2NTQwNjksImV4cCI6NDc2NzQxNDA2OX0.W9shWHCEeDVmM7ZKpNr6QvCBqsv0jSv8dHP1Yk9EBl0'

# folder mounted upload file (eg: /uploads)
ENV DEST_LOCATION ''

# url service operation-data
ENV OPERATION_DATA_URL 'http://localhost:8004'
ENV OPERATION_DATA_ACCESS_TOKEN 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VzdG9tZXItYmUiLCJpYXQiOjE2MTE2NTQwNjksImV4cCI6NDc2NzQxNDA2OX0.W9shWHCEeDVmM7ZKpNr6QvCBqsv0jSv8dHP1Yk9EBl0'

ENV REDIS_HOST ''
ENV REDIS_PORT ''
ENV REDIS_SENTINEL ''
ENV REDIS_CLUSTER_NAME ''
ENV REDIS_CLUSTER_PASSWORD ''
ENV EXPIRE_CACHE_SECOND '10'

ENV PERMISSION_USER_URL 'http://localhost:8006'
ENV USER_DATA_URL 'http://localhost:8007'
ENV USER_DATA_TOKEN 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2ktYmFja2VuZCIsImlhdCI6MTYyNTIwMTUwNiwiZXhwIjo0NzgwOTYxNTA2fQ.EWAibq87KjWRal4NdE9DEMpp9Po5yjUtqwdvSY0yJD4'

# url service upload file, image
ENV BASE_UPLOAD 'http://localhost:5003'

CMD [ "npm", "start"]
