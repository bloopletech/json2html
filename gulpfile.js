const { promises: fs } = require("fs");
const { task, src, dest } = require("gulp");
const inliner = require("gulp-inliner");

function promisify(p) {
   return new Promise((res, rej) => p.on("error", err => rej(err)).on("end", () => res()));
}

async function build() {
  await fs.rmdir("dist", { recursive: true, force: true });
  await promisify(src("index.html")
    .pipe(inliner())
    .pipe(src("favicon.ico"))
    .pipe(dest("dist")));
}

exports.build = build;
exports.default = build;