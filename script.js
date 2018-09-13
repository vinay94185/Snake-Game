window.addEventListener("load",Start);

function Start() {
	var WindowWidth = window.innerWidth;
	var WindowHeight = window.innerHeight;
	var Screen = document.getElementById('gameScreen');
	Screen.width = WindowWidth;
	Screen.height = WindowHeight;
	const ct = Screen.getContext("2d");
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
		this.x = x;
		this.y = y;
		this.trail = []; // tail
		this.len = len;// * this.speed; // length of tail in begnining
		this.block = 9; // size of snake block's
		this.halfblock = Math.floor(this.block/2);
		this.color = Snakecolors[Math.floor(Math.random() * Snakecolors.length)];
		this.isPlayer = isPlayer;

		this.countMax = (Math.random() * 60)+40; //  amout of time it before snake changes direction
		this.count = 0; //counter for max count
		this.mv = Math.floor((Math.random() * 4)+1); // random move
		this.ret = undefined; // returnd direction will be stored here
		this.DirAvoid = true;
		
		/*
		** Set the Cordinate's of the snake
		** TODO : Direction randomization
		*/
		for(var i = 0;i<this.len;++i) {
			this.trail[i] = new trail();
			this.trail[i].x = x - (this.halfblock * i);
			this.trail[i].y = y;
		}
		
		/* Display snake on the felid */
		this.show = () => {
			var tmp_len = this.len - 1;
			ct.fillStyle = this.color;
			for(var i=tmp_len;i>=0;--i) {
				if(i === 0) {
					ct.fillStyle = "red";
					ct.beginPath();
					ct.arc(this.trail[i].x,this.trail[i].y,this.block,0,circ);
					ct.fill();
					ct.closePath();
				} else {
					ct.beginPath();
					ct.arc(this.trail[i].x,this.trail[i].y,this.block,0,circ);
					ct.fill();
					ct.closePath();			
				}
			}
		}
		
		/* Move the snake */
		this.move = (str) => {
			var vx = 0,vy = 0;
			/* check direction */
			switch(str) {
				case 'right': vx = this.speed; break;
				case 'left': vx = -this.speed; break;
				case 'up': vy = -this.speed; break;
				case 'down': vy = this.speed; break;
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
			if(Math.floor((this.score + mass)/50) > Math.floor(this.score/50)) {
			this.len += 1;//mass;
			this.score += mass;
			
			var vx,vy;
	//			for(var i=0;i<mass;++i) {
					vx = 0;
					vy = 0;
					switch(this.ret) {
						case 'right': vx = this.speed; break;
						case 'left': vx = -this.speed; break;
						case 'up': vy = -this.speed; break;
						case 'down': vy = this.speed; break;
					}	
						this.trail.unshift(new trail(this.trail[0].x + vx,this.trail[0].y + vy));
			//	}		
				} else { this.score += mass; }
			}
			
			this.colliide = (others) => {
				for(let i=0,n = others.length;i<n;++i) {
					const ret = Checktrail(this.trail[0],others[i].trail,this.block * 2);
					if(this === others[i]) continue;
					if(ret === 1) {
						return true;
					} else if(ret === 2) {
						if(this.DirAvoid)this.avoid();
					}
				}
				return false;
			}
			
			this.die = () => {
				this.trail.forEach (trail => {
					const x = trail.x + (Math.random() * this.block);
					const y = trail.y + (Math.random() * this.block);
					setfood(x,y);
				});

			}
			this.avoid = () => {
				if(this.isPlayer) {
						return 0;
				} else {
					this.DirAvoid = false;
					if(this.ret == 'left') this.mv = 2;
					if(this.ret == 'right') this.mv = 1;
					if(this.ret == 'up') this.mv = 4;
					if(this.ret == 'down') this.mv = 3;
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
			ct.fillStyle = this.color;
			ct.beginPath();
			ct.arc(this.x,this.y,this.mass,0,circ);
			ct.fill();
			ct.closePath();
		}
	}
	
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
	var smax = 4,done = false;
	var name;
	/*
	** Function that beigin's the game and closes the menu
	** TODO: Everything 
	*/	
	function beginGame() {
		if(document.querySelector('.form input').value != '') {
		document.getElementsByClassName('form')[0].style.display = 'none';
		name = document.querySelector('.form input').value;
		cancelAnimationFrame(frame);
		gameon = true;
		if(smax < snakes.length) while(snakes.length != smax) snakes.pop();
		else while(snakes.length != smax) newSnake(false);
		setInterval(setfood,500); 
		newSnake(true);
		++smax;
		ingame();
		} else {
			alert('Please Enter Yout Name');
		}

	}

	var score = 0;
	function ingame() {
		ct.clearRect(0,0,WindowWidth,WindowHeight);
		displayScore();
		edible.forEach( food => {food.show()} ); // display food

		if(!gameon) {
			gameover();
		}

		for(sno = 0; sno < smax;++sno) {
			if(snakes[sno].isPlayer) { 
				snakes[sno].move(playerGo);
				snakes[sno].name(name);
				score = snakes[sno].score;
			} else { 
				snakes[sno].randMove();
			}
			// dettect collision
			if(snakes[sno].colliide(snakes)) {
			if(snakes[sno].isPlayer) {
				snakes[sno].die();
				gameon = false;
			} else {
				snakes[sno].die();
			}
				snakes.splice(sno,1);
				newSnake(false);
				--sno;
			}
		}
		
		for(var i=0,n = edible.length;i<n;++i) {
				for(sno = 0; sno < smax;++sno) {				
				const dis = GetDistance(snakes[sno].trail[0].x,snakes[sno].trail[0].y,edible[i].x,edible[i].y);
				if(dis <= 20) {
						snakes[sno].eat(edible[i].mass);
						edible.splice(i,1);
						n = edible.length;
						break;
					}
				}
		}	
		requestAnimationFrame(ingame);		
	}

	window.addEventListener('keydown',checkkey);
	
	function checkkey(keyboard) {
		switch(keyboard.key) {
			case 'ArrowRight': playerGo = 'right'; break;
			case 'ArrowLeft': playerGo = 'left'; break;
			case 'ArrowUp': playerGo = 'up'; break;
			case 'ArrowDown': playerGo = 'down'; break;
			case 'Enter' : beginGame(); break;
		}
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
	}
	
}