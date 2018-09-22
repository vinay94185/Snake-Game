window.addEventListener('keydown',checkkey);
window.addEventListener('keyup',keyreset);

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
let sx,sy,ex,ey,
	stime,etime,
	center = window.innerWidth/2,
	moveable = false;

function touchbegin(touch) {
	stime = touch.timeStamp;
	sx = touch.touches[0].pageX; 
	sy = touch.touches[0].pageY;
	if(sx > center) {
		if(gameon&& running) dash = (dash) ? false : true;
	} else {
		moveable = true;
	}
}

function touching(touch) {
		ex = touch.touches[0].pageX; 
		ey = touch.touches[0].pageY;
}

function touchstop(touch) {
	etime = touch.timeStamp;
	if((!gameon)&& running) beginGame();
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
}