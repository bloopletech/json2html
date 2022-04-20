FROM node:12-alpine AS builder

WORKDIR /usr/src/app
ENV LANG="C.UTF-8"

RUN yarn global add inliner

COPY . .

RUN mkdir dist

RUN inliner < index.html > dist/index.html

# -a => archive mode, i.e. copy recursively and preserve permissions etc.
# Listing the source directories without a slash is intentional.
# It tells rsync to create e.g. dist/music and put the contents of music into dist/music.
RUN cp -a favicon.ico dist

FROM pierrezemb/gostatic
COPY --from=builder /usr/src/app/dist/ /srv/http/
