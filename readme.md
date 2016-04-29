# gulp-ng-directive

```
npm install gulp-ng-directive
```

## use

```
var gulp = require('gulp');
var gulpNgDirective = require('gulp-ng-directive');
gulp.task("", function(callback) {
    gulp.src('directives/*.js')
    .pipe(gulpNgDirective({
        outfile: __dirname + 'a.json'
    }))
    .pipe(gulp.dest('build'))
});
```