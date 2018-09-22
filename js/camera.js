//camera object
let cam = {
	X:0,
	Y:0,
	follow: function (x,y) { 
		this.X = x - (WindowWidth/2);
		this.Y = y - (WindowHeight/2);
	}
}