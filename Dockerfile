FROM node:16.13.2

WORKDIR /movies

COPY package.json ./
RUN npm install
COPY . ./

# CMD ls
# CMD npm start