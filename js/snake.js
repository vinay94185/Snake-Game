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
		
	// A Structure to store x and y cordnate's effectively
	function trail(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
		
	// Snake Object Defination
	function snake(x,y,len,isPlayer,_ct) {
		this.score = 0;
		this.speed = 4;
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
		this.ct = _ct;


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
			this.shineColor = this.color +this.op +'A';
			
			this.ct.fillStyle = this.color;
			
			for(var i=tmp_len;i>=0;--i) {
				if(this.trail[i].x < cam.X || this.trail[i].y < cam.Y || this.trail[i].x > (cam.X + WindowWidth) || this.trail[i].y > (cam.Y + WindowHeight)) continue;
				if((dash && this.isPlayer)||(this.dashboost)) this.flash(i);
				if(i === 0) {
					// head
					this.ct.beginPath();
					this.ct.arc(this.trail[i].x,this.trail[i].y,this.block+1,0,circ);
					this.ct.fill();
					this.ct.closePath();
					//Mouth
					if(this.eating) {
						this.ct.beginPath();
						switch(this.ret) {
							case 'up': 
								this.ms = Math.PI * 1.20;
								this.me = Math.PI * 1.80;
							break;
							case 'down': 
								this.ms = Math.PI * 0.20;
								this.me = Math.PI * 0.80;
							break;
							case 'left': 
								this.ms = Math.PI * 0.60;
								this.me = Math.PI * 1.30;
							break;
							case 'right': 
								this.ms = Math.PI * 1.60;
								this.me = Math.PI * 0.30;
							break;
						}
						
						this.ct.arc(this.x,this.y,this.block-3,this.ms,this.me);
						this.ct.lineWidth = 5;
						this.ct.strokeStyle = "#8b0000";
						this.ct.stroke();
						this.ct.closePath();
						if(Hgraphic) ct.lineWidth = 1;
						if(this.eating == 2) {
							this.eating = 1;
							if(this.intr != undefined) clearTimeout(this.intr);
							this.intr = setTimeout( () => { this.eating = 0; },100);
						}
					}
					//Outer eye
					this.ct.beginPath();
					this.ct.fillStyle = "white";
					this.ct.arc(this.trail[i].x-this.eyeX,this.trail[i].y-this.eyeY,4,0,circ);
					this.ct.arc(this.trail[i].x+this.eyeX,this.trail[i].y+this.eyeY,4,0,circ);
					this.ct.fill();
					this.ct.closePath();
					/* inner eye */
					this.ct.beginPath();
					this.ct.fillStyle = "black";
					if(Hgraphic) ct.strokeStyle = "#0000003A";
					switch(this.ret) {
						case 'left': this.innerEye = 1; break;
						case 'right': this.innerEye = -1; break;
						case 'up': this.innerEye = 1; break;
						case 'down': this.innerEye = -1; break;
					}
					if(this.eyeY)this.innetEyeX = this.innerEye; else this.innetEyeX = 0;
					if(this.eyeX)this.innetEyeY = this.innerEye; else this.innetEyeY = 0;
					this.ct.arc(this.trail[i].x-(this.eyeX + this.innetEyeX),this.trail[i].y-(this.eyeY + this.innetEyeY),2,0,circ);
					this.ct.arc(this.trail[i].x+(this.eyeX - this.innetEyeX),this.trail[i].y+(this.eyeY - this.innetEyeY),2,0,circ);
					this.ct.fill();					
					this.ct.closePath();
				} else {
					this.ct.beginPath();
					this.ct.arc(this.trail[i].x,this.trail[i].y,this.block,0,circ);
					this.ct.fill();
					if(Hgraphic) ct.stroke();
					this.ct.closePath();			
				}
			}
		}
		
		this.flash = (i) => {
					if(i%100 == 0) ++this.op;
					if(this.op > 9) this.op = 1;
					this.ct.fillStyle = this.shineColor;
					this.ct.beginPath();
					this.ct.arc(this.trail[i].x,this.trail[i].y,this.block+4,0,circ);
					this.ct.fill();
					this.ct.closePath();
					this.ct.fillStyle = this.color;
		}
		
		/* Move the snake */
		this.move = (str) => {
			var vx = 0,vy = 0;
			/* check direction */
			if(this.isPlayer) this.ret = str;
			if((dash && this.isPlayer) || this.dashboost) this.loops = 2;
			else this.loops = 1;
			
			switch(str) {
				case 'right': 
					vx = this.speed;
					this.eyeX = 0;
					this.eyeY = 5;
					break;
				case 'left':
					vx = -this.speed; 
					this.eyeX = 0;
					this.eyeY = 5; 
					break;
				case 'up': 
					vy = -this.speed; 
					this.eyeX = 5;
					this.eyeY = 0;
					break;
				case 'down': 
					vy = this.speed;
					this.eyeX = 5;
					this.eyeY = 0;
					break;
			}
			for(let loop=0;loop<this.loops;++loop) {
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
			}
			
			/*
			** The following code will make sure that
			** If the snake goes out of map then 
			** it will come back from other side of 
			** the map.
			*/
			if(this.x > mapWidth) {
				this.x = 0;
			} else if(this.x < 0) {
				this.x = mapWidth;
			} else if (this.y > mapHeight) {
				this.y = 0;
			} else if (this.y < 0) {
				this.y = mapHeight;
			}
			this.show(); // since snake is moved display it on new position
		}
		
		// display the name of the player on screen
		this.name = (name) => {
			this.ct.font = "20px Arial";
			this.ct.fillStyle = "black";
			this.ct.fillText(name,this.trail[0].x+10,this.trail[0].y);
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
					const ret = Checktrail(this.trail[0],others[i].trail,this.block + others[i].block);
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
				setTimeout(this.clearfood,1000);
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
	
//functions

function newSnake(isPlayer) {
	x = Math.floor(Math.random() * mapWidth);
	y = Math.floor(Math.random() * mapHeight);
	len = Math.floor((Math.random() * 20) + 10);
	snakes.push(new snake(x,y,len,isPlayer,ct)); // make snake object
}