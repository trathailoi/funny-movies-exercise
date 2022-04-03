# --------------------------------------------------
FROM node:17-alpine AS base
WORKDIR /vue-app
ENV NODE_ENV=development
COPY package*.json ./
# install git for those packages which require a git/ssh client. eg. vue-plyr
RUN apk add git
RUN npm i
# CMD [ "npm", "run", "serve" ]

# --------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production
COPY . /vue-app
RUN npm run build

# --------------------------------------------------
FROM nginx:stable-alpine AS production
COPY ./nginx/default.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /vue-app/dist /usr/share/nginx/html
