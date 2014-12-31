$(document).ready(function(){

var myVolume = '0.8';
var myMuted = false;

//We need more pretty
//$('#playerBox').fadeTo(0,0);
//$('.soundtile').fadeTo(0,0);

var wavesurfer = Object.create(WaveSurfer);

//button lights
if (repeat === false) {
		$("#replayLED").fadeTo( 500,0 );
		$("#replayToggle").removeClass("active");
	} else {
		$("#replayToggle").addClass("active");
	}

if (autoplay === false) {
		$("#autoplayLED").fadeTo( 500,0 );
		$("#autoplayToggle").removeClass("active");
	} else {
		$("#autoplayToggle").addClass("active");
	}

if (duck === false) {
		$("#duckLED").fadeTo( 500,0 );
		$("#duckToggle").removeClass("active");
	} else {
		$("#duckToggle").addClass("active");
	}


wavesurfer.init({
    container: document.querySelector('#waveform'),
    waveColor: 'blue',
    progressColor: 'purple'
});

wavesurfer.on('ready', function () {
	if (autoplay) {
		wavesurfer.play();
	}
});

wavesurfer.on('finish', function () {
	if (repeat) {
		wavesurfer.play();
	}
});

wavesurfer.on('error', function (err) {
    console.log(err);
});

wavesurfer.on('ready', function () {
    var timeline = Object.create(WaveSurfer.Timeline);

    timeline.init({
        wavesurfer: wavesurfer,
        container: "#wave-timeline"
    });
});


$(document).keydown(function(e){
	switch((e.keyCode ? e.keyCode : e.which)){
		case 32:
			e.preventDefault();
			wavesurfer.playPause();
			break;
		case 37:
			e.preventDefault();
			wavesurfer.skipBackward();
			break;
		case 39:
			e.preventDefault();
			wavesurfer.skipForward();
			break;
	}
	//console.log('keypress: ' + e.which + '!');
});

	var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);

	progressDiv.style.display = 'none';

	var $container = $('#tileSpace');
	$container.isotope({
		itemSelector: '.soundtile',
		layoutMode: 'fitRows'
	});
	
	$('.filter').click(function() {
		console.log(this.dataset.filter);
		$('.filter').parent().removeClass("active");
		$(this).parent().addClass("active");
		//console.log(this);
		$container.isotope({ filter: this.dataset.filter });
	});

	$('.soundtile').click(function() {
		//$('#playerBox').fadeTo(500,1);
		var info = this.dataset;
		wavesurfer.load(info.path);
	});

	$('#replayToggle').click(function() {
		
		if (repeat === false) { 
			repeat = true; 
			console.log("Repeat: ON");
			$(this).addClass("active");
		} else { 
			repeat = false;
			console.log("Repeat: OFF"); 
			$(this).removeClass("active");
		}
		led_trigger($("#replayLED"),repeat,100);
	});
	
	$('#autoplayToggle').click(function() {
		
		if (autoplay === false) { 
			autoplay = true; 
			console.log("Autoplay: ON");
			$(this).addClass("active");
		} else { 
			autoplay = false;
			console.log("Autoplay: OFF");
			$(this).removeClass("active"); 
		}
		led_trigger($("#autoplayLED"),autoplay,100);
	});
	$('#duckToggle').click(function() {
		
		duckVolume(volumeMultiplier);
	});

	function duckVolume() {
	if (duckTransition === false)
	{
		var fromValue;
		var toValue;
		duckTransition = true;
		if (volumeMultiplier === 1) { 
			fromValue = 1; 
			toValue = 0.25 
			duck = true;
			$('#duckToggle').addClass("active");
		} else { 
			fromValue = volumeMultiplier; 
			toValue = 1; 
			duck = false;
			$('#duckToggle').removeClass("active");
		}
		$({someValue:fromValue}).animate({someValue: toValue}, {
			duration: 500,
			easing:'swing', // can be anything
			step: function() { // called on every step
				// Update the element's text with rounded-up value:
				var tempValue = roundToTwo(this.someValue);
				console.log(tempValue);
				wavesurfer.setVolume(tempValue);
				volumeMultiplier = tempValue
			},
			done: function() {
				duckTransition = false;
			},
			start: function() {
				led_trigger($("#duckLED"),duck,500);
			}
		});
	}
}
});

// Window load will ensure images are in place if that is a thing
$(window).load(function() {
    $(".soundtile").each(function(i) {
       $(this).delay((i + 1) * 25).fadeTo("slow",1);
    });
});

var repeat = false;
var autoplay = true;
var volumeMultiplier = 1;
var duck = false;
var duckTransition = false;

function led_trigger(div, value, time) {
	if (value) {
		console.log("LED trigger on");
		div.fadeTo( time, 1 );
	} else {
		console.log("LED trigger off");
		div.fadeTo( time, 0 );
	}
}



function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


