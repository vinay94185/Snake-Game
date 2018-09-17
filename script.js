window.addEventListener("load",Start);

function Start() {
	var WindowWidth = window.innerWidth;
	var WindowHeight = window.innerHeight;
	let Hgraphic = 0;
	let dash = false;
	var Screen = document.getElementById('gameScreen');
	var Back = document.getElementById('gameBackground');
	Screen.width = WindowWidth;
	Screen.height = WindowHeight;
	Back.width = WindowWidth;
	Back.height = WindowHeight;
	const ct = Screen.getContext("2d");
	const bg = Back.getContext("2d");
	const circ = 2*Math.PI;
	/* 
	** Array of color's for snake's 
	** And for food.
	*/
	var Snakecolors = [];
		Snakecolors.push("#58B7B8");
		Snakecolors.push("#F8CE3D");
		Snakecolors.push("#DF6127");
		Snakecolors.push("#FE7F2D");
		Snakecolors.push("#12403E");
	
	var colors = [];
		colors.push("#E23A59"); 
		colors.push("#44ADAD"); 
		colors.push("#3E506B"); 
		colors.push("#FCC82B"); 
		colors.push("#0F5E8C"); 
	
	// A Structure to store x and y cordnate's effectively
	function trail(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
	// check the whole trail for collision
	function Checktrail(me,oth,block) {
		let colstate = 0;
		for(let i=0,n = oth.length;i!=n;++i) {
			const dist = GetDistance(me.x,me.y,oth[i].x,oth[i].y) - block;
			if(dist <= 0) {	// colided
				colstate = 1;
				break; 
			} else if(dist <= 50) { //may collide
				colstate = 2;
			}
		}
		return colstate;
	}
	
	// Snake Object Defination
	function snake(x,y,len,isPlayer) {
		this.score = 0;
		this.speed = 2;
		this.curSpeed = this.speed ;
		this.x = x;
		this.y = y;
		this.eyeX = 0;
		this.eyeY = 0;
		this.trail = []; // tail
		this.foodtrack = [];
		this.len = len; // length of tail in begnining
		this.block = 9; // size of snake block's
		this.halfblock = Math.floor(this.block/2);
		this.color = Snakecolors[Math.floor(Math.random() * Snakecolors.length)];
		this.isPlayer = isPlayer;
		this.dashboost = false;
		this.innetEyeX = 0;
		this.innetEyeY = 0;
		this.innerEye = 0;


		this.countMax = (Math.random() * 60)+40; //  amout of time it before snake changes direction
		this.count = 0; //counter for max count
		this.mv = Math.floor((Math.random() * 4)+1); // random move
		this.ret = undefined; // returned direction will be stored here
		this.DirAvoid = true;
		this.op = Math.floor(Math.random() * 7);
		this.eating = 0;
		this.ms = 2;
		this.me = 1;
		
		/*
		** Set the Cordinate's of the snake
		** TODO : Direction randomization
		*/
		for(var i = 0;i<this.len;++i) {
			this.trail[i] = new trail();
			if(i) {
				while(GetDistance(this.x,this.y,this.trail[i-1].x,this.trail[i-1].y) >= this.halfblock) {
					++x;		
				}
			}
			this.trail[i].x = x;
			this.trail[i].y = y;
			
		}
		
		/* Display snake on the felid */
		this.show = () => {
			var tmp_len = this.len - 1;
			ct.fillStyle = this.color +this.op +'A';
			if((Hgraphic && dash && this.isPlayer)||(Hgraphic && this.dashboost)) {
				for(var i=tmp_len;i>=0;--i) {
					if(i%100 == 0) ++this.op; //= Math.floor(Math.random() * 8)+1;
					if(this.op > 9) this.op = 1;
					ct.fillStyle = this.color +this.op +'0';
					ct.beginPath();
					ct.arc(this.trail[i].x,this.trail[i].y,this.block+4,0,circ);
					ct.fill();
					ct.closePath();		
				}
			}
			
			ct.fillStyle = this.color;
			
			for(var i=tmp_len;i>=0;--i) {
				if(i === 0) {
					// head
					ct.beginPath();
					ct.arc(this.trail[i].x,this.trail[i].y,this.block+1,0,circ);
					ct.fill();
					ct.closePath();
					//Mouth
					if(this.eating) {
						ct.beginPath();
						switch(this.ret) {
							case 'up': 
								this.ms = Math.PI * 1.25;
								this.me = Math.PI * 1.75;
							break;
							case 'down': 
								this.ms = Math.PI * 0.25;
								this.me = Math.PI * 0.75;
							break;
							case 'left': 
								this.ms = Math.PI * 0.75;
								this.me = Math.PI * 1.25;
							break;
							case 'right': 
								this.ms = Math.PI * 1.75;
								this.me = Math.PI * 0.25;
							break;
						}
						
						ct.arc(this.x,this.y,this.block-2,this.ms,this.me);
						ct.lineWidth = 5;
						ct.stroke();
						ct.closePath();
						if(this.eating == 2) {
							this.eating = 1;
							if(this.intr != undefined) clearTimeout(this.intr);
							this.intr = setTimeout( () => { this.eating = 0; },100);
						}
					}
					//Outer eye
					ct.beginPath();
					ct.fillStyle = "white";
					ct.arc(this.trail[i].x-this.eyeX,this.trail[i].y-this.eyeY,4,0,circ);
					ct.arc(this.trail[i].x+this.eyeX,this.trail[i].y+this.eyeY,4,0,circ);
					ct.fill();
					ct.closePath();
					/* inner eye */
					ct.beginPath();
					ct.fillStyle = "black";
					if(Hgraphic) ct.strokeStyle = "#0000003A";
					switch(this.ret) {
						case 'left': this.innerEye = 1; break;
						case 'right': this.innerEye = -1; break;
						case 'up': this.innerEye = 1; break;
						case 'down': this.innerEye = -1; break;
					}
					if(this.eyeY)this.innetEyeX = this.innerEye; else this.innetEyeX = 0;
					if(this.eyeX)this.innetEyeY = this.innerEye; else this.innetEyeY = 0;
					ct.arc(this.trail[i].x-(this.eyeX + this.innetEyeX),this.trail[i].y-(this.eyeY + this.innetEyeY),2,0,circ);
					ct.arc(this.trail[i].x+(this.eyeX - this.innetEyeX),this.trail[i].y+(this.eyeY - this.innetEyeY),2,0,circ);
					ct.fill();					
					ct.closePath();
				} else {
					ct.beginPath();
					ct.arc(this.trail[i].x,this.trail[i].y,this.block,0,circ);
					ct.fill();
					ct.lineWidth = 1;
					if(Hgraphic) ct.stroke();
					ct.closePath();			
				}
			}
		}
		
		/* Move the snake */
		this.move = (str) => {
			var vx = 0,vy = 0;
			/* check direction */
			if(this.isPlayer) this.ret = str;
			if((dash && this.isPlayer) || this.dashboost) this.curSpeed = this.speed * 2;
			else this.curSpeed = this.speed;
			
			switch(str) {
				case 'right': 
					vx = this.curSpeed;
					this.eyeX = 0;
					this.eyeY = 5;
					break;
				case 'left':
					vx = -this.curSpeed; 
					this.eyeX = 0;
					this.eyeY = 5; 
					break;
				case 'up': 
					vy = -this.curSpeed; 
					this.eyeX = 5;
					this.eyeY = 0;
					break;
				case 'down': 
					vy = this.curSpeed;
					this.eyeX = 5;
					this.eyeY = 0;
					break;
			}

				this.x += vx;
				this.y += vy;
			
				// reduce the drawing and x/y cordinates storage load
				if(GetDistance(this.x,this.y,this.trail[0].x,this.trail[0].y) >= this.halfblock) {
					this.trail[0].x = this.x;
					this.trail[0].y = this.y;
			
				for(var i = this.len-1;i > 0;--i) {
					this.trail[i].x = this.trail[i-1].x;
					this.trail[i].y = this.trail[i-1].y;
				}
			}
			
			
			/*
			** The following code will make sure that
			** If the snake goes out of screen then 
			** it will come back from other side of 
			** the screen.
			*/
			if(this.x > WindowWidth) {
				this.x = 0;
			} else if(this.x < 0) {
				this.x = WindowWidth;
			} else if (this.y > WindowHeight) {
				this.y = 0;
			} else if (this.y < 0) {
				this.y = WindowHeight;
			}
			this.show(); // since snake is moved display it on new position
		}
		
		// display the name of the player on screen
		this.name = (name) => {
			ct.font = "20px Arial";
			ct.fillStyle = "black";
			ct.fillText(name,this.trail[0].x+10,this.trail[0].y);
		}			
		
			/* Function to move the snake randomly */
			this.randMove = () => {
				/* 
				** To make the randomness less aggressive
				** We only change direction after a certian 
				** Amount of time has passed.
				*/
				if(this.count > this.countMax) {
					this.mv = Math.floor((Math.random() * 4)+1);
					this.count = 0;
					this.DirAvoid = true;
				} else { 
					this.count++;
				}
				
				switch(this.mv) {
					case 1: this.ret = 'left'; break;
					case 2: this.ret = 'right'; break;
					case 3: this.ret = 'up'; break;
					case 4: this.ret = 'down'; break;
				} 

				this.move(this.ret);
			}
						
			this.eat = (mass) => {
			this.foodtrack.shift();
			if(Math.floor((this.score + mass)/15) > Math.floor(this.score/15)) {
			this.len += 1;
			this.score += mass;
			
			var vx,vy;
					vx = 0;
					vy = 0;
							
					switch(this.ret) {
						case 'right': vx = this.speed; break;
						case 'left': vx = -this.speed; break;
						case 'up': vy = -this.speed; break;
						case 'down': vy = this.speed; break;
					}

				this.trail.unshift(new trail(this.trail[0].x,this.trail[0].y));
					
				while(GetDistance(this.trail[0].x,this.trail[0].y,this.trail[0].x,this.trail[0].y) >= this.halfblock) {
					this.trail[0].x += vx;
					this.trail[0].y += vy;
				}
				
				} else { this.score += mass; }	
				this.eating = 2;
			}
			
			this.colliide = (others) => {
				for(let i=0,n = others.length;i<n;++i) {
					const ret = Checktrail(this.trail[0],others[i].trail,this.block * 2);
					if(this === others[i]) continue;
					if(ret === 1) {
						return true;
					} else if(ret === 2) {
						if(this.DirAvoid) this.avoid();
					}
				}
				return false;
			}
			
			this.die = () => {
				this.trail.forEach (trail => {
					const x = Math.floor(trail.x + (Math.random() * this.block));
					const y = Math.floor(trail.y + (Math.random() * this.block));
					setfood(x,y);
				});

			}
			this.avoid = () => {
				if(this.isPlayer) {
						return 0;
				} else {
					this.DirAvoid = false;
					switch(this.ret) {
						case 'left': this.mv = 2; this.ret = 'right'; break;
						case 'right': this.mv = 1; this.ret = 'left'; break;
						case 'up': this.mv = 4; this.ret = 'down'; break;
						case 'down': this.mv = 3; this.ret = 'up'; break;
					}
				}
			}
			
			this.eatlist = (x,y) => {
				if(!this.isPlayer)  {
				let alreadyin = false;
				for(let i=0,max = this.foodtrack.length;i<max;++i) {
					if(this.foodtrack[i].x == x && this.foodtrack[i].y == y) {
						alreadyin = true;
						break;
					}
				}
				if(!alreadyin) this.foodtrack.push(new trail(x,y));
					if(this.foodtrack.length > 20) {
						this.dashboost = true;
					} else {
						this.dashboost = false;
					}
				}					
			}
			
			this.clearfood = (function() {
				if(this.foodtrack != undefined) {
					this.foodtrack.splice(0,this.foodtrack.length);
				}
				setInterval(this.clearfood,1000);
			})();
			
			this.smartMove = () => {
				this.time = new Date();
				
				if(this.oldtime === undefined) { 
					this.oldtime = this.time; 
					this.oldtime.setMilliseconds(this.oldtime.getMilliseconds()+250);
					if(this.oldtime.getMilliseconds() > 950)  {
						this.oldtime.setMilliseconds(this.oldtime.getMilliseconds()-50)
					}

				} else if(this.time.getMilliseconds() > (this.oldtime.getMilliseconds())) {
					this.oldtime = this.time;
					this.oldtime.setMilliseconds(this.oldtime.getMilliseconds()+250);
					if(this.oldtime.getMilliseconds() > 950)  {
						this.oldtime.setMilliseconds(this.oldtime.getMilliseconds()-50)
					}
				if(this.foodtrack.length) {
					
				let x = this.foodtrack[0].x;
				let y = this.foodtrack[0].y;
				let disX = Math.abs((x - this.x));
				let disY = Math.abs((y - this.y));
				
				if(disX > disY) {
					if(x < this.x) {
						this.ret = 'left';
					} else if (x > this.x) {
						this.ret = 'right';
					}
				} else {
					if(y > this.y) {
						this.ret = 'down';
					} else if(y < this.y) {
						this.ret = 'up';
					}
				}
				
				if(GetDistance(x,y,this.foodtrack[0].x,this.foodtrack[0].y) <= 20) {
					this.foodtrack.shift();
				}

				this.move(this.ret);
				} else {
				this.randMove();
				}
				} else {
					this.move(this.ret);
				}
			}
	} // end snake object
	
	/*food object*/
	function food(x,y) {
		this.x = x;
		this.y = y;
		this.mass = Math.floor((Math.random() * 4)+ 3);
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.show = () => {
			bg.fillStyle = this.color;
			bg.beginPath();
			bg.arc(this.x,this.y,this.mass,0,circ);
			bg.fill();
			bg.closePath();
		}
		this.clear = () => {
			bg.beginPath();
			bg.arc(this.x,this.y,this.mass+1,0,circ);
			bg.save();
			bg.clip();
			bg.clearRect(0,0,WindowWidth,WindowHeight);
			bg.restore();
			bg.closePath();
		}
		this.show();
	}
	
	
	/*******************
	** MAIN GAME CODE ** 
	********************/
	
	var x,y,len; // will be used initilize snake's position's
	var snakes = [];
	const MaxSnakes = 7; // max number of snake's
	for(var i = 0;i<MaxSnakes ;++i) {
		newSnake(false);
	}
	
	/* Start Button for game */
	document.getElementsByClassName('btnStyle')[0].addEventListener('click',beginGame);
	
	/* Menu for the Game */
	var frame;
	(function menu() {
		ct.clearRect(0,0,WindowWidth,WindowHeight);
		for(var i=0; i<MaxSnakes;++i) {
			snakes[i].randMove(); // Make a random move
		}
		frame = requestAnimationFrame(menu);
	})();
	
	var playerGo = 'right';
	var edible = [];
	var gameon = false;
	var sno = 0;
	var smax,done = false;
	var name;
	let foodintr = null;
	/*
	** Function that beigin's the game and closes the menu
	*/	
	function beginGame() {
		if(document.getElementById('name').value != '' && document.getElementById('num').value != '') {
		document.getElementsByClassName('form')[0].style.display = 'none';
		name = document.getElementById('name').value;
		smax = parseInt(document.getElementById('num').value);
		document.getElementById('name').blur();
		document.getElementById('num').blur();
		cancelAnimationFrame(frame);
		if(smax < snakes.length) while(snakes.length != smax) snakes.pop();
		else while(snakes.length != smax) newSnake(false);
		if(!foodintr) foodintr = setInterval(setfood,1000); 
		if(!gameon) { 
			newSnake(true);
			++smax;
		}
		gameon = true;
		ingame();
		} else {
			alert('Please Enter Yout Name and number of player\'s');
		}

	}

	let score = 0;
	let frames = 0;
	let fps = 0;
	
	function Resetfps() {
		fps = frames;
		frames = 0;
	}
	setInterval(Resetfps,1000);

	/*****************
	** Running game **
	******************/
	
	function ingame() {
		++frames;
		ct.clearRect(0,0,WindowWidth,WindowHeight);
		
		// show snakes
		for(sno = 0; sno < smax;++sno) {
			if(snakes[sno].isPlayer) { 
				snakes[sno].move(playerGo);
				snakes[sno].name(name);
				score = snakes[sno].score;
			} else { 
				snakes[sno].smartMove();
			}
			
			// dettect collision
			if(snakes[sno].colliide(snakes)) {
			if(snakes[sno].isPlayer) {
				snakes[sno].die();
				gameon = false;
				smax--;
			} else {
				snakes[sno].die();
				newSnake(false);
			}
				snakes.splice(sno,1);
				--sno;
			}
		}
		
		// eat food
		for(var i=0,n = edible.length;i<n;++i) {
				for(sno = 0; sno < smax;++sno) {				
				const dis = GetDistance(snakes[sno].x,snakes[sno].y,edible[i].x,edible[i].y);
				if(dis <= 20) {
						snakes[sno].eat(edible[i].mass);
						edible[i].clear();
						edible.splice(i,1);
						n = edible.length;
						break;
					}
				if(dis <= 100) {
						snakes[sno].eatlist(edible[i].x,edible[i].y);
					}
				}
		}	
		
		displayScore();

		if(!gameon) {
			gameover();
		}

		frame = requestAnimationFrame(ingame);		
	}

	window.addEventListener('keydown',checkkey);
	window.addEventListener('keyup',keyreset);
	window.addEventListener('resize',screenChange);
	
	function checkkey(keyboard) {
		switch(keyboard.key) {
			case 'ArrowRight': playerGo = 'right'; break;
			case 'ArrowLeft': playerGo = 'left'; break;
			case 'ArrowUp': playerGo = 'up'; break;
			case 'ArrowDown': playerGo = 'down'; break;
			case 'Enter' : beginGame(); break;
			case ' ' : dash = true; break; // spacebar
		}
	}
	
	function keyreset(keyboard) {
		if(keyboard.key == ' ') dash = false;
	}
	
	function setfood(x = 0,y = 0) {
		if(x+y != 0) {			
			edible.push(new food(x,y));
		} else {
			x = Math.floor((Math.random() * WindowWidth));
			y = Math.floor((Math.random() * WindowHeight));
			edible.push(new food(x,y));
		}
	}	
	
	function GetDistance(x1,y1,x2,y2) {
			const disX = x1 - x2;
			const disY = y1 - y2;
			return Math.sqrt((disX * disX) + (disY*disY));
	}
	
	function newSnake(isPlayer) {
		x = Math.floor(Math.random() * WindowWidth);
		y = Math.floor(Math.random() * WindowHeight);
		len = Math.floor((Math.random() * 20) + 10);
		snakes.push(new snake(x,y,len,isPlayer)); // make snake object
	}
	
	function gameover() {
		ct.fillStyle = "Grey";
		ct.font = "60px Arial";
		ct.fillText('GameOver',(WindowWidth/2) - 120,(WindowHeight/2));
	}
	
	function displayScore() {
		ct.fillStyle = "Grey";
		ct.font = "20px Arial";
		ct.fillText('Score : ' + score,20,50);
		ct.fillText('fps : ' + fps,WindowWidth - 100,50);
	}
	
	function screenChange() {
		WindowWidth = window.innerWidth;
		WindowHeight = window.innerHeight;
		Screen.width = WindowWidth;
		Screen.height = WindowHeight;
		Back.width = WindowWidth;
		Back.height = WindowHeight;	
	}
	
	function ChangeGraphics(x) {
		Hgraphic = parseInt(x.value);
	}	
	
	Start.ChangeGraphics = ChangeGraphics;
}