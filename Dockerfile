FROM node:18

WORKDIR /app

# copy dependency files
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files
COPY . .

# expose API port
EXPOSE 8080

# start application
CMD ["node", "source_code/app.js"]