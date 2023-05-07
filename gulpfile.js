const { src, dest, parallel } = require('gulp');
const rename = require('gulp-rename');

function build(cb) {
    return src('./src/cachelib.js')
        .pipe(rename({ basename: 'index' }))
        .pipe(dest('./dist'));
}

function copyPackageMetafile() {
    return src('./package.json')
        .pipe(dest('./dist'));
}

module.exports.build = parallel(build, copyPackageMetafile);

