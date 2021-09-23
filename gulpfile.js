const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');


const ImgToApp = () => { 
    return src(['./src/img/**.jpg' , './src/img/**.png', './src/img/**.jpeg', './src/img/**.svg'])
    .pipe(imagemin({
    interlaced: true,
    progressive: true,
    optimizationLevel: 3,
    svgoPlugins: [{removeViewBox: false }]
    }))
    .pipe(dest('./app/img'));
}

const fonts = () => {
    src('./src/fonts/*.ttf')
        .pipe(ttf2woff())
        .pipe(dest('./app/fonts/'));
    return src('./src/fonts/*.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./app/fonts/'));
}


const cb = () => { }

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}


const scripts = () => { 
    return src('./src/js/main.js')
    .pipe(webpackStream({
        mode: 'development',
        output: {
            filename: 'main.js',
        },
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        },
    }))
    .on('error', function (err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}

const styles = () => {
    return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
    .pipe(autoprefixer({
			cascade: true,
            overrideBrowserslist: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11']
	}))
    .pipe(gcmq())
    .pipe(sourcemaps.write('.'))  
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
}

const htmlInclude = () => { 
    return src('./src/**.html')
    .pipe(fileinclude({
        prefix: '@',
        basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}


const clear = () => { 
   return del(['app/*']);
}
const watchFiles = () => { 
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });

    watch('./src/scss/**/*.scss', styles);
    watch('./src/**/*.html', htmlInclude);
    watch('./src/img/**.png' , ImgToApp);
    watch('./src/img/**.jpeg' , ImgToApp);
    watch('./src/img/**.jpg' , ImgToApp);
    watch('./src/img/**.svg' , ImgToApp);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/js/**/*.js', scripts);
}


exports.default = series(clear, parallel(htmlInclude, scripts, fonts,   ImgToApp), fontsStyle,    styles ,watchFiles);



const scriptsBuild = () => { 
    return src('./src/js/main.js')
    .pipe(webpackStream({
        mode: 'development',
        output: {
            filename: 'main.js',
        },
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        },
    }))
    .on('error', function (err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest('./app/js'))
}

const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
    .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
    .pipe(autoprefixer({
			cascade: false,
            overrideBrowserslist: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11']
	}))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(dest('./app/css/'))
}


exports.build = series(clear, parallel(htmlInclude, scriptsBuild, fonts,   ImgToApp), fontsStyle,    stylesBuild);