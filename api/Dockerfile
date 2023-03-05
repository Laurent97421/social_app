#################
## DEVELOPMENT ##
#################

# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:18 AS development

# Specify working directory inside container
WORKDIR /usr/src/app

# Copy package-lock.json and package.json from host to inside container working directory
COPY package*.json ./

#  Install dependencies inside container
RUN npm install

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################

# Build another image named production
FROM node:18 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /usr/src/app

# Copy the required file to run the app without all sources files or development dependencies not use for our app execution
# Permit to have a lighter image and have mor efficiency for the app
COPY --from=development /usr/src/app/ .

EXPOSE 3000

# run app
CMD [ "node", "dist/main"]