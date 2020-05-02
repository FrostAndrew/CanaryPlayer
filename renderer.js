// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
    /*
        * Frameworks` vars
    */
const fs = require('fs');
const path = require('path');
const $ = require( "jquery" );
const { createPopper } = require('@popperjs/core');
const ipcRenderer = require('electron').ipcRenderer;
const {Howler, Howl} = require('howler/src/howler.core');

    /*
        * My vars
    */

const varsCss = {
    $lightThemeColorBack: '#f5e3cd',
    $lightThemeColorControls: '#62210b',
    $lightThemeColorControlsBack: '#ffffff'
}
let Templates = {
    playButton: `<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>`,
    stopButton: `<path d="M5.5 3.5A1.5 1.5 0 017 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zm5 0A1.5 1.5 0 0112 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z"/>`
}
let playState = {
    isPlaying: false,
    playingId: 0,
    volume: 1.0,
    loop: false,
    mute: false
}

let progressEl = document.getElementById('progress');
let timePopper = document.getElementById('timePopper');
let progressBar = document.getElementById('progressBar');
let songNameLabel = document.getElementById('play-label');

let myHowl;


    /*
        * Script
    */

progressBar.addEventListener('mousemove',
    ( event ) => {
        createPopper(progressBar, timePopper, {
            placement: 'top',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [event.offsetX - progressBar.offsetWidth / 2, 0]
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

$('.volume-range').bind('change mousemove', function() {
    playState.volume = $(this).val();
    if(myHowl) {
        myHowl.volume(playState.volume);
        console.log(myHowl);
    }
    let style = 'linear-gradient(to right, ' + varsCss.$lightThemeColorControls + ' 0%, '
    + varsCss.$lightThemeColorControls + ' '
    + playState.volume*100 + '%, '+varsCss.$lightThemeColorControlsBack+' ' + playState.volume*100 + '%'
    $(this).css(
        'background',
        style
    );
    // console.log(style)
});

ipcRenderer.invoke('getSongsPaths').then(r=> {
    SongsPaths = r;
    myHowl = new Howl({
        src: SongsPaths,
        autoplay: false,
        loop: false,
        volume: playState.volume,
        mute: playState.mute,

    })
    playState.playingId = myHowl.play()
    console.log(myHowl.pause());
})


    /*
        *Functions to use in the script
    */

function PlayPause (element) {
    if (!myHowl) return;
    element.innerHTML = playState.isPlaying? Templates.stopButton : Templates.playButton;
    playState.isPlaying = !playState.isPlaying;
    playState.isPlaying? myHowl.pause() : myHowl.play();
}


