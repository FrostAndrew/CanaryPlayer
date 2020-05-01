// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const $ = require( "jquery" );
const { createPopper } = require('@popperjs/core');

let Templates = {
    playButton: `<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>`,
    stopButton: `<path d="M5.5 3.5A1.5 1.5 0 017 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zm5 0A1.5 1.5 0 0112 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z"/>`,
    timePopper: `<div class="bg-dark" id="timePopper"></div>`
}
let playState = {
    isPlaying: false,
    playingId: 0
}
let mouseX = 0
let AudioPath = '../assets/audio'
let progressBar = document.getElementById('progressBar');
let timePopper = document.getElementById('timePopper');
progressBar.addEventListener('mousemove',
    ( event ) => {
        createPopper(progressBar, timePopper, {
            placement: 'top',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [event.offsetX - progressBar.offsetWidth / 2, 5]
                    }
                },
            ]
        })
    })
progressBar.addEventListener('mouseleave', ()=>{
    timePopper.hidden = true;
})
progressBar.addEventListener('mouseenter', ()=>{
    timePopper.hidden = false;
})
function PlayPause (element) {
    playState.isPlaying = !playState.isPlaying;
    element.innerHTML = playState.isPlaying? Templates.stopButton : Templates.playButton;


}
