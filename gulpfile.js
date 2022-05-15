"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
//const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const browsersync = require("browser-sync").create();


var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/img/",
        fonts: "dist/assets/fonts/"
    },
    src: {
        html: "src/*.html",
        js: "src/assets/js/*.js",
        libsJs: "src/assets/js/libs/*.js",
        css: "src/assets/sass/style.scss",
        libsCss: "src/assets/sass/libs/*.css",
        images: "src/assets/img/**/*.{jpg,png,ico,svg,webp,mp4,webm}",
        svg: "src/assets/svg/*.svg",
        fonts: "src/assets/fonts/*.{ttf,eot,woff,woff2}"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.{scss,css}",
        images: "src/assets/img/**/*.{jpg,png,ico,svg,webp,mp4,webm}",
        svg: "src/assets/svg/*.svg",
        fonts: "src/assets/fonts/*.{ttf,eot,woff,woff2}"
    },
    clean: "./dist"
}



function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload();
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: "./src/" })
        .pipe(plumber())
        .pipe(panini({
            root: "src/",
            layouts: "src/tpl/layouts/",
            partials: "src/tpl/partials/",
            helpers: "src/tpl/helpers/",
            data: "src/tpl/data/",
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, { base: "./src/assets/sass/" })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions'],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function libsCss() {
    return src(path.src.libsCss)
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js, { base: "./src/assets/js/" })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function libsJs() {
    return src(path.src.libsJs)
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.images)
        .pipe(dest(path.build.images))
}

function svg() {
    return src(path.src.svg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace('<symbol viewbox', '<symbol fill="currentColor" viewbox'))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.css], libsCss);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.js], libsJs);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.svg], svg);
}

const build = gulp.series(clean, gulp.parallel(html, css, libsCss, js, libsJs, images, svg, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.libsCss = libsCss;
exports.js = js;
exports.libsJs = libsJs;
exports.images = images;
exports.svg = svg;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;