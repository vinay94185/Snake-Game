	/* 
	** Array of color's for snake's 
	** And for food.
	*/
	let Snakecolors = [
		"#58B7B8",
		"#F8CE3D",
		"#DF6127",
		"#FE7F2D",
		"#12403E"
	];
	// A Structure to store x and y cordnate's effectively
	function trail(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
		
	// Snake Object Defination
	class snake {
		constructor(x,y,len,isPlayer,_ct) {
			this.score = 0;
			this.speed = 4;
			this.x = x;
			this.y = y;
			this.trail = []; // tail
			this.foodtrack = [];
			this.len = len; // length of tail in begnining
			this.block = 9; // size of snake block's
			this.halfblock = Math.floor(this.block/2);
			this.color = Snakecolors[Math.floor(Math.random() * Snakecolors.length)];
			this.isPlayer = isPlayer;
			this.dashboost = false;
			this.ct = _ct;
			this.countMax = (Math.random() * 60)+40; //  amout of time it before snake changes direction
			this.count = 0; //counter for max count
			this.mv = Math.floor((Math.random() * 4)+1); // random move
			this.ret = undefined; // returned direction will be stored here
			this.DirAvoid = true;
			this.eating = 0;
		
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
			
		}
		/* Display snake on the felid */
		show() {
			var tmp_len = this.len - 1;			
			this.ct.fillStyle = this.color;
			
			for(var i=tmp_len;i>=0;--i) {
				if(this.trail[i].x < cam.X || this.trail[i].y < cam.Y || this.trail[i].x > (cam.X + WindowWidth) || this.trail[i].y > (cam.Y + WindowHeight)) continue;
				if((dash && this.isPlayer)||(this.dashboost)) 
					this.ct.fillStyle = Snakecolors[Math.floor(Math.random() * Snakecolors.length)];
				if(i === 0) {
					// head
					this.ct.beginPath();
					this.ct.arc(this.trail[i].x,this.trail[i].y,this.block+1,0,circ);
					this.ct.fill();
					this.ct.closePath();
					//Mouth
					if(this.eating) {
						this.ct.beginPath();
						this.ct.save();
						this.ct.translate(this.trail[0].x,this.trail[0].y);
						this.ct.rotate(getAngle(this.trail[5].x,this.trail[5].y,this.trail[0].x,this.trail[0].y));						
						this.ct.arc(0,0,this.block-3,Math.PI * 0.5,Math.PI * 1.5);
						this.ct.lineWidth = 5;
						this.ct.strokeStyle = "#8b0000";
						this.ct.stroke();
						this.ct.restore();
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
					this.ct.save();
					this.ct.translate(this.trail[0].x,this.trail[0].y);
					this.ct.rotate(getAngle(this.trail[5].x,this.trail[5].y,this.trail[0].x,this.trail[0].y));
					this.ct.arc(0,5,4,0,circ);
					this.ct.arc(0,-5,4,0,circ);
					this.ct.restore();
					this.ct.fill();
					this.ct.closePath();
					/* inner eye */
					this.ct.beginPath();
					this.ct.fillStyle = "black";
					this.ct.save();
					this.ct.translate(this.trail[0].x,this.trail[0].y);
					this.ct.rotate(getAngle(this.trail[5].x,this.trail[5].y,this.trail[0].x,this.trail[0].y));
					this.ct.arc(-2,5,2,0,circ);
					this.ct.arc(-2,-5,2,0,circ);
					this.ct.fill();
					this.ct.restore();
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
		
		/* Move the snake */
		move(str) {
			var vx = 0,vy = 0;
			/* check direction */
			if(this.isPlayer) this.ret = str;
			if((dash && this.isPlayer) || this.dashboost) this.loops = 2;
			else this.loops = 1;
			
			switch(str) {
				case 'right': vx = this.speed; break;
				case 'left': vx = -this.speed; break;
				case 'up': vy = -this.speed; break;
				case 'down': vy = this.speed; break;
			}
			
			for(let loop=0;loop<this.loops;++loop) {
				this.act(vx,vy);
			}
		}
		
		moveI(x,y) {
			if((dash && this.isPlayer) || this.dashboost) this.loops = 2;
			else this.loops = 1;

			let vx = this.speed * x;
			let vy = this.speed * y;

			for(let loop=0;loop<this.loops;++loop) {
				this.act(vx,vy);
			}
		}
		
		act(vx,vy) {
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
		name(name) {
			this.ct.font = "20px Arial";
			this.ct.fillStyle = "#000000";
			this.ct.fillText(name,this.trail[0].x+10,this.trail[0].y);
		}			
		
			/* Function to move the snake randomly */
		randMove() {
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
						
		eat(mass) {
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
			
		colliide(others) {
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
			
		die() {
			this.trail.forEach (trail => {
				const x = Math.floor(trail.x + (Math.random() * this.block));
				const y = Math.floor(trail.y + (Math.random() * this.block));
				setfood(x,y);
			});

		}
		avoid() {
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
			
		clearfood() {
			if(this.foodtrack != undefined) {
				this.foodtrack.splice(0,this.foodtrack.length);
			}
			setTimeout(clearfood,1000);
		}
			
		eatlist(x,y) {
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
			
		smartMove() {
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