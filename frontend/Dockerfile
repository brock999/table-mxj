FROM node:lts-bullseye AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts-bullseye AS builder
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM nginx:alpine
RUN apk add nodejs npm
ENV NODE_ENV production
ENV TZ="Asia/Shanghai"
WORKDIR /app
COPY --from=builder /app /app
ADD nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x entrypoint.sh
CMD ./entrypoint.sh
