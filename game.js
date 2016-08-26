function onStart(){
  game.loop();
}

function onPause(){
  game.toggle_pause();
}

function onExit(){
  game.exit();
}

var game = {
  'looping': false,
  'paused': false,
  'interval': false,
  'canvas': false,
  'width': 600,
  'height': 400,
  'fps': 40,
  'start_time': 0,
  'last_frame': 0,
  'total_time': 0,
  'frame_time': 0,
  'pause': function(pause){
    this.paused = pause;
  },
  'toggle_pause': function(){
    this.paused = !this.paused;
  },
  'exit': function(){
    clearInterval(this.interval);
    this.looping = false;
  },
  'loop': function(){
    if(this.looping){
      return;
    }
    this.looping = true;
    this.paused = false;
    this.canvas = document.getElementById('gamecanvas');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.start_time = performance.now();
    this.last_frame = this.start_time;
    this.load_assets();
    this.reset();
    this.interval = setInterval((function(self){
      return function(){
        self.one_loop();
      }
    })(this), 1000 / this.fps);
  },
  'one_loop': function(){
    if(this.paused){
      return;
    }
    var now = performance.now();
    this.frame_time = now - this.last_frame;
    this.total_time = now - this.start_time;
    this.last_frame = now;
    this.update();
    this.draw();
  },

  // game logic
  'load_assets': function(){
    this.img1 = document.getElementById('img_img1');
  },
  'reset': function(){
    this.frame = 0;
    this.flipped = false;
  },
  'update': function(){
    this.frame += this.frame_time * this.width / 2 / 5000;
    if(this.frame > this.width / 2){
      this.flipped = !this.flipped;
      this.frame = 0;
    }
  },
  'draw': function(){
    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.flipped ? '#FF0000' : '#000000';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = this.flipped ? '#000000' : '#FF0000';
    ctx.fillRect(this.frame, 0, 600 - this.frame * 2, 400);
    ctx.strokeStyle = '#FFFFFF';
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, this.height);
    ctx.moveTo(0, this.height);
    ctx.lineTo(this.width, 0);
    ctx.stroke();
    ctx.font = '30px Arial';
    ctx.fillText("Hi", this.width - 50, this.height / 2 + 15);
    ctx.drawImage(this.img1, (this.width - this.img1.width) / 2, (this.height - this.img1.height) / 2);
  }
}
