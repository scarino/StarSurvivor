var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 600;
document.body.appendChild(canvas);

var endSound = new Audio("../Sounds/playerDead.wav");

//ship picture
var shipX = 25;
var shipY = canvas.height/2;
var shipXDiff = 35;
var shipYDiff = 15;

//ship movement
var shipDeltaX = 0;
var shipDeltaY = 0;
var shipSpeedX = 5;
var shipSpeedY = 5;
var shipMoveY = 'NONE';
var shipMoveX = 'NONE';

function drawShip(){
	ctx.fillStyle = 'rgb(100,200,250)';
	ctx.beginPath();
	ctx.moveTo(shipX,shipY - shipYDiff);
	ctx.lineTo(shipX + shipXDiff,shipY);
	ctx.lineTo(shipX,shipY + shipYDiff);
	ctx.fill();
}

function moveShip(){
	if (shipMoveY == 'UP'){
		shipDeltaY = -shipSpeedY;
	}
	else if (shipMoveY == 'DOWN'){
		shipDeltaY = shipSpeedY;
	}
	else{
		shipDeltaY = 0;
	}
	
	if (shipMoveX == 'LEFT'){
		shipDeltaX = -shipSpeedX;
	}
	else if (shipMoveX == 'RIGHT'){
		shipDeltaX = shipSpeedX;
	}
	else{
		shipDeltaX = 0;
	}
	
	if (shipY + shipDeltaY - shipYDiff < 0 || shipY + shipDeltaY + shipYDiff > canvas.height){
		shipDeltaY = 0;
	}
	
	if (shipX + shipDeltaX < 0 || shipX + shipDeltaX + shipXDiff > canvas.width){
		shipDeltaX = 0;
	}
	
	shipY += shipDeltaY;
	shipX += shipDeltaX;
}

