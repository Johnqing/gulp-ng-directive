'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var File = gutil.File;
var ngDirectiveParser = require('ng-directive-parser');

module.exports = function (options) {
	var elements = [];
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

		directives.forEach(function(d){
			if(d && d.restrict.E){
				elements.push(d.name.replace(/([A-Z])/g, '-$1').toLowerCase());
			}
		});

		if(!options.outfile){
			this.push(file);
			cb();
			return
		}

		fs.writeFileSync(options.outfile, JSON.stringify(elements));
		this.push(file);
		cb();
	});

};