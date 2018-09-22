var colors = [];
	colors.push("#E23A59"); 
	colors.push("#44ADAD"); 
	colors.push("#3E506B"); 
	colors.push("#FCC82B"); 
	colors.push("#0F5E8C"); 

/*food object*/
function food(x,y,_bg) {
	this.x = x;
	this.y = y;
	this.bg = _bg;
	this.mass = Math.floor((Math.random() * 4)+ 3);
	this.color = colors[Math.floor(Math.random() * colors.length)];
	this.show = () => {
		this.bg.fillStyle = this.color;
		this.bg.beginPath();
		this.bg.arc(this.x,this.y,this.mass,0,circ);
		this.bg.fill();
		this.bg.closePath();
	}
	this.clear = () => {
		this.bg.beginPath();
		this.bg.arc(this.x,this.y,this.mass+1,0,circ);
		this.bg.save();
		this.bg.clip();
		this.bg.fillStyle = pattern;
		this.bg.fillRect(0,0,mapWidth,mapHeight);
		this.bg.restore();
		this.bg.closePath();
	}
	this.show();
}