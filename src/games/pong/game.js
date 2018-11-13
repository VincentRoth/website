const FPS = 30;

class Pong {
  constructor() {
    this.canvas = document.getElementById('game');
    // based on real screen size
    this.canvas.width = window.screen.width;
    this.canvas.height = window.screen.height;
    if (this.canvas.width < this.canvas.height) {
      this.canvas.width = window.screen.height;
      this.canvas.height = window.screen.width;
    }
    this.context = this.canvas.getContext('2d');

    this.initConfig();
    this.configureCommands();

    this.ball = new Ball(
      this.context,
      this.config.ball.radius,
      this.config.color.main,
      this.config.center.copy(),
      new Vector(this.canvas.width / 150, 0)
    );

    this.bar1 = new Bar(
      this.context,
      this.config.color.main,
      new Point(0, this.canvas.height / 2 - this.config.bar.dimension.y / 2),
      this.config.bar.dimension
    );

    this.bar2 = new Bar(
      this.context,
      this.config.color.main,
      new Point(
        this.canvas.width - this.config.bar.dimension.x,
        this.canvas.height / 2 - this.config.bar.dimension.y / 2
      ),
      this.config.bar.dimension
    );

    setInterval(() => this.render(), 1000 / FPS);
  }

  initConfig() {
    const netThickness = Math.max(this.canvas.width / 200, 2);
    this.config = {
      color: {
        background: 'black',
        main: 'white'
      },
      start: new Point(0, 0),
      end: new Point(this.canvas.width, this.canvas.height),
      center: new Point(this.canvas.width / 2, this.canvas.height / 2),
      net: {
        thickness: netThickness,
        top: new Point(this.canvas.width / 2 - netThickness / 2, 0),
        centerTop: new Point(netThickness, (this.canvas.height * 2) / 5),
        radius: this.canvas.height / 10,
        centerBottom: new Point(
          this.canvas.width / 2 - netThickness / 2,
          (this.canvas.height * 3) / 5
        ),
        bottom: new Point(netThickness, this.canvas.height)
      },
      ball: {
        radius: this.canvas.width / 100
      },
      bar: {
        dimension: new Vector(this.canvas.width / 100, this.canvas.height / 6)
      },
      winningScore: 7,
      text: {
        start: document.getElementById('game-start').innerText,
        leftPlayerWon: document.getElementById('game-left-player-won').innerText,
        rightPlayerWon: document.getElementById('game-right-player-won').innerText
      }
    };
    this.isGameOver = true;
    this.player1 = {
      position: null,
      score: 0
    };
    this.player2 = {
      position: null,
      score: 0,
      auto: true
    };
  }

  configureCommands() {
    const startGame = () => {
      this.isGameOver = false;
      this.player1.score = 0;
      this.player2.score = 0;
      this.ball.reset();
      this.bar1.reset();
      this.bar2.reset();
    }

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
    this.canvas.addEventListener('mousemove', event => {
      const rect = this.canvas.getBoundingClientRect();
      this.player1.position = new Point(
        ((event.clientX - rect.left) * this.canvas.width) / rect.width,
        ((event.clientY - rect.top) * this.canvas.height) / rect.height
      );
    });
    window.addEventListener('keydown', event => {
      switch (event.code) {
        case 'KeyW':
          this.player1.position = new Point(0, 0);
          break;
        case 'KeyS':
          this.player1.position = new Point(0, this.canvas.height);
          break;
        case 'KeyI':
          this.player2.position = new Point(0, 0);
          break;
        case 'KeyK':
          this.player2.position = new Point(0, this.canvas.height);
          break;
        case 'Enter':
          if (this.isGameOver) {
            startGame();
          } else {
            this.player2.auto = !this.player2.auto;
          }
          break;
        default:
          break;
      }
    });
    window.addEventListener('keyup', event => {
      switch (event.code) {
        case 'KeyW':
        case 'KeyS':
          this.player1.position = null;
          break;
        case 'KeyI':
        case 'KeyK':
          this.player2.position = null;
          break;
        default:
          break;
      }
    });
    this.canvas.addEventListener('click', () => {
      if (this.isGameOver) {
        startGame();
      }
    });
  }

