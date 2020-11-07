/*******/
/* HUD */
/*******/
const healthBar = document.querySelector("#health");
const ammo = document.querySelector("#ammo");
const kills = document.querySelector("#kills");
const background = document.querySelector("#background");
const gameOverMessage = document.querySelector("#gameover");
gameOverMessage.style.opacity = 0;
var killCount = 0;
kills.innerHTML = `Kills: ${parseInt(killCount)}`;
/****************/
/* Player Logic */
/****************/

const avatar = document.querySelector('#avatar');
const light = document.querySelector('#light');
const startingGun = document.querySelector('#starting-gun');
var posX = 0; // stores the avatar's X position
var posY = 0; // stores the avatar's Y position
var angle = 0; // stores the angle between the avatar and the cursor
var keyState = {}; // keeps a record of the keys that are pressed
var mouseX; // stores the mouse's x position
var mouseY; // stores the mouse's y position
var playerHealth = 100;

healthBar.innerHTML = `Health: ${parseInt(playerHealth)}`;

window.addEventListener('mouseover', loadGameListeners);
playerMove();
stopDrag();

// Refreshes player rotation and position every .009 seconds
function playerMove(){
    const frameRate = .009;

    var move = 'transform: translate(' + posX + 'px, ' + posY + 'px) rotate(' + angle + 'deg) ;';
    avatar.setAttribute('style', move);
    light.setAttribute('style', move);
    startingGun.setAttribute('style', move);

    moveAvatar();
    rotateAvatar();
    if(playerHealth < 1){
        gameOver();
        return;
    }
    setTimeout(playerMove, frameRate);
}
// Stops player elements from being draggable
function stopDrag(){
    avatar.setAttribute('draggable', false);
    light.setAttribute('draggable', false);
    startingGun.setAttribute('draggable', false);
    ammo.setAttribute('draggable', false);
    healthBar.setAttribute('draggable', false);
}
// Loads all of the event listeners concerning player controls
function loadGameListeners(e){
    window.addEventListener('mousemove', getMousePosition);
    window.addEventListener('keydown', function(e){
        keyState[e.keyCode || e.which] = true;
    }, true);
    window.addEventListener('keyup', function(e){
        keyState[e.keyCode || e.which] = false;
    }, true);
    window.addEventListener('mousedown', startingGunshot);
}
function removeGameListeners(){
    window.removeEventListener('mousemove', getMousePosition);
    window.removeEventListener('keydown', function(e){
        keyState[e.keyCode || e.which] = true;
    }, true);
    window.removeEventListener('keyup', function(e){
        keyState[e.keyCode || e.which] = false;
    }, true);
    window.removeEventListener('mousedown', startingGunshot);
}
// Moves the avatar with the WASD keys
function moveAvatar(){
    const topBound = -370, leftBound = -655, rightBound = 760, lowerBound = 420;
    const speedMod = 1;
    const speedMod1 = Math.sqrt(.5);
    if (keyState[87] && keyState[68]){ // moving up and to the right
        if(posX < rightBound)
        posX += speedMod1;
        if(posY > topBound)
        posY -= speedMod1;
    }
    else if(keyState[87] && keyState[65]) // up and left
    {
        if(posY > topBound)
        posY -= speedMod1;
        if(posX > leftBound)
        posX -= speedMod1;
    }
    else if(keyState[83] && keyState[68]) // down and right
    {
        if(posY < lowerBound)
        posY += speedMod1;
        if(posX < rightBound)
        posX += speedMod1;
    }
    else if(keyState[83] && keyState[65]){ // down and left
        if(posY < lowerBound)
        posY += speedMod1;
        if(posX > leftBound)
        posX -= speedMod1;
    }
    else if (keyState[65] && posX > leftBound){ // left
        posX -= speedMod;
    }
    else if (keyState[68] && posX < rightBound){ // right
        posX += speedMod;
    }
    else if (keyState[83] && posY < lowerBound){ // down
        posY += speedMod;
    }
    else if (keyState[87] && posY > topBound){ // up
        posY -= speedMod;
    }
}
// Returns the (x, y) position of the cursor relative to the top left of the screen
function getMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
// Gets the (x, y) position of the avatar's origin relative to top left of the screen
function getAvatarPosition() {
    var rect = avatar.getBoundingClientRect();
    var xPos = rect.left + 18;
    var yPos = rect.top + 18;
    return {
        x: xPos,
        y: yPos
    };
}
// Makes the avatar rotate to point in the direction of the cursor
function rotateAvatar(){
    var avatarX = getAvatarPosition().x;
    var avatarY = getAvatarPosition().y; 

    // Finds the angle between the cursor and the avatar
    angle = (Math.atan((mouseY - avatarY)/(mouseX - avatarX))) * (180/Math.PI); 
    
    if(mouseX - avatarX < 0){
        angle += 180;
    }
}


