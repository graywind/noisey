$(document).ready(function(){

	$('#playerBox').hide();

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
	
	$('.soundtile').click(function() {
		console.log(this.dataset);
			$('#playerBox').fadeIn();
			var info = this.dataset;
			$("#jquery_jplayer_1").jPlayer("destroy");
			console.log(info);
		    $('#jquery_jplayer_1').jPlayer({
				ready: function (event) {
						$(this).jPlayer("setMedia", {
							title: info.name,
							wav: info.path
						}).jPlayer("play");
					},
				
				/// Loop after player
				// ended: function() {
				//	$(this).jPlayer("play");
				//},
				swfPath: '/src',
				solution: 'html, flash',
				supplied: 'wav',
				preload: 'metadata',
				volume: 1,
				muted: false,
				backgroundColor: '#000000',
				cssSelectorAncestor: '#jp_container_1',
				cssSelector: jplayerCssSelector,
				errorAlerts: false,
				warningAlerts: false
			});

	});
	//$("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer_1")});
});
