'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var File = gutil.File;
var ngDirectiveParser = require('ng-directive-parser');

module.exports = function (options) {

	return through.obj(function (file, enc, cb){
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-ng-directive', 'Streaming not supported'));
			return cb();
		}
		var filePath = file.path;

		var directives = ngDirectiveParser.parseFile(filePath);
		var elements = '';

		directives.forEach(function(d){
			if(d && d.restrict.E){
				elements += d.name.replace(/([A-Z])/g, '-$1').toLowerCase() + ',';
			}
		});

		if(!options.outfile){
			this.push(file);
			cb();
			return
		}
		fs.open(options.outfile, 'a', function(err, fd) {
			if(err){
				throw new Error(err);
			}
			fs.write(fd, elements, function(err){
				if(err){
					throw new Error(err);
				}
			});
		});


		this.push(file);
		cb();
	});

};