  drawNet() {
    DrawUtil.filledRect(
      this.context,
      this.config.color.main,
      this.config.net.top,
      this.config.net.centerTop
    );

    DrawUtil.circle(
      this.context,
      this.config.color.main,
      this.config.center,
      this.config.net.radius,
      this.config.net.thickness
    );

    DrawUtil.filledRect(
      this.context,
      this.config.color.main,
      this.config.net.centerBottom,
      this.config.net.bottom
    );
  }

  drawScores() {
    const font = 'Press Start 2P';
    const fontSize = this.canvas.height / 15;
    const heightOffset = (fontSize * 3) / 4;
    this.context.fillStyle = this.config.color.main;

    if (this.isGameOver) {
      if (this.player1.score >= this.config.winningScore) {
        DrawUtil.computeFontSize(this.context, this.config.text.leftPlayerWon, font, fontSize, this.canvas.width);
        const metrics = this.context.measureText(this.config.text.leftPlayerWon);
        this.context.fillText(
          this.config.text.leftPlayerWon,
          this.canvas.width / 2 - metrics.width / 2,
          (this.canvas.height * 2) / 3
        );
      } else if (this.player2.score >= this.config.winningScore) {
        DrawUtil.computeFontSize(this.context, this.config.text.rightPlayerWon, font, fontSize, this.canvas.width);
        const metrics = this.context.measureText(this.config.text.rightPlayerWon);
        this.context.fillText(
          this.config.text.rightPlayerWon,
          this.canvas.width / 2 - metrics.width / 2,
          (this.canvas.height * 2) / 3
        );
      }

      DrawUtil.computeFontSize(this.context, this.config.text.start, font, fontSize, this.canvas.width);
      const metrics = this.context.measureText(this.config.text.start);
      this.context.fillText(
        this.config.text.start,
        this.canvas.width / 2 - metrics.width / 2,
        this.canvas.height / 2
      );
    } else {
      DrawUtil.setFont(this.context, font, fontSize);
      let metrics = this.context.measureText(this.player1.score);
      this.context.fillText(
        this.player1.score,
        (this.canvas.width * 3) / 10 - metrics.width / 2,
        this.canvas.height / 2 + heightOffset
      );
      metrics = this.context.measureText(this.player2.score);
      this.context.fillText(
        this.player2.score,
        (this.canvas.width * 7) / 10 - metrics.width / 2,
        this.canvas.height / 2 + heightOffset
      );
    }
  }

  draw() {
    // Clear canvas
    DrawUtil.filledRect(
      this.context,
      this.config.color.background,
      this.config.start,
      this.config.end
    );

    if (!this.isGameOver) {
      this.drawNet();
    }

    this.drawScores();

    if (!this.isGameOver) {
      this.ball.draw();
      this.bar1.draw();
      this.bar2.draw();
    }
  }

  move() {
    this.ball.move();

    if (this.player1.position) {
      this.bar1.moveTo(this.player1.position, 0, this.canvas.height);
    }

    if (this.player2.auto) {
      this.bar2.moveTo(this.ball.position, 0, this.canvas.height);
    } else if (this.player2.position) {
      this.bar2.moveTo(this.player2.position, 0, this.canvas.height);
    }

    this.ball.bounceOnWalls(this.config.start, this.config.end);
    this.ball.bounceOnBars(this.bar1, this.bar2);

    if (this.ball.isAfterX(this.canvas.width)) {
      this.player1.score++;
      this.ball.service();
    } else if (this.ball.isBeforeX(0)) {
      this.player2.score++;
      this.ball.service();
    }

    if (this.player1.score >= this.config.winningScore) {
      this.isGameOver = true;
    } else if (this.player2.score >= this.config.winningScore) {
      this.isGameOver = true;
    }
  }

  render() {
    if (!this.isGameOver) {
      this.move();
    }
    this.draw();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  new Pong();
});
