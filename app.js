// npm install jquery, jplayer, and mime on most systems

var fs = require('fs');
var util = require('util');

var path = require('path');
var mime = require('mime');
var mkdirp = require('mkdirp');
var wrench = require('wrench');

var cheerio = require('cheerio'),
	$ = cheerio.load(fs.readFileSync('template.html','utf8'));



// Set the destination path for the html files to output

var destPath = 'soundboard';

var fileName = destPath + '/index.html';



var jqueryFile = 'node_modules/jquery/dist/jquery.js';
var jplayerFile = 'node_modules/jplayer/dist/jplayer/jquery.jplayer.js';

String.prototype.cleanup = function() {
   return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

String.prototype.lazycleanup = function() {
   return this.replace(/[^a-zA-Z0-9/-]+/g, " ");
}

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

function copyme(oldPath, newPath) {
	newFile = fs.createWriteStream(newPath);
	oldFile = fs.createReadStream(oldPath);
	oldFile.pipe(newFile);
	//oldFile.on('end', function(){ console.log('Copied ' + oldPath + ' to ' + newPath)});
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
	var newPath = '';
	var index;
	for (index = 0; index < pathArray.length; ++index) {
		//console.log(pathArray[index]);
		newPath = newPath + encodeURIComponent(pathArray[index]);

		// Add the separator if needed from a deep dir;
		if (index + 1 < pathArray.length)
	    {
			newPath = newPath + '/';
		}
	}
	return newPath;
}

function getExtension(path) {
	var myMime = mime.extension(mime.lookup(path));
	var myExtension;
	switch (myMime) {
		case 'mpga':
			return 'mp3';
			break;
		case 'wav':
			return 'wav';
			break;
		default:
			console.log('I broke! Unsupported type?');
			return 'bad';
			break;
	}
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
copyme('node_modules/wavesurfer.js/build/wavesurfer.cjs.js', codePath + '/wavesurfer.cjs.js');
copyme('node_modules/wavesurfer.js/build/wavesurfer.min.js', codePath + '/wavesurfer.min.js');
copyme('node_modules/wavesurfer.js/plugin/wavesurfer.timeline.js', codePath + '/wavesurfer.timeline.js');
//copyme('node_modules/normalize.css/normalize.css', codePath + '/normalize.css');
copyme('main.css', codePath + '/main.css');
copyme('main.js', codePath + '/main.js');
copyme('images/hash.png', codePath + '/hash.png');
wrench.copyDirSyncRecursive('node_modules/jplayer/dist/skin', codePath + '/skin', {forceDelete: true});
wrench.copyDirSyncRecursive('node_modules/twitter-bootstrap-3.0.0/dist', codePath + '/bootstrap', {forceDelete: true});

var mylist = wrench.readdirSyncRecursive(destPath + '/sample_sounds');

function soundDiv(index, name, cssClass, path, type)
{
	var myDiv = $('<div></div>');
	myDiv.attr('id','sound-'+index);
	myDiv.addClass('soundtile');
	myDiv.addClass(cssClass.cleanup());
	myDiv.attr('data-name',name);
	myDiv.attr('data-path',path);
	myDiv.attr('data-type',type);
	myDiv.attr('data-filter',path);
	
	myDiv.append('<div class="outerCenterDiv"><div class="innerCenterDiv"><p>' + htmlEncode(name) + '</p></div></div>');
	if (type != 'bad')
	{
	soundNav(name,cssClass);
	$('#tileSpace').append('\n\t\t\t' + myDiv);
	}
}	

function soundNav(name,cssClass) {
	var myClass = 'filterToggle-' + cssClass.cleanup()

	if ($('#' + myClass).length){
		console.log('found');
	}
	else { 
		//$('#filterList').before('<li><a id="'+myClass+'" class="filter" data-filter=".'+cssClass.cleanup()+'" href="#">'+ htmlEncode(cssClass) +'</a></li>')

		$('#filterList').before('<button type="button" class="btn btn-default btn-lg btn-block filter" id="'+myClass+'" data-dismiss="modal" data-filter=".'+cssClass.cleanup()+'">'+ htmlEncode(cssClass) +'</button>')
		console.log('not found');
	}
	
}

var index;
var relSoundPath = 'sample_sounds/';
var soundPath = path.join(destPath,relSoundPath);
var root = path.dirname(path.relative(soundPath, soundPath));
for (index = 0; index < mylist.length; ++index) {
        var status = fs.statSync(path.join(soundPath,mylist[index]));
	if (status.isFile()) {
		var soundParent = path.dirname(path.relative(soundPath, path.join(soundPath + mylist[index])));
		var extension = getExtension(path.join(soundPath,mylist[index]));
		var myClass;
		if (root === soundParent) {
			// Do stuff with sound files in root path here.
			myClass = "root"
			//console.log('Assigned class: ' + myClass);
		}
		else {
			// Do stuff with sound files outside root path.
			//myClass = soundParent.cleanup();
			//console.log(soundPath);
			//console.log('Assigned class: ' + "nonroot-" + myClass);
			console.log(webpath(path.join(soundPath,mylist[index])));
			var pathArray = soundParent.split(path.sep);
			myClass = pathArray[pathArray.length - 1];
			console.log(pathArray[pathArray.length - 1]);
		}

		console.log(path.relative(relSoundPath, relSoundPath + mylist[index]));
		soundDiv(index, easybase(mylist[index]).lazycleanup(), myClass, webpath(path.join(relSoundPath + mylist[index])), extension);
		

	}
}


$('#tileSpace').append('\n\t\t');

var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {
  stream.end($.html());
});
