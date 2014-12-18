// npm install jquery, jplayer, and mime on most systems

var fs = require('fs');
var util = require('util');

var path = require('path');
var mime = require('mime');
var mkdirp = require('mkdirp');
var wrench = require('wrench');

var cheerio = require('cheerio'),
	$ = cheerio.load(fs.readFileSync('template.html','utf8'));

console.log($.html());

// Set the destination path for the html files to output

var destPath = 'soundboard';

var fileName = destPath + '/test.html';



var jqueryFile = 'node_modules/jquery/dist/jquery.js';
var jplayerFile = 'node_modules/jplayer/dist/jplayer/jquery.jplayer.js';

String.prototype.cleanup = function() {
   return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

String.prototype.lazycleanup = function() {
   return this.replace(/[^a-zA-Z0-9]+/g, " ");
}


function copyme(oldPath, newPath) {
	newFile = fs.createWriteStream(newPath);
	oldFile = fs.createReadStream(oldPath);
	oldFile.pipe(newFile);
	oldFile.on('end', function(){ console.log('Copied ' + oldPath + ' to ' + newPath)});
}

// path.basename requires an extension to be provided to work the split, so we pass path.extname to provide it.
function easybase(req)
{
	return path.basename(req,path.extname(req));
}

function readInlineScript(req) {
	return '<script type="text/javascript">' + fs.readFileSync(req,'utf8') + '</script>';
}

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(src), data);
}

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

function soundDiv(index, name, cssClass, path, type)
{
	var myDiv = $('<div />');
	return '<div id="sound-'+index+'" class="soundtile '+cssClass+'" data-name="'+ name +'" data-path="'+path+'" data-type="'+type+'" />';
}

var index;
var relSoundPath = 'sample_sounds/';
var soundPath = path.join(destPath,relSoundPath);
var root = path.dirname(path.relative(soundPath, soundPath));
for (index = 0; index < mylist.length; ++index) {
        var status = fs.statSync(path.join(soundPath,mylist[index]))
	if (status.isFile()) {
		var soundParent = path.dirname(path.relative(soundPath, path.join(soundPath + mylist[index])));
		var myClass;
		if (root === soundParent) {
			// Do stuff with sound files in root path here.
			myClass = "root"
			console.log('Assigned class: ' + myClass);
		}
		else {
			// Do stuff with sound files outside root path.
			myClass = soundParent.cleanup();
			console.log(soundPath);
			console.log('Assigned class: ' + "nonroot-" + myClass);
			console.log(webpath(soundPath + mylist[index]));
		}

		console.log(path.relative(relSoundPath, relSoundPath + mylist[index]));

		console.log(soundDiv(index, easybase(mylist[index]).lazycleanup(), myClass, webpath(path.join(relSoundPath + mylist[index])), 'type'));

	}
}

var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {
  stream.end($.html());
});
