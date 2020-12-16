var START = 0
var PLAY = 1;
var END = 2;
var gameState = 0;

var trex, trex_running, trex_collided, trexStartimg;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameover, gameover2, restart, restart2;

var bird, trexlean;

var bird2, birdGroup

var checkpoint, jump, die;

localStorage["HighestScore"] = 0

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trexStartimg = loadAnimation("trex1.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameover2 = loadImage("gameOver.png")
  restart2 = loadImage("restart.png")
  
  bird  = loadImage("offline-sprite-2x (3) (3).png")
  trexlean = loadAnimation("offline-sprite-2x (1) (1).png")
  checkpoint = loadSound("checkPoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("trexStart", trexStartimg)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.addAnimation("lean", trexlean)
  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdGroup = createGroup()
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle", 0, 0, 40);
  trex.debug = true
  
  score = 0
  
  gameover = createSprite(300, 70, 10, 10)
  gameover.addImage(gameover2)
  gameover.visible = false
  gameover.scale = 0.5
  
  restart = createSprite(300, 100, 10, 10)
  restart.addImage(restart2)
  restart.visible = false
  restart.scale = 0.5
  
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"] = score
  }
  text("HI " + localStorage["HighestScore"],450, 50)
  
  console.log("this is ",gameState)
  
  if(gameState === START){
    
    if(keyDown ("space") || keyDown ("UP_ARROW")){
      gameState = 1
    }
     
    ground.velocityX = 0;
    trex.velocitY = 0
    birdGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
     
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    birdGroup.setLifetimeEach(-1)
    
  }
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4 - score/100
    //scoring
    score = score + Math.round(getFrameRate()/60);
    trex.changeAnimation("running", trex_running)
    
    if(score % 100 === 0 && score > 0){
      checkpoint.play()
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && trex.y >=165) {
      trex.velocityY = -13;
      jump.play()
    }
    
    console.log(trex.y)
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    spawnBirds()
    
    if(keyDown(DOWN_ARROW)){
      trex.changeAnimation("lean", trexlean)
      
    }
    
    if(keyWentUp(DOWN_ARROW)){
      trex.changeAnimation("running", trex_running)
    }
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play()
      //trex.velocityY = -10
    }
  }
   else if (gameState === END) {
     ground.velocityX = 0;
     
     birdGroup.setVelocityXEach(0)
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     obstaclesGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)
     birdGroup.setLifetimeEach(-1)
     
     gameover.visible = true
     restart.visible = true
     
     trex.changeAnimation("collided", trex_collided)
     
     if(mousePressedOver(restart)){
       Reset()
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6 - score/100
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function spawnBirds(){
  if (frameCount % 250 === 0) {
    bird2 = createSprite(600,100,40,10);
    bird2.y = Math.round(random(10,60));
    bird2.addImage(bird);
    bird2.scale = 0.5;
    bird2.velocityX = -3;
    birdGroup.add(bird2)
  }
  
}


function Reset(){
  gameState = START
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  birdGroup.destroyEach()
  gameover.visible = false
  restart.visible = false
  score = 0
}