FROM node:12.8.0-alpine
WORKDIR /client
COPY . ./
RUN npm install -g http-server
RUN yarn
COPY . .
RUN yarn build
EXPOSE 8080
CMD ["http-server", "build"]