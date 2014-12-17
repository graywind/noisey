// npm install jquery, jplayer, and mime on most systems

var fs = require('fs');
var util = require('util');

var path = require('path');
var mime = require('mime');
var mkdirp = require('mkdirp');
var wrench = require('wrench');


// Set the destination path for the html files to output

var destPath = 'soundboard';

var fileName = destPath + '/test.html';



var jqueryFile = 'node_modules/jquery/dist/jquery.js';
var jplayerFile = 'node_modules/jplayer/dist/jplayer/jquery.jplayer.js';

String.prototype.cleanup = function() {
   return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

function copyme(oldPath, newPath) {
	newFile = fs.createWriteStream(newPath);
	oldFile = fs.createReadStream(oldPath);
	oldFile.pipe(newFile);
	
	oldFile.on('end', function(){ console.log('Copied ' + oldPath + ' to ' + newPath)});
}

function readInlineScript(req) {
	return '<script type="text/javascript">' + fs.readFileSync(req,'utf8') + '</script>';
}

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(src), data);
}

function buildHtml(req) {
  var supportingCode = '';			
	
  var header = fs.readFileSync('head.html','utf8');
  var body = fs.readFileSync('body.html','utf8');

  return '<!DOCTYPE html>'
       + '<html><header><meta http-equiv="Content-Type" content="text/html; charset=utf-8">' + supportingCode + header + '</header><body>' + body + '</body></html>';
};


function webpath(origPath)
{
	var pathArray = origPath.split(path.sep);
	var newPath = '/';
	var index;
	for (index = 0; index < pathArray.length; ++index) {
		console.log(pathArray[index]);
		newPath = newPath + encodeURIComponent(pathArray[index]);

		// Add the separator if needed from a deep dir;
		if (index + 1 < pathArray.length)
	    {
			newPath = newPath + '/';
		}
	}
	return newPath;
}



mkdirp(destPath);

var codePath = destPath + '/src';

mkdirp(codePath);


//copy the required source files
copyme('node_modules/isotope-layout/dist/isotope.pkgd.min.js', codePath + '/isotope.pkgd.min.js');
copyme('node_modules/jquery/dist/jquery.min.js', codePath + '/jquery.min.js');
copyme('node_modules/jquery/dist/jquery.min.map', codePath + '/jquery.min.map');
copyme('node_modules/jplayer/dist/jplayer/jquery.jplayer.min.js', codePath + '/jquery.jplayer.min.js');
copyme('node_modules/jplayer/dist/jplayer/jquery.jplayer.swf', codePath + '/jquery.jplayer.swf');
copyme('node_modules/normalize.css/normalize.css', codePath + '/normalize.css');
copyme('main.css', codePath + '/main.css');
copyme('main.js', codePath + '/main.js');
wrench.copyDirSyncRecursive('node_modules/jplayer/dist/skin', codePath + '/skin', {forceDelete: true});

var mylist = wrench.readdirSyncRecursive(destPath + '/sample_sounds');



var index;
var soundPath = destPath + '/sample_sounds/';
var root = path.dirname(path.relative(soundPath, soundPath));
for (index = 0; index < mylist.length; ++index) {
        var status = fs.statSync(soundPath + mylist[index])
	if (status.isFile()) { 
		var soundParent = path.dirname(path.relative(soundPath, soundPath + mylist[index]));
		if (root === soundParent) {
			// Do stuff with sound files in root path here.
			var myclass = ".root"
			console.log('Assigned class: ' + myclass);
		}
		else {
			// Do stuff with sound files outside root path.
			var myclass = soundParent.cleanup();
			console.log('Assigned class: ' + ".nonroot-" + myclass);
			console.log(webpath(soundParent));
		}
		
		console.log(path.relative(destPath + '/sample_sounds/', destPath + '/sample_sounds/' + mylist[index]));
	}
}

var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {

  var html = buildHtml();
  stream.end(html);
});
