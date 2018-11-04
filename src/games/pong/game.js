class Pong {
  constructor() {
    this.canvas = document.getElementById('game');
    // compute based on real screen size
    this.canvas.width = window.screen.width;
    this.canvas.height = window.screen.height;
    this.context = this.canvas.getContext('2d');

    this.configureCommands();
    // Clear canvas
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  configureCommands() {
    this.canvas.addEventListener('dblclick', () => {
      // Fullscreen still not implemented as defined in spcecification by current browsers, support only to Mozilla Firefox here
      // if (document.fullscreenEnabled) {
      if (document.mozFullScreenEnabled) {
        //if (!document.fullscreenElement) {
        if (!document.mozFullScreenElement) {
          // this.canvas.requestFullscreen();
          this.canvas.mozRequestFullScreen();
        } else {
          //document.exitFullscreen();
          document.mozCancelFullScreen();
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new Pong();
});
