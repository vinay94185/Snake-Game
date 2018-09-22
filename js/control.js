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