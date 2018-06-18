import * as Path from 'path';
import * as Gulp from 'gulp';
import * as GulpChanged from 'gulp-changed';
import * as GulpTypeScript from 'gulp-typescript';

/**
 * Gulpfile введен в разработку пока лишь с одной целью:
 * копировать JSON и XML файлы из src в dist.
 */

const tsProject = GulpTypeScript.createProject('tsconfig.json');
const tsConfig = require('./tsconfig.json');
const tsConfigBaseUrl = tsConfig.compilerOptions.baseUrl;
const tsConfigOutDir = tsConfig.compilerOptions.outDir;

/**
 * Копирование файлов JSON и XML из src в dist.
 */
Gulp.task('copyFiles', function() {
	const src = (
		['**/*.json', '**/*.xml']
			.map(dir => Path.join(tsConfigBaseUrl, 'lib', dir))
	);
	return (
		Gulp.src(src, {base: tsConfigBaseUrl})
			.pipe(GulpChanged(tsConfigOutDir))
			.pipe(Gulp.dest(tsConfigOutDir))
	);
});

/**
 * Компиляция проекта в директорию dist.
 */
Gulp.task('tsc', Gulp.parallel('copyFiles', function() {
	return (
		tsProject.src()
			.pipe(GulpChanged(tsConfigOutDir, {extension: '.js'}))
			.pipe(tsProject())
			.pipe(Gulp.dest(tsConfigOutDir))
	);
}));