function drawBackground(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function moveStars(){
	for (var i = 0; i < stars.length; i++){
		if (stars[i].xPos + stars[i].rad < 0){
				stars[i].xPos = canvas.width + stars[i].rad;
				stars[i].yPos = Math.floor(1 + Math.random()*canvas.height);
				stars[i].rad = Math.floor(1 + Math.random()*2);
				stars[i].speed = Math.floor(1 + Math.random()*4);
		}
		stars[i].xPos -= stars[i].speed;
	}
}

function drawStars(){
	ctx.fillStyle = 'white';
	for(var i = 0; i < stars.length; i++){
		ctx.beginPath();
		ctx.arc(stars[i].xPos, stars[i].yPos, stars[i].rad, 0, Math.PI*2, true);
		ctx.fill();
	}
}

function starsObject(x, y, rad, speed){
	this.xPos = x;
	this.yPos = y;
	this.rad = rad;
	this.speed = speed;
}

var stars = new Array(50);
for(var i = 0; i < stars.length; i++){
	var tempX = Math.floor(1 + Math.random()*canvas.width);
	var tempY = Math.floor(1 + Math.random()*canvas.height);
	var tempRad = Math.floor(1 + Math.random()*2);
	var tempSpeed = Math.floor(1 + Math.random()*4);
	stars[i] = new starsObject(tempX, tempY, tempRad, tempSpeed);
}

function bulletObject(x, y, len, speed, color, type){
	this.xPos = x;
	this.yPos = y;
	this.len = len;
	this.speed = speed;
	this.shotSound = new Audio("../Sounds/shot.wav");
	this.color = color;
	this.type = type;
}
var bullets = new Array();

function createBullet(){
	var tempBul = new bulletObject(shipX + shipXDiff, shipY, 10, 9, 'yellow', 0);
	tempBul.shotSound.play();
	bullets.push(tempBul);
}

function createEnemyBullet(enemy){
	var tempBul = new bulletObject(enemy.shipX - enemy.shipXDiff, enemy.shipY, 10, -9, '#A0F', 1);
	bullets.push(tempBul);
}

function drawBullets(){
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	
	for(var i = 0; i < bullets.length; i++){
		ctx.strokeStyle = bullets[i].color;
		ctx.beginPath();
		ctx.moveTo(bullets[i].xPos, bullets[i].yPos);
		ctx.lineTo(bullets[i].xPos + bullets[i].len, bullets[i].yPos);
		ctx.stroke();
	}
}

function moveBullets(){
	var removeArray = new Array();
	for(var i = 0; i < bullets.length; i++){
		bullets[i].xPos += bullets[i].speed;
		
		if(bullets[i].xPos - bullets[i].speed > canvas.width ||
			bullets[i].xPos + bullets[i].speed < 0){
			removeArray.push(bullets[i]);
		}
	}
	
	for(var i = 0; i < removeArray.length; i++){
		var index = bullets.indexOf(removeArray[i]);
		bullets.splice(index, 1);
	}
}

function enemyObject(){
	this.shipXDiff = 35;
	this.shipYDiff = 15;
	this.shipX = canvas.width + this.shipXDiff;
	this.shipY = Math.floor(this.shipYDiff + Math.random()*(canvas.height - (this.shipYDiff*2)));
	this.speedX = Math.floor(3 + Math.random()*3);
	this.speedX = 0 - this.speedX;
	this.deadSound = new Audio("../Sounds/dead.wav");
	this.hitSound = new Audio("../Sounds/hit.wav");
	
	this.val = Math.floor(Math.random() * 11);
	
	if (this.val < 8){
		this.type = 1;
	} else if (this.val < 10){
		this.type = 2;
	} else {
		this.type = 3;
	}
	this.points = this.type * 10;
	
}

function drawEnemies(){
	for(var i = 0; i < enemies.length; i++){
	
		switch(enemies[i].type){
		case 1:
			ctx.fillStyle = 'rgb(200,0,0)';
			break;
		case 2:
			ctx.fillStyle = 'orange';
			break;
		case 3:
			ctx.fillStyle = 'green';
			break;
		}
		ctx.beginPath();
		ctx.moveTo(enemies[i].shipX,enemies[i].shipY - enemies[i].shipYDiff);
		ctx.lineTo(enemies[i].shipX - enemies[i].shipXDiff,enemies[i].shipY);
		ctx.lineTo(enemies[i].shipX,enemies[i].shipY + enemies[i].shipYDiff);
		ctx.fill();
	}
}

var spawnVal = 40;
var spawnCounter = 1;
function createEnemy(){
	
	if(spawnCounter % 1500 == 0){
		spawnVal -= 1;
	}

	if(Math.floor(Math.random()*spawnVal) < 1){
		enemies.push(new enemyObject());
	}
}

function moveEnemies(){
	var deadEnemies = new Array();
	
	for(var i = 0; i < enemies.length; i++){
		enemies[i].shipX += enemies[i].speedX;
		
		if(enemies[i].shipX - enemies[i].speedX < 0){
			deadEnemies.push(enemies[i]);
			score -= enemies[i].points;
		}
	}
	
	for(var i = 0; i < deadEnemies.length; i++){
		var index = enemies.indexOf(deadEnemies[i]);
		enemies.splice(index, 1);
	}
}

function shootEnemyBullet(){
	for(var i = 0; i < enemies.length; i++){
		if (Math.floor(Math.random() * 200) == 0){
			createEnemyBullet(enemies[i]);
		}
	}
}

var enemies = new Array();

function checkCollisions(){

	var deadBullets = new Array();
	var deadEnemies = new Array();
	
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].type == 0){
			for(var j = 0; j < enemies.length; j++){
				
				var bullCentreX = bullets[i].xPos + (bullets[i].len/2);
				var bullCentreY = bullets[i].yPos + 2;
				
				var enemyCentreX = enemies[j].shipX - (enemies[j].shipXDiff / 2)
				var enemyCentreY = enemies[j].shipY + (enemies[j].shipYDiff / 2)
				
				var disX = bullCentreX - enemyCentreX;
				disX *= disX;
				
				var disY = bullCentreY - enemyCentreY;
				disY *= disY;
				
				if (Math.floor(Math.sqrt(disX + disY)) < 18){
					deadBullets.push(bullets[i]);
					
					enemies[j].type--;
					
					switch(enemies[j].type){
					
					case 0:
						deadEnemies.push(enemies[j]);
						score += enemies[j].points;
						enemies[j].deadSound.play();
						break;
					default:
						enemies[j].hitSound.play();
						break;
					}
					
					break;
				}
			}
		} else {
		
			var bullCentreX = bullets[i].xPos + (bullets[i].len/2);
			var bullCentreY = bullets[i].yPos + 2;
			
			var shipCentreX = shipX + (shipXDiff/2);
			var shipCentreY = shipY + (shipYDiff/2);
			
			var disX = bullCentreX - shipCentreX;
			disX *= disX;
				
			var disY = bullCentreY - shipCentreY;
			disY *= disY;
			
			if (Math.floor(Math.sqrt(disX + disY)) < 18){
				endSound.play();
				endGame();
			}
		
		}
	}
	
	for(var i = 0; i < enemies.length; i++){
		
		var enemyCentreX = enemies[i].shipX - (enemies[i].shipXDiff / 2)
		var enemyCentreY = enemies[i].shipY + (enemies[i].shipYDiff / 2)
		
		var shipCentreX = shipX + (shipXDiff/2);
		var shipCentreY = shipY + (shipYDiff/2);
		
		var disX = enemyCentreX - shipCentreX;
		disX *= disX;
			
		var disY = enemyCentreY - shipCentreY;
		disY *= disY;
		
		if (Math.floor(Math.sqrt(disX + disY)) < 20){
			endSound.play();
			endGame();
		}
	}
	
	for(var i = 0; i < deadBullets.length; i++){
		var index = bullets.indexOf(deadBullets[i]);
		bullets.splice(index, 1);
	}
	
	for(var i = 0; i < deadEnemies.length; i++){
		var index = enemies.indexOf(deadEnemies[i]);
		enemies.splice(index, 1);
	}

}

