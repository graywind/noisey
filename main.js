$(document).ready(function(){

$('#jquery_jplayer_1').jPlayer({
	ready: function (event) {
			$(this).jPlayer("setMedia", {
				title: "Bubble",
				m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
				oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
			});
		},
	swfPath: '/src',
	solution: 'html, flash',
	supplied: 'm4a, oga',
	preload: 'metadata',
	volume: 0.8,
	muted: false,
	backgroundColor: '#000000',
	cssSelectorAncestor: '#jp_container_1',
	cssSelector: {
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
	},
	errorAlerts: false,
	warningAlerts: false
});

	var $container = $('#tileSpace');
	$container.isotope({
		itemSelector: '.soundtile',
		layoutMode: 'fitRows'
	});

	//$("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer_1")});
});
