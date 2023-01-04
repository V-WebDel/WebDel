const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const pug = require('gulp-pug');
const formatHtml = require('gulp-format-html');
const imagemin = require('gulp-imagemin');
const webpp = require('gulp-webp');
const svgsprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const del = require('del');


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false,
        online: true
    })
}

function scripts() {
    return src([
            'app/libs/svgxuse-master/svgxuse.min.js',
            'node_modules/swiper/swiper-bundle.min.js',
            'node_modules/gsap/dist/gsap.min.js',
            'node_modules/gsap/dist/ScrollTrigger.min.js',
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream()) // Триггер обновления страницы
}

function mainscripts() {
    return src([
            'app/js/main.js'
        ])
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))

        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(rename({
            basename: "main"
        }))
        .pipe(dest('dist/js/'))
        .pipe(browserSync.stream()) // Триггер обновления страницы
}

function styles() {
    return src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/swiper/swiper-bundle.min.css',
        ])

        .pipe(concat('styles.min.css')) // Конкатенируем в styles.min.css
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream()) // Триггер обновления страницы
}

function changestyles() {
    return src('app/scss/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        })) // Создадим префиксы с помощью Autoprefixer
        .pipe(sourcemaps.write('.'))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream()) // Триггер обновления страницы
}

function mainstyles() {
    return src('app/scss/main.scss')
        .pipe(plumber())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        })) // Создадим префиксы с помощью Autoprefixer
        .pipe(cleancss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        })) // Минифицируем стили
        .pipe(dest('dist/css/'))
}

function pug2html() {
    return src('app/pug/*.pug')
        .pipe(plumber())
        .pipe(pug().on("error", notify.onError()))
        .pipe(formatHtml())
        .pipe(dest('app/'))
        .pipe(browserSync.stream()) // Триггер обновления страницы
}

function images() {
    return src([
            'app/img/**/*.png',
            'app/img/**/*.jpeg',
            'app/img/**/*.jpg',
            'app/img/**/*.webp',
        ]) // Источник изображений
        .pipe(imagemin({ // Сжимаем и оптимизируем изображения
            progressive: true,
            interlaced: true,
            optimizationLevel: 4,
        }))
        .pipe(dest('dist/img/')) // Выгружаем оптимизированные изображения в папку назначения
}


// Convert images to WEBP
function webp() {
    return src([
            'app/img/**/*.png',
            'app/img/**/*.jpeg',
            'app/img/**/*.jpg',
        ])
        .pipe(newer('dist/img/')) // Проверяем, было ли изменено изображение ранее
        .pipe(imagemin({ // Сжимаем и оптимизируем изображения
            progressive: true,
            interlaced: true,
            optimizationLevel: 4,
        }))
        .pipe(webpp())
        .pipe(dest('app/img/webp/'))
}

// SVG-sprite
function svgSprite() {
    return src([
            'app/SVG-for-sprite/*.svg' // SVG файлы для спрайта
        ])
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(svgsprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg" // Имя файла SVG-спрайта
                }
            }
        }))
        .pipe(dest('app/img/'))
}

function cleandist() {
    return del('dist/**/*', {
        forse: true
    })
}

function buildcopy() {
    return src([
            'app/*.html',
            'app/css/**/*.css',
            '!app/css/**/*.map',
            'app/js/**/*.js',
            'app/favicons/**/*',
            'app/fonts/**/*',
            'app/img/**/*.svg',
        ], {
            base: 'app'
        })
        .pipe(dest('dist'));
}

function startwatch() {
    watch(['app/scss/**/*'], changestyles);
    watch(['app/js/main.js']).on('change', browserSync.reload);
    watch(['app/pug/**/*.pug'], pug2html);
    watch(['app/img/**/*', '!app/img/webp/*'], webp);
}


exports.browsersync = browsersync;
exports.mainscripts = mainscripts;
exports.scripts = scripts;
exports.mainstyles = mainstyles;
exports.changestyles = changestyles;
exports.styles = styles;
exports.pug2html = pug2html;
exports.images = images;
exports.webp = webp;
exports.svgSprite = svgSprite;


exports.build = series(cleandist, pug2html, scripts, styles, images, buildcopy, mainscripts, mainstyles);
exports.default = parallel(scripts, changestyles, styles, pug2html, browsersync, startwatch);