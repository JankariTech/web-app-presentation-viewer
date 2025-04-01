FROM owncloudci/nodejs:20 AS stage
ARG system=Ocis

WORKDIR /extension

COPY . .
RUN make install$system
RUN pnpm build

FROM alpine:3.20
WORKDIR /app
COPY --from=stage /extension/dist ./
