function GetDistance(x1,y1,x2,y2) {
		const disX = x1 - x2;
		const disY = y1 - y2;
		return Math.sqrt((disX * disX) + (disY*disY));
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
	
	
function setfood(x = 0,y = 0) {
	if(x+y != 0) {			
		edible.push(new food(x,y,bg));
	} else {
		x = Math.floor((Math.random() * mapWidth));
		y = Math.floor((Math.random() * mapHeight));
		edible.push(new food(x,y,bg));
	}
}	
	
function gameover() {
	ctx.fillStyle = "Grey";
	ctx.font = "60px Arial";
	ctx.fillText('GameOver',(WindowWidth/2) - 120,(WindowHeight/2));
}

function displayScore() {
	ctx.fillStyle = "Grey";
	ctx.font = "20px Arial";
	ctx.fillText('Score : ' + score,20,50);
	ctx.fillText('fps : ' + fps,WindowWidth - 100,50);
}

function draw() {
	ctx.clearRect(0,0,WindowWidth,WindowHeight);
	bgx.clearRect(0,0,WindowWidth,WindowHeight);
	bpx.clearRect(0,0,WindowWidth,WindowHeight);
	bgx.drawImage(foodbuff,cam.X,cam.Y,WindowWidth,WindowHeight,0,0,WindowWidth,WindowHeight);
	ctx.drawImage(buff,cam.X,cam.Y,WindowWidth,WindowHeight,0,0,WindowWidth,WindowHeight);
	bpx.drawImage(patbuff,cam.X,cam.Y,WindowWidth,WindowHeight,0,0,WindowWidth,WindowHeight);
}

window.addEventListener('resize',screenChange);
	
function screenChange() {
	WindowWidth = window.innerWidth;
	WindowHeight = window.innerHeight;
	Screen.width = WindowWidth;
	Screen.height = WindowHeight;
	Back.width = WindowWidth;
	Back.height = WindowHeight;	
	patBack.height = WindowHeight;
	patBack.width = WindowWidth;
}

let frames = 0;
let fps = 0;
function Resetfps() {
	fps = frames;
	frames = 0;
}
setInterval(Resetfps,1000);