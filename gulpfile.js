const { promises: fs } = require("fs");
const { task, src, dest, series } = require("gulp");
const inliner = require("gulp-inliner");
const { exec } = require("child_process");

function promisify(p) {
   return new Promise((res, rej) => p.on("error", err => rej(err)).on("end", () => res()));
}

async function build() {
  await fs.rmdir("docs", { recursive: true, force: true });
  await promisify(src("index.html")
    .pipe(inliner())
    .pipe(src(["favicon.ico", "CNAME"]))
    .pipe(dest("docs")));
}

function package() {
  return exec("git add -A docs && git commit -m 'Package'");
}

exports.build = build;
exports.package = package;
exports.default = series(build, package);