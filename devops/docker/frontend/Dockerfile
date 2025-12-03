FROM node:20.8.1-alpine as base

FROM base AS deps

WORKDIR /srv

COPY client/package.json client/package-lock.json ./

RUN npm ci


FROM deps AS build

WORKDIR /srv

RUN apk add --no-cache chromium
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

COPY --from=deps /srv/node_modules ./node_modules
COPY client .

RUN npm run build

FROM nginx:1.20.2-alpine
LABEL org.opencontainers.image.source https://github.com/geomatico/taxomap4

COPY --from=build /srv/dist/ /usr/share/nginx/html/