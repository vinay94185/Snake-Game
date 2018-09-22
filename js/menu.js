window.addEventListener("load",Start);

function Start() {	
	
	/*******************
	** MAIN GAME CODE ** 
	********************/
	
	var x,y,len; // will be used initilize snake's position's
	const MaxSnakes = 7; // max number of snake's on menu
	for(var i = 0;i<MaxSnakes ;++i) {
		newSnake(false);
	}
	
	/* Start Button for game */
	document.getElementsByClassName('btnStyle')[0].addEventListener('click',beginGame);
	
	/* Menu for the Game */
	(function menu() {
		ct.clearRect(cam.X,cam.Y,WindowWidth,WindowHeight);
		for(var i=0; i<MaxSnakes;++i) {
			snakes[i].randMove(); // Make a random move
		}
		draw();
		frame = requestAnimationFrame(menu);
	})();
	
	function ChangeGraphics(x) {
		Hgraphic = parseInt(x.value);
	}	
	
	Start.ChangeGraphics = ChangeGraphics;
}

/*
** Function that beigin's the game and closes the menu
*/	
let name;
let smax,done = false;
let sno = 0;
let foodintr = null;

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