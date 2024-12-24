let player1 = {
  sit: {
    img: null,
    width: 211/6,
    height: 31,
    frames: 6
  },
  walk: {
    img: null,
    width: 183/4,
    height: 45,
    frames: 4
  },
  jump: {
    img: null,
    width: 259/6,
    height: 39,
    frames: 6
  },
  currentAction: 'sit',
  currentFrame: 0,
  frameDelay: 5,
  frameCount: 0,
  x: 200,
  speed: 5,
  direction: 1,
  health: 100,
  maxHealth: 100
};

let player2 = {
  sit: {
    img: null,
    width: 211/6,
    height: 31,
    frames: 6
  },
  walk: {
    img: null,
    width: 183/4,
    height: 38,
    frames: 4
  },
  jump: {
    img: null,
    width: 259/6,
    height: 34,
    frames: 6
  },
  currentAction: 'sit',
  currentFrame: 0,
  frameDelay: 5,
  frameCount: 0,
  x: 600,
  speed: 5,
  direction: 1,
  health: 100,
  maxHealth: 100
};

let backgroundImg;
let fireImg;
let fireballs = [];  // 存儲所有火焰球

function preload() {
  // 載入 player1 的動作圖片
  player1.sit.img = loadImage('player1/sit.png');
  player1.walk.img = loadImage('player1/walk.png');
  player1.jump.img = loadImage('player1/jump.png');
  
  // 載入 player2 的動作圖片
  player2.sit.img = loadImage('player2/sit.png');
  player2.walk.img = loadImage('player2/walk.png');
  player2.jump.img = loadImage('player2/jump.png');
  
  backgroundImg = loadImage('background/background.png');
  fireImg = loadImage('fire/fire.png');
}

function setup() {
  createCanvas(800, 600);
  frameRate(60);
}

function draw() {
  background(220);
  
  // 繪製背景
  image(backgroundImg, 0, 0, width, height);
  
  // 繪製標題
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text("TKUET", width/2, 40);
  
  // 繪製操作規則
  textSize(16);
  textAlign(LEFT);
  fill(255);
  let x = width - 200;  // 右側位置
  let y = 30;          // 起始高度
  let lineHeight = 20;  // 行距
  
  text("操作說明：", x, y);
  text("玩家1：", x, y + lineHeight);
  text("A/D - 左右移動", x, y + lineHeight * 2);
  text("空白鍵 - 發射火焰", x, y + lineHeight * 3);
  
  text("玩家2：", x, y + lineHeight * 4);
  text("←/→ - 左右移動", x, y + lineHeight * 5);
  text("Enter - 發射火焰", x, y + lineHeight * 6);
  
  text("R鍵 - 重置血量", x, y + lineHeight * 7);
  
  // 處理移動輸入
  handleMovement();
  
  // 更新並繪製玩家
  updateAndDrawPlayer(player1);
  updateAndDrawPlayer(player2);
  
  // 更新和繪製火焰球
  updateFireballs();
}

function updateAndDrawPlayer(player) {
  // 更新動畫幀
  player.frameCount++;
  if (player.frameCount >= player.frameDelay) {
    let maxFrames = player[player.currentAction].frames;
    player.currentFrame = (player.currentFrame + 1) % maxFrames;
    player.frameCount = 0;
  }
  
  // 獲取當前動作的資料
  let currentAnim = player[player.currentAction];
  
  // 繪製精靈
  let sx = player.currentFrame * currentAnim.width;
  push();
  translate(player.x, height/2);
  scale(player.direction, 1);
  image(currentAnim.img, 
        -currentAnim.width/2, 
        -currentAnim.height/2, 
        currentAnim.width*2, 
        currentAnim.height*2,
        sx, 0, 
        currentAnim.width, 
        currentAnim.height);
  pop();
  
  // 在繪製完角色後，添加血條顯示
  drawHealthBar(player);
}

function drawHealthBar(player) {
  const barWidth = 100;
  const barHeight = 10;
  const x = player.x - barWidth/2;
  const y = height/2 - player[player.currentAction].height - 20;
  
  // 繪製血條背景
  fill(255, 0, 0);
  rect(x, y, barWidth, barHeight);
  
  // 繪製當前血量
  fill(0, 255, 0);
  let currentWidth = (player.health / player.maxHealth) * barWidth;
  rect(x, y, currentWidth, barHeight);
  
  // 繪製血量數字
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(12);
  text(player.health + '/' + player.maxHealth, player.x, y + barHeight - 1);
}

