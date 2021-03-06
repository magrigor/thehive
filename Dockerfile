FROM node:14.5.0-alpine3.12 AS node
ENV NODE_OPTIONS --unhandled-rejections=strict --enable-source-maps
WORKDIR /app

COPY package.json \
  package-lock.json \
  ./



#
# Stage: Development NPM install
#
FROM node AS npm-dev

RUN npm ci



#
# Stage: Development environment
#
FROM node AS dev
ENV NODE_ENV=development
ENV PRETTY_LOG=true

COPY .eslintignore \
  .eslintrc.js \
  jest.config.js \
  tsconfig.json \
  tsconfig.dev.json \
  .dependency-cruiser.js \
  ./
COPY --from=npm-dev /app/ .
COPY test/ test/
COPY src/ src/
COPY static/ static/
COPY scripts/ scripts/
COPY data/ data/

CMD ["npm", "run", "start:dev"]



#
# Stage: Production build
#
FROM dev AS build-prod
ENV NODE_ENV=production

RUN npm run build



#
# Stage: Production NPM install
#
FROM node AS npm-prod

RUN npm ci --production



#
# Stage: Production environment
#
FROM node AS prod
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .
COPY --from=build-prod /app/build/ build/
COPY static/ static/
COPY data/ data/

HEALTHCHECK --interval=5s --timeout=1s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ping || exit 1

CMD ["npm", "run", "start"]
