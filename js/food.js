let colors = [
	"#E23A59", 
	"#44ADAD", 
	"#3E506B", 
	"#FCC82B", 
	"#0F5E8C"
];

/*food object*/
class food {
	show() {
		this.bg.fillStyle = this.color;
		this.bg.strokeStyle = this.color;
		this.bg.lineWidth = 2;
		this.bg.beginPath();
		this.bg.arc(this.x,this.y,this.mass,0,circ);
		this.bg.stroke();
		this.bg.globalAlpha = 0.5;
		this.bg.fill();
		this.bg.globalAlpha = 1;
		this.bg.closePath();
	}
	clear() {
		this.bg.beginPath();
		this.bg.arc(this.x,this.y,this.mass+1,0,circ);
		this.bg.save();
		this.bg.clip();
		this.bg.fillStyle = pattern;
		this.bg.fillRect(0,0,mapWidth,mapHeight);
		this.bg.restore();
		this.bg.closePath();
	}
	constructor(x,y,_bg) {
		this.x = x;
		this.y = y;
		this.bg = _bg;
		this.mass = Math.floor((Math.random() * 3)+ 6);
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.show();
	}
}