function handleMovement() {
  // Player 1 移動 (A/D)
  if (keyIsDown(65)) {  // A鍵
    player1.x -= player1.speed;
    player1.direction = -1;
    if (player1.currentAction === 'sit') {
      player1.currentAction = 'walk';
    }
  } else if (keyIsDown(68)) {  // D鍵
    player1.x += player1.speed;
    player1.direction = 1;
    if (player1.currentAction === 'sit') {
      player1.currentAction = 'walk';
    }
  } else if (player1.currentAction === 'walk') {
    player1.currentAction = 'sit';
  }
  
  // Player 2 移動 (左右方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speed;
    player2.direction = -1;
    if (player2.currentAction === 'sit') {
      player2.currentAction = 'walk';
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speed;
    player2.direction = 1;
    if (player2.currentAction === 'sit') {
      player2.currentAction = 'walk';
    }
  } else if (player2.currentAction === 'walk') {
    player2.currentAction = 'sit';
  }
  
  // 限制移動範圍
  player1.x = constrain(player1.x, 50, width-50);
  player2.x = constrain(player2.x, 50, width-50);
}

function keyPressed() {
  // Player 1 控制 (1,2,3)
  if (key === '1') {
    player1.currentAction = 'sit';
    player1.currentFrame = 0;
  }
  else if (key === '2') {
    player1.currentAction = 'walk';
    player1.currentFrame = 0;
  }
  else if (key === '3') {
    player1.currentAction = 'jump';
    player1.currentFrame = 0;
  }
  
  // Player 2 控制 (4,5,6)
  else if (key === '4') {
    player2.currentAction = 'sit';
    player2.currentFrame = 0;
  }
  else if (key === '5') {
    player2.currentAction = 'walk';
    player2.currentFrame = 0;
  }
  else if (key === '6') {
    player2.currentAction = 'jump';
    player2.currentFrame = 0;
  }
  
  // 按 Q 鍵減少 player1 的血量
  if (key === 'q' || key === 'Q') {
    player1.health = max(0, player1.health - 10);
  }
  // 按 P 鍵減少 player2 的血量
  else if (key === 'p' || key === 'P') {
    player2.health = max(0, player2.health - 10);
  }
  // 按 R 鍵重置兩個玩家的血量
  else if (key === 'r' || key === 'R') {
    player1.health = player1.maxHealth;
    player2.health = player2.maxHealth;
  }
  
  // Player 1 發射火焰 (空白鍵)
  if (key === ' ') {
    fireballs.push(new Fireball(
      player1.x + 30 * player1.direction,
      height/2,
      player1.direction,
      'player1'
    ));
  }
  // Player 2 發射火焰 (Enter鍵)
  else if (keyCode === ENTER) {
    fireballs.push(new Fireball(
      player2.x + 30 * player2.direction,
      height/2,
      player2.direction,
      'player2'
    ));
  }
}

// 火焰球類別
class Fireball {
  constructor(x, y, direction, owner) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 10;
    this.owner = owner;  // 'player1' 或 'player2'
    this.width = 30;
    this.height = 30;
  }

  update() {
    this.x += this.speed * this.direction;
  }

  draw() {
    image(fireImg, this.x - this.width/2, this.y - this.height/2, 
          this.width, this.height);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, height/2);
    return d < 50;  // 碰撞檢測範圍
  }
}

function updateFireballs() {
  for (let i = fireballs.length - 1; i >= 0; i--) {
    let fireball = fireballs[i];
    fireball.update();
    fireball.draw();

    // 檢查是否擊中對手
    if (fireball.owner === 'player1' && fireball.hits(player2)) {
      player2.health = max(0, player2.health - 10);
      fireballs.splice(i, 1);
    } else if (fireball.owner === 'player2' && fireball.hits(player1)) {
      player1.health = max(0, player1.health - 10);
      fireballs.splice(i, 1);
    }

    // 移除超出畫面的火焰球
    if (fireball.x < 0 || fireball.x > width) {
      fireballs.splice(i, 1);
    }
  }
}
