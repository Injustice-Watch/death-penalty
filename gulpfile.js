var gulp = require('gulp');

var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

var nunjucksRender = require('gulp-nunjucks-render');

var image = require('gulp-image');

gulp.task('sass', function() {
  return gulp.src('app/styles/main.scss')
  	.pipe(sass())
  	.pipe(gulp.dest('app/css'))
  	.pipe(browserSync.reload({
  		stream: true
  	}))
});

gulp.task('nunjucks',function(){
	
	return gulp.src('app/templates/index.html')
	.pipe(nunjucksRender({
		path: ['app/templates']
	}))
	.pipe(gulp.dest('app'))
	
});

gulp.task('assets',function(){
	
	return gulp.src('app/assets/*')
	.pipe(gulp.dest('dist/assets'))
	
});

gulp.task('styles',function(){
	
	return gulp.src('app/css/main.css')
	.pipe(gulp.dest('dist/css'))
	
});

gulp.task('numbers1',function(){

	return gulp.src('app/numbers/output_for_graphic.csv')
	.pipe(gulp.dest('dist/numbers'));

});

gulp.task('numbers2',function(){

	return gulp.src('app/numbers/methods_for_graphic.csv')
	.pipe(gulp.dest('dist/numbers'));
	
});

gulp.task('d3',function(){

	return gulp.src('node_modules/d3/build/d3.min.js')
	.pipe(gulp.dest('dist/js'));
	
});

gulp.task('lodash',function(){
	
	return gulp.src('node_modules/lodash/lodash.min.js')
	.pipe(gulp.dest('dist/js'));
	
});

gulp.task('jquery',function(){

	return gulp.src('node_modules/jquery/dist/jquery.min.js')
	.pipe(gulp.dest('dist/js'));

});

gulp.task('dependencies',['d3','lodash','jquery'],function(){

}); 

/*gfx*/

gulp.task('graphic-01',function(){
	
	return gulp.src('app/graphic-01/*')
	.pipe(gulp.dest('dist/graphic-01'));
	
});

gulp.task('graphic-02',function(){

	return gulp.src('app/graphic-02/*')
	.pipe(gulp.dest('dist/graphic-02'));
	
});
gulp.task('build',['sass','assets','styles','numbers1','numbers2','dependencies','nunjucks', 'graphic-01','graphic-02'],function(){
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function(){
	browserSync.init({
		server:{
			baseDir: 'app'
		},
	})
});

gulp.task('watch',['browserSync', 'nunjucks','sass'],function(){
	gulp.watch('app/styles/**/*.scss', ['sass']);
	gulp.watch('app/templates/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js',browserSync.reload);
});




