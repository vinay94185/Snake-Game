window.addEventListener('keydown',checkkey);
window.addEventListener('keyup',keyreset);

let controlmode = 3;

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


//touch screen controls for phone 

window.addEventListener('touchstart',touchbegin);
window.addEventListener('touchmove',touching);
window.addEventListener('touchend',touchstop);
let sx,sy,
	ex = 0,
	ey = 0,
	stime,etime,
	Xcenter = window.innerWidth/2,
	Ycenter = window.innerHeight/2,
	moveable = false;
	Xctr = (WindowWidth * 0.15),
	Yctr = (WindowHeight * 0.75);
	
let mvx = 0,
	mvy = 0;	


function touchbegin(touch) {
	stime = touch.timeStamp;
	sx = touch.touches[0].pageX; 
	sy = touch.touches[0].pageY;
	if(controlmode === 2) {
		if(sx > Xcenter) {
			if(gameon&& running) dash = (dash) ? false : true;
		} else {
			moveable = true;
		}
	} else if(controlmode === 3) {
		if(sx < Xcenter && sy > Ycenter) {
			Xctr = sx;
			Yctr = sy;
			moveable = true;
		} else if(sx > Xcenter) {
			if(gameon&& running) dash = (dash) ? false : true;
		}
	}
}

function touching(touch) {
	ex = touch.touches[0].pageX; 
	ey = touch.touches[0].pageY;
	if(moveable) {
		mvx = ((ex - Xctr)/50);
		mvy = ((ey - Yctr)/50);
		/* to ensure that snake won't go faster than max speed */
		mvx = (mvx > 1) ? 1 : mvx;
		mvx = (mvx < -1) ? -1 : mvx;
		mvy = (mvy > 1) ? 1 : mvy;	
		mvy = (mvy < -1) ? -1 : mvy;	
	}
}

function touchstop(touch) {
	etime = touch.timeStamp;
	if((!gameon)&& running) beginGame();
		if(controlmode === 2) {
		if(moveable) {
			if((etime - stime) < 300) {
				if(Math.abs(sx - ex) > Math.abs(sy - ey)){
					if(sx > ex) playerGo = 'left';
					if(sx < ex) playerGo = 'right';
				} else {
					if(sy < ey) playerGo = 'down';
					if(sy > ey) playerGo = 'up';
				}
			}
		moveable = false;
	}
	} else if(controlmode === 3) {
		moveable = false;
	}
}
