FROM node:16-alpine

WORKDIR /app

ADD package.json /app/package.json
RUN npm config set registry http://registry.npmjs.org
RUN npm install

ADD . /app

EXPOSE 5000

# CMD ["npm", "run", "start"]