/****************/
/* Zombie Logic */
/****************/
const zombies = document.querySelector('.zombies');
console.log(zombies);
var zombie = [];
const zCount = 20;
for (var i = 0; i < zCount; i++) {
    zombie.push({
        x: 0,
        y: 0, 
        angle: 0,
        life: 1,
        health: 100, // zombie's starting health
        speed: .1, // default is .3
        frameRate: .009,
        id: i,
        isDead: false,
        image: document.querySelector(`.zombie${i}`)
    });
}
for (var i = 0; i < zCount; ++i) {
    spawnPosition(zombie[i]);
    refreshZombie(zombie[i]);
}
//spawnPosition(zombie[0]);
//refreshZombie(zombie[0]);
// Takes in a humanoid object and changes its position to a random spot on the edge of the screen
function spawnPosition(el){
    var screenSide = Math.floor((Math.random() * 4) + 1);
    var randY = Math.floor((Math.random() * 790) + 0);
    var randX = Math.floor((Math.random() * 1400) + 0);
    if(screenSide == 1){
        el.x = 0;
        el.y = randY;
    } else if(screenSide == 2){
        el.y = 790
        el.x = randX;
    } else if(screenSide == 3){
        el.x = 1400;
        el.y = randY;
    } else if(screenSide == 4){
        el.y = 0;
        el.x = randX;
    }
    el.isDead = false;
}
// Takes in a humanoid object and returns the (x, y) position of the their origin relative to top left of the screen
function getHumanoidPosition(el) {
    var rect = el.image.getBoundingClientRect();
    var xPos = rect.left + 18;
    var yPos = rect.top + 18;
    return {
        x: xPos,
        y: yPos
    };
}
/* 
Takes in a humanoid object and finds the angle between it and the player avatar, 
then modifies the object's angle property to be the new angle.
*/
function getAngle(el){
    var zombieX = getHumanoidPosition(el).x;
    var zombieY = getHumanoidPosition(el).y; 
    var avatarX = getAvatarPosition().x;
    var avatarY = getAvatarPosition().y;
    // Finds the angle between the cursor and the avatar
    zAngle = (Math.atan((avatarY - zombieY)/(avatarX - zombieX))) * (180/Math.PI); 
    //console.log(zAngle);
    if(avatarX - zombieX < 0){
        zAngle += 180;
    }
    el.angle = zAngle;
}
/*
Takes in a humanoid object and its current x and y position, then modifies
that position to shift toward the player's avatar
*/
function moveZombie(el){
    var tx = getAvatarPosition().x - getHumanoidPosition(el).x,
    ty = getAvatarPosition().y - getHumanoidPosition(el).y,
    dist = Math.sqrt(tx*tx+ty*ty);

    velX = (tx/dist)*el.speed;
    velY = (ty/dist)*el.speed;
    
    el.x += velX;
    el.y += velY;
}
// Takes in a humanoid object then returns true if it was hit by the player's gunshot and false if not
function isHit(el){
    function getZombieHitBoxRight(){
        var rect = el.image.getBoundingClientRect();
        var brX = rect.left + 36;
        var brY = rect.top + 36;
        var trX = brX;
        var trY = brY - 36;
        return {
            p: brX,
            q: brY,
            r: trX,
            s: trY
        };
    }
    function getZombieHitBoxBottom(){
        var rect = el.image.getBoundingClientRect();
        var brX = rect.left + 36;
        var brY = rect.top + 36;
        var blX = brX - 36;
        var blY = brY;
        return {
            p: brX,
            q: brY,
            r: blX,
            s: blY
        };
    }
    function getZombieHitBoxTop(){
        var rect = el.image.getBoundingClientRect();
        var tlX = rect.left;
        var tlY = rect.top;
        var trX = tlX + 36;
        var trY = tlY;
        return {
            p: tlX,
            q: tlY,
            r: trX,
            s: trY
        };
    }
    function getZombieHitBoxLeft(){
        var rect = el.image.getBoundingClientRect();
        var tlX = rect.left;
        var tlY = rect.top;
        var blX = tlX;
        var blY = tlY + 36;
        return {
            p: tlX,
            q: tlY,
            r: blX,
            s: blY
        };
    }
    function magicStuff(p,q,r,s){
        var a = getAvatarPosition().x;
        var b = getAvatarPosition().y;
        var c = mouseX;
        var d = mouseY;
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }
    var L = getZombieHitBoxLeft();
    var R = getZombieHitBoxRight();
    var T = getZombieHitBoxTop();
    var B = getZombieHitBoxBottom();
    if(magicStuff(L.p,L.q,L.r,L.s)||magicStuff(R.p,R.q,R.r,R.s)||magicStuff(T.p,T.q,T.r,T.s)||magicStuff(B.p,B.q,B.r,B.s)){
        return true;
    } else {
        return false;
    }
}
// 
function zombieHitAnimation(el){
    var selector = Math.floor((Math.random() * 4) + 1);
    if(selector == 1){
        el.image.src="../Images/zombieH1.png";
    } else if(selector == 2){
        el.image.src="../Images/zombieH2.png";
    } else if(selector == 3){
        el.image.src="../Images/zombieH3.png";
    } else if(selector == 4){
        el.image.src="../Images/zombieH4.png";
    }
    setTimeout(function(){
        el.image.src="../Images/zombie.png"; 
    }, 50);
}
// Takes in a zombie and refreshes its frames
function refreshZombie(el){  
    getAngle(el);
    if(getAvatarPosition().x != getHumanoidPosition(el).x && getAvatarPosition().y != getHumanoidPosition(el).y)
    {
        moveZombie(el);
    }
    var s =  'transform: translate(' + el.x + 'px, ' + el.y + 'px) rotate(' + el.angle + 'deg) ;';
    el.image.setAttribute('style', s);
    if(el.health <= 0){
        el.isDead = true;
        killCount += 1;
        kills.innerHTML = `Kills: ${parseInt(killCount)}`;
        respawnZombie(el);
        return;
    }
    if(el.isDead == false)
    {
        setTimeout(function(){
            refreshZombie(el);
        }, el.frameRate);
    }
   
}
// Takes in a dead zombie and respawns them with increased speed and health
function respawnZombie(el){
    setTimeout(function(){
        el.image.src = "../Images/dead-zombie.png";
    }, 60);
    var random = Math.floor((Math.random() * 10) + 5);
    setTimeout(function(){
        spawnPosition(el);
        el.health = 100 + (el.life * 10);
        if(el.speed < .7){ //puts a cap on the speed a zombie can have
        el.speed += .02;
        }
        el.life += 1;
        el.isDead = false;
        refreshZombie(el);
        el.image.src="../Images/zombie.png"; 
    }, (random * 1000));
    
}


