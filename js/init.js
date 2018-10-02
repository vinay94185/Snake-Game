window.addEventListener("load",init);

let dash;
const mapWidth = 2000;
const mapHeight = 2000;
let WindowWidth = window.innerWidth;
let WindowHeight = window.innerHeight;
const circ = 2*(22/7);
let buff;
let ct;
let resloaded = false;
let bgimg = new Image();	
let bgwidth,bgheight;
let img = new Image();	
let Screen,Back,patBack;
let ctx,bgx,bpx;
let edible = [];
let snakes = [];
let score = 0;
let playerGo = 'right';
let frame;
let gameon = false;
let pattern;
let running = false;
let comp;
let controlmode = (WindowWidth < 768) ? 3 : 0;
let playerX = 0;
let playerY = 0;
	
function init() {
	dash = false;
	Screen = document.getElementById('gameScreen');
	patBack = document.getElementById('Background');
	Screen.width = WindowWidth;
	Screen.height = WindowHeight;
	patBack.height = WindowHeight;
	patBack.width = WindowWidth;
	ctx = Screen.getContext("2d");
	bpx = patBack.getContext("2d",{alpha:false});
	bgimg.onload = () => {
		bgwidth = bgimg.naturalWidth;
		bgheight = bgimg.naturalHeight;
		window.bgcanv = document.createElement('canvas');
		bgcanv.height = bgheight;
		bgcanv.width = bgwidth;
		bgcanv.getContext('2d',{alpha:false}).drawImage(bgimg,0,0,bgheight,bgwidth);
		resloaded = true;
	}
	bgimg.src = './data/square.png';	
	
	// Adding Buffer
	buff = document.createElement('canvas');
	buff.width = mapWidth;
	buff.height = mapHeight;
	ct = buff.getContext('2d');
}