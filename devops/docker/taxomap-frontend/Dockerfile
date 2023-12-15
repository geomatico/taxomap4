FROM node:20.8.1-alpine as base

FROM base as deps

WORKDIR /srv

COPY package.json package-lock.json ./

RUN npm ci


FROM deps as build

WORKDIR /srv

RUN apk add --no-cache chromium
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

COPY --from=deps /srv/node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:1.20.2-alpine

COPY --from=build /srv/dist/ /usr/share/nginx/html/