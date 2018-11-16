 window.addEventListener("load",Start);

function Start() {	
	
	/*******************
	** MAIN GAME CODE ** 
	********************/
	
	let x,y,len; // will be used initilize snake's position's
	const MaxSnakes = 15; // max number of snake's on menu
	
	for(let i = 0;i<MaxSnakes ;++i) {
		newSnake(false);
	}
	
	/* Start Button for game */
	document.getElementsByClassName('btnStyle')[0].addEventListener('click',beginGame);
	
	/* Menu for the Game */
	(function menu() {
		draw();
		for(let i=0; i<MaxSnakes;++i) {
			snakes[i].randMoveI(); // Make a random move
		}
		frame = requestAnimationFrame(menu);
	})();
	
	(function setDefControl() {
		let selc = document.getElementById('control');
		selc = selc.querySelectorAll('option');
		for(let i=0,e = selc.length; i< e;++i) {
			if(i === controlmode) {
				selc[i].setAttribute("Selected",'true');
			}
		}
		
	})();
	
	function ChangeControl(x) {
		controlmode = parseInt(x.value);
	}
	
	(function() { 
		let cont = document.getElementById('color');
		let opt;
		for(var i=0,end = Snakecolors.length;i<end;++i) {
			opt = document.createElement('option');
			opt.innerText = Snakecolors[i];
			opt.style.backgroundColor = Snakecolors[i];
			opt.style.color = '#FAFAFA';
			cont.appendChild(opt);
		}
	})();
	
	Start.ChangeControl = ChangeControl;
	setLastSetting();
}

/*
** Function that beigin's the game and closes the menu
*/	
let name;
let smax,done = false;
let sno = 0;
let foodintr = null;

function beginGame() {
	if(running && (!gameon)) {
		running = false;
		document.getElementsByClassName('form')[0].style.display = 'block';
	} else {
	if(document.getElementById('name').value != '' && document.getElementById('num').value != '') {
	document.getElementsByClassName('form')[0].style.display = 'none';
	name = document.getElementById('name').value;
	smax = parseInt(document.getElementById('num').value);
	document.getElementById('name').blur();
	document.getElementById('num').blur();
	cancelAnimationFrame(frame);
	storeSettig(name,smax,controlmode);
	if(smax < snakes.length) while(snakes.length != smax) snakes.pop();
	else while(snakes.length != smax) newSnake(false);
	if(!foodintr) foodintr = setInterval(setfood,1000); 
	if(!gameon) { 
		newSnake(true);
		++smax;
	}
	gameon = true;
	running = true;
	ingame();
	} else {
		alert('Please Enter Your Name and number of Snake\'s');
	}
	}
}


// remember last settings 
function setLastSetting() {
	if(localStorage.snake !== undefined) {
	obj = JSON.parse(localStorage.snake);
	document.getElementById('name').value = obj.name; // name of snake
	document.getElementById('num').value = obj.no; // no of snakes
	document.getElementById('color').value = obj.color; // snake color
	document.getElementById('color').style.background = obj.color; //input color
	color = obj.color;
	controlmode = parseInt(obj.control); /* User controls */
		let selc = document.getElementById('control');
		selc = selc.querySelectorAll('option');
		for(var i=0,e = selc.length; i< e;++i) {
			if(i === controlmode) {
				selc[i].setAttribute("Selected",'true');
			}
		}	
		
	}
}

/* Store last settign */
function storeSettig(name,no,control) {
	localStorage.snake = '{"name":"'+name+'","no":'+no+',"control":'+control+',"color":"'+color+'"}';
}

/* flip settings  */
function fliptosetting(that) {
	if(fliptosetting.status === undefined || fliptosetting.status === false)
		fliptosetting.status = true;
	else fliptosetting.status = false;
	let front;
	let back;
	if(fliptosetting.status === true) {
		front = that.parentElement;
		back = front.nextElementSibling;
	} else {
		front = that.parentElement;
		back = front.previousElementSibling;
	}
	that = front.parentElement;
	front.style.display = "none";
	if(fliptosetting.status === true) that.style.transform = "rotateY(360deg) translateY(-50%)";
	else that.style.transform = "rotateY(0deg) translateY(-50%)";
	back.style.display = "block";
}

/* Selected color option */
function color_selected(el) {
	if(el.value != "Random Color") el.style.background = el.value;
	else el.style.background = 'white';
	color = el.value;
}