// Takes in a zombie and tests to see if the zombie's hitbox is within the player's hitbox, then returns true is it is
function collisionDetect(el){
    var zRect = el.image.getBoundingClientRect();
    var aRect = avatar.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - 15) < (zRect.top)) ||
        (aRect.top + 15  > (zRect.top + zRect.height)) ||
        ((aRect.left + aRect.width - 15) < zRect.left) || // player's right
        (aRect.left + 15 > (zRect.left + zRect.width)) // left
    );
}

/*****************/
/* Gunfire Logic */
/*****************/
var canCall = true;
var startingGunAmmo = 100000;
const gunshot = document.querySelector("#startingGunshot");
const hitmarker = document.querySelector("#hitmarker");
const emptyClip = document.querySelector("#startingGunEmpty");
ammo.innerHTML = `Ammo: ${parseInt(startingGunAmmo)}`;

// Makes the avatar fire his starting gun
function startingGunshot(){
    if(!canCall){
        return;
    }
    if(startingGunAmmo <= 0){
        emptyClip.currentTime = 0;
        emptyClip.play();
        return;
    } else {
        canCall = false;
        startingGunAmmo -= 1;
        ammo.innerHTML = `Ammo: ${parseInt(startingGunAmmo)}`;
        gunshot.currentTime = 0;
        gunshot.play();
        startingGun.src = "../Images/guns/startingGunFiring.png";
        for (var i = 0; i < zCount; ++i) {
            if(isHit(zombie[i]) == true && zombie[i].isDead == false){
                zombie[i].health -= 10;
                zombieHitAnimation(zombie[i]);
                hitmarker.play();
            }
        }
        setTimeout(function(){
            startingGun.src = "../Images/guns/startingGun.png";
            canCall = true;
        }, 100);
    }
}

// takes in a zombie and if that zombie is touching the player, depletes that player's health
function playerDamaged(el){
    const frameRate = .1; //default = .009
    playerHit = document.querySelector("#grunt");
    if(collisionDetect(el) == true && el.isDead == false){
        if(playerHealth > 1){
            playerHealth -= .04;    
        }
        playerHit.play();
        healthBar.innerHTML = `Health: ${parseInt(playerHealth)}`;
    }
    setTimeout(function(){
        playerDamaged(el);
    }, frameRate);
}
for (var i = 0; i < zCount; ++i) {
    playerDamaged(zombie[i]);
}
function gameOver(){
    if(playerHealth < 1){
        removeGameListeners();
        
        gameOverMessage.style.opacity = 100; 
        light.remove();
        canCall = false;
        document.body.style.background = 'white';
        avatar.style.opacity = 0;
        startingGun.style.opacity = 0;
    }
    return;
}










