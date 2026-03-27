FROM owncloudci/nodejs:20 AS stage
ARG server=ocis

WORKDIR /extension

COPY . .
RUN make install-${server}
RUN pnpm build

FROM alpine:3.20
WORKDIR /app
COPY --from=stage /extension/dist ./
