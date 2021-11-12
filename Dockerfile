FROM node:14 as base

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "./dist/app.js"]

# FROM node:14 as base

# # Create app directory
# WORKDIR /app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json /app

# RUN npm i
# # If you are building your code for production
# # RUN npm ci --only=production

# # Bundle app source
# COPY . /app

# CMD ["npm", "start"]