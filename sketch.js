// https://molleindustria.github.io/p5.play/docs/classes/Sprite.html
var trex, trexAnimation
var ground, groundImage
var invisibleGround
var clouds, cloudImage
var obstacles, obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6
var score = 0
var cloudGroup, obstacleGroup
var PLAY = 0
var END = 1
var gameState = PLAY
var gameOver,gameOverImage
var restart,restartImage
var check,die,jump
localStorage["HighestScore"]=0

// preload is used to load the assest, images,videos and audios in a game
function preload() {
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");
  gameOverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")

  check=loadSound("checkpoint (1).mp3")
  die=loadSound("die.mp3")
  jump=loadSound("jump.mp3")

}

// to create sprites we use setup
function setup() {
  createCanvas(windowWidth, windowHeight)

  // trex
  trex = createSprite(40, height-70, 40, 40)
  trex.addAnimation("trex", trexAnimation)
  trex.scale = 0.3

  // ground
  ground = createSprite(200, height-70, 600, 10)
  ground.addImage("floor", groundImage)

  // invisible
  invisibleGround = createSprite(300, height-65, 600, 10)
  invisibleGround.visible = false

  // group
  cloudGroup = new Group()
  obstacleGroup = new Group()
  // obstacleGroup= createGroup()

  trex.debug=false
  // trex.setCollider("rectangle",0,0,180,trex.height)
  trex.setCollider("circle",0,0,50)

  //gameover and restart
  gameOver=createSprite(width/2,height/2+450)
  gameOver.addImage("over",gameOverImage)
  gameOver.scale=0.5

  restart=createSprite(width/2,height/2+470)
  restart.addImage("start",restartImage)
  restart.scale=0.3

}

// to display and give instructions to game throught the program
function draw() {
  background("black")
  drawSprites()

  //check the x and y positions
  // text(mouseX + "," + mouseY, mouseX, mouseY)
  text("Score " + score, width/2-100, height/2+200)
  text("Highest Score: "+localStorage["HighestScore"], width/2-100,height/2+180)



  if (gameState === PLAY) {
    score = score + Math.round(frameCount%10 ===0)

    //ground movement
    ground.velocityX = -4

    // infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    //jump trex
    if (keyDown("up") && trex.y >= height-120) {
      trex.velocityY = -8
      jump.play()
    }
    else if (keyDown("space") && trex.y >= height-120) {
      trex.velocityY = -8
      jump.play()
    }
else if(touches.length>0 && trex.y >= height-120){
      trex.velocityY = -8
      jump.play()
      touches=[]
}
    // grvaity
    trex.velocityY = trex.velocityY + 0.5
    //calling function
    createclouds()
    createobstacles()

    gameOver.visible=false
    restart.visible=false
if(score >0 && score%20===0){
  check.play()
}
    if (obstacleGroup.isTouching(trex)) {
      gameState = END
      die.play()
      // trex.velocityY=-8
      
    }


  }
  else if (gameState === END) {
    ground.velocityX = 0
    trex.velocityY = 0
    obstacleGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)
    obstacleGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)

    gameOver.visible=true
    restart.visible=true

    if(touches.length>0 || mousePressedOver(restart)){
       resetGame()
       touches=[]
    }
  }

  // ground
  trex.collide(invisibleGround)


  // checking trex y position
  // console.log(trex.y)
  // console.log(frameCount)



}


// my own function
function createclouds() {
  if (frameCount % 60 === 0) {
    clouds = createSprite(540, 50, 20, 20)
    clouds.y = Math.round(random((height-150), (height-200)))
    clouds.addImage("cloud", cloudImage)
    clouds.velocityX = -4
    clouds.scale = 0.5

    console.log("cloud depth is: ", clouds.depth)
    console.log("trex depth is: ", trex.depth)
    clouds.depth = trex.depth
    trex.depth += 1

    clouds.lifetime = 135
    cloudGroup.add(clouds)
  }
}

function createobstacles() {
  if (frameCount % 60 === 0) {
    obstacles = createSprite(width-20, height-85, 10, 100)
    obstacles.velocityX = -(6+score/1000)
    obstacles.scale = 0.4
    obstacles.lifetime = obstacles.X/6
    obstacleGroup.add(obstacles)
    var number = Math.round(random(1, 6))
    switch (number) {
      case 1: obstacles.addImage(obstacleImage1)
        break;
      case 2: obstacles.addImage(obstacleImage2)
        break;
      case 3: obstacles.addImage(obstacleImage3)
        break;
      case 4: obstacles.addImage(obstacleImage4)
        break;
      case 5: obstacles.addImage(obstacleImage5)
        break;
      case 6: obstacles.addImage(obstacleImage6)
        break;
      default: break;
    }
  }
}

function resetGame(){
  gameState =PLAY
  obstacleGroup.destroyEach()
  cloudGroup.destroyEach()
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score=0
}