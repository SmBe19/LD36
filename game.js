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
  'fps': 4,
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
    window.removeEventListener('keydown', this.keydownlistener);
    window.removeEventListener('keyup', this.keyuplistener);
    this.looping = false;
    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.width, this.height);
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
    this.intervallistener = (function(self){
      return function(){
        self.one_loop();
      }
    })(this)
    this.interval = setInterval(this.intervallistener, 1000 / this.fps);
    this.keydownlistener = (function(self){
      return function(e){
        self.keydown(e);
      }
    })(this);
    this.keyuplistener = (function(self){
      return function(e){
        self.keyup(e);
      }
    })(this);
    window.addEventListener('keydown', this.keydownlistener);
    window.addEventListener('keyup', this.keyuplistener);
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
    this.gridx = 12;
    this.gridy = 8;
    this.cur_x = 0;
    this.cur_y = 0;
    this.field = [];
    for(var y = 0; y <= this.gridy; y++){
      this.field.push([]);
      for(var x = 0; x <= this.gridx; x++){
        this.field[y].push(0);
      }
    }
  },
  'keydown': function(e){
    //console.log('down', e);
    if(this.paused){
      return;
    }
    e.preventDefault();
  },
  'keyup': function(e){
    //console.log('up', e);
    if(e.key == 'p'){
      this.toggle_pause();
      return;
    }
    if(this.paused){
      return;
    }
    switch (e.key) {
      case 'a':
      case 'ArrowLeft':
        if(this.cur_x > 0){
          this.cur_x--;
        }
        break;
      case 'd':
      case 'ArrowRight':
        if(this.cur_x < this.gridx){
          this.cur_x++;
        }
        break;
      case 'w':
      case 'ArrowUp':
        if(this.cur_y > 0){
          this.cur_y--;
        }
        break;
      case 's':
      case 'ArrowDown':
        if(this.cur_y < this.gridy){
          this.cur_y++;
        }
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.field[this.cur_y][this.cur_x] = e.key|0;
        break;
      default:
        console.log('up', e.key);
    }
    e.preventDefault();
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
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.width, this.height);

    // grid
    ctx.strokeStyle = '#FFFFFF';
    var gridwidth = this.width / (this.gridx + 1);
    var gridheight = this.height / (this.gridy + 1);
    for(var i = 1; i <= this.gridx; i++){
      var x = i * gridwidth;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for(var i = 1; i <= this.gridy; i++){
      var y = i * gridheight;
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF'
    for(var y = 0; y <= this.gridy; y++){
      for(var x = 0; x <= this.gridx; x++){
        if(this.field[y][x] != 0){
          ctx.fillText(this.field[y][x], (x+0.3) * gridwidth, (y+0.7) * gridheight);
        }
      }
    }

    // current
    ctx.strokeStyle = '#FF0000';
    ctx.strokeRect(this.cur_x * gridwidth, this.cur_y * gridheight, gridwidth, gridheight);
    /*
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
    */
  }
}
