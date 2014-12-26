$(document).ready(function(){

	var myVolume = '0.8';
	var myMuted = false;

	//We need more pretty
	//$('#playerBox').fadeTo(0,0);
	//$('.soundtile').fadeTo(0,0);



var wavesurfer = Object.create(WaveSurfer);

wavesurfer.init({
    container: document.querySelector('#waveform'),
    waveColor: 'blue',
    progressColor: 'purple'
});

wavesurfer.on('ready', function () {
    wavesurfer.play();
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

var jplayerCssSelector = {
		videoPlay: '.jp-video-play',
		play: '.jp-play',
		pause: '.jp-pause',
		stop: '.jp-stop',
		seekBar: '.jp-seek-bar',
		playBar: '.jp-play-bar',
		mute: '.jp-mute',
		unmute: '.jp-unmute',
		volumeBar: '.jp-volume-bar',
		volumeBarValue: '.jp-volume-bar-value',
		volumeMax: '.jp-volume-max',
		playbackRateBar: '.jp-playback-rate-bar',
		playbackRateBarValue: '.jp-playback-rate-bar-value',
		currentTime: '.jp-current-time',
		duration: '.jp-duration',
		title: '.jp-title',
		fullScreen: '.jp-full-screen',
		restoreScreen: '.jp-restore-screen',
		repeat: '.jp-repeat',
		repeatOff: '.jp-repeat-off',
		gui: '.jp-gui',
		noSolution: '.jp-no-solution'
	}

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
		console.log(this.dataset);
			//$('#playerBox').fadeTo(500,1);
			var info = this.dataset;
			/*$("#jquery_jplayer_1").jPlayer("destroy");
			console.log(info);
		    var jplayerConfig = {};
			jplayerConfig[info.type] = info.path;
			jplayerConfig['title'] = info.name;
			console.log(jplayerConfig);
		    $('#jquery_jplayer_1').jPlayer({
				ready: function (event) {
						$(this).jPlayer("setMedia", jplayerConfig).jPlayer("play");
					},
				volumechange: function (event) {
                        myVolume = event.jPlayer.options.volume,
                        myMuted = event.jPlayer.options.muted;
                },
				
				/// Loop after player
				// ended: function() {
				//	$(this).jPlayer("play");
				//},
				swfPath: '/src',
				solution: 'html, flash',
				supplied: info.type,
				preload: 'metadata',
				volume: myVolume,
				muted: myMuted,
				backgroundColor: '#000000',
				cssSelectorAncestor: '#jp_container_1',
				cssSelector: jplayerCssSelector,
				errorAlerts: false,
				warningAlerts: false
			});*/
	wavesurfer.load(info.path);

	});
	
	//$("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer_1")});
});

// Window load will ensure images are in place if that is a thing
$(window).load(function() {
    $(".soundtile").each(function(i) {
       $(this).delay((i + 1) * 25).fadeTo("slow",1);
    });
});
