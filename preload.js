// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

/*export var Playlist = new Howl({

})*/
const {Howl, Howler} = require('howler');
const fs = require('fs');
var $ = require( "jquery" );
app.allowRendererProcessReuse = true;

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

function loadSongs() {
  fs.readdir(__dirname, (dir) => {
    // es6
    for(let filePath of dir) {
      console.log(filePath);
    }
  })
}
loadSongs();
