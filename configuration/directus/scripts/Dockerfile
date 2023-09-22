FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# only executable program
ENTRYPOINT [ "npm", "run" ]
CMD [ "places-flows" ]