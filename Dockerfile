ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /src
COPY package.json /src/
RUN mkdir node_modules
RUN npm install

FROM node:${NODE_VERSION}-alpine
ARG MONGODB_URI="mongodb://root:example@0.0.0.0?writeConcern=majority"
ENV MONGODB_URI=${MONGODB_URI}
ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE ${PORT}

WORKDIR /app
COPY --from=builder /src/node_modules/ /app/node_modules/
COPY package.json /app/
COPY src/ /app/src/
ENTRYPOINT ["npm", "start"]