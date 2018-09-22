window.addEventListener("load",init);

let dash;
const mapWidth = 2000;
const mapHeight = 2000;
let WindowWidth = window.innerWidth;
let WindowHeight = window.innerHeight;
const circ = 2*(22/7);
let Hgraphic = 0;
let buff;
let foodbuff;
let patbuff;
let ct,bg,bp;
let backgroundImage = new Image();	
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
	
function init() {
	dash = false;
	Screen = document.getElementById('gameScreen');
	patBack = document.getElementById('Background');
	Screen.width = WindowWidth;
	Screen.height = WindowHeight;
	patBack.height = WindowHeight;
	patBack.width = WindowWidth;
	ctx = Screen.getContext("2d");
	bpx = patBack.getContext("2d", { alpha: false });
	
	backgroundImage.src = './data/square.png';	
	
	// Adding Buffer
	buff = document.createElement('canvas');
	patbuff = document.createElement('canvas');
	buff.width = mapWidth;
	buff.height = mapHeight;
	patbuff.width = mapWidth;
	patbuff.height = mapHeight;
	ct = buff.getContext('2d');
	bp = patbuff.getContext('2d');
	
	//put background on map
	backgroundImage.onload = () => {
		pattern = bp.createPattern(backgroundImage, 'repeat');
		bp.fillStyle = pattern;
		bp.fillRect(0,0,mapWidth,mapHeight);
	}
}