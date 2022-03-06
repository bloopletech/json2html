FROM node:12-alpine AS builder

WORKDIR /usr/src/app
ENV LANG="C.UTF-8"

RUN yarn global add inliner

COPY . .

RUN mkdir dist

# --nosvg => otherwise will strip HTML IDs off of SVG elements
# --noimages => otherwise will inline all images, even if they are huge and not really base64-friendly
# sed command fixes image URLs in the CSS so that they are relative to the page URL
RUN inliner --nosvg --noimages < index.html | sed -e 's/url("..\//url("/g' > dist/index.html

# -a => archive mode, i.e. copy recursively and preserve permissions etc.
# Listing the source directories without a slash is intentional.
# It tells rsync to create e.g. dist/music and put the contents of music into dist/music.
RUN cp -a images favicon.ico .user.ini get.php dist

FROM nginx:1.17.9-alpine

COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