var score = 0;

function displayScoreBoard(){
	//Set the text font and color
	ctx.fillStyle = 'rgb(200,100,50)';
	ctx.font = "30px Times New Roman";

	//Clear the bottom 30 pixels of the canvas
	//ctx.clearRect(0,canvas.height-30,canvas.width,30);	
	// Write Text 5 pixels from the bottom of the canvas
	ctx.fillText('Score: '+score,10,canvas.height-20);
	
	var level = (40 - spawnVal) + 1
	ctx.fillText('Level: '+level,900,canvas.height-20);
}

function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height);

	drawBackground();
	checkCollisions();
	
	moveStars();
	drawStars();

	moveBullets();
	drawBullets();
	
	moveShip();
	drawShip();
	
	createEnemy();
	moveEnemies();
	shootEnemyBullet();
	drawEnemies();
	
	displayScoreBoard();
	
	spawnCounter++;
}

var firing = 0;
function startGame(){
	gameLoop = setInterval(animate,20);
	
	$(document).keydown(function(evt) {
		if (evt.keyCode == 38) {
			shipMoveY = 'UP';
		} else if (evt.keyCode == 40){
			shipMoveY = 'DOWN';
		} 
		
		if (evt.keyCode == 37){
			shipMoveX = 'LEFT';
		} else if (evt.keyCode == 39){
			shipMoveX = 'RIGHT';
		}
		
		if (evt.keyCode == 32 && firing == 0 && isDead == 0){
			firing = 1;
			createBullet();
		}
	});			

	$(document).keyup(function(evt) {
		if (evt.keyCode == 38) {
			shipMoveY = 'NONE';
		} else if (evt.keyCode == 40){
			shipMoveY = 'NONE';
		}
		
		if (evt.keyCode == 37){
			shipMoveX = 'NONE';
		} else if (evt.keyCode == 39){
			shipMoveX = 'NONE';
		}
		
		if (evt.keyCode == 32 && firing == 1){
			firing = 0;
		}
	});
}

function endGame(){
	clearInterval(gameLoop);
	ctx.fillStyle = 'rgb(200,100,50)';
	ctx.font = "40px Times New Roman";
	ctx.fillText('Game Over',canvas.width/2 - 90,canvas.height/2);
	isDead = 1;
}

var isDead = 0;
startGame();
