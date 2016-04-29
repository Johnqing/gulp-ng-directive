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

		var directives = ngDirectiveParser.parseFile(file);
		var elements = ['ng-include', 'ng-pluralize', 'ng-view', 'ng:include', 'ng:pluralize', 'ng:view'];

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

		fs.writeFile(options.outfile, JSON.stringify(elements), function(err){
			if(err){
				throw new Error(err);
			}
		});

	    this.push(file);
	    cb();
    });

};