const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // create new rectangle đại diện cho nhân vật

const gravity = 0.6

class Sprite{
    constructor({ position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        // lastKey dùng để keep track phím cuối được nhấn cho vào dòng if below
        // để tránh việc khi press A thì k press D đc vì if vào A đầu tiên 
        this.lastKey
        this.attackBox = {
            position:{  // cho attackBox luôn follow model
                // tạo vị trí của attackBox tùy thuộc vào player hay enemy
                x: this.position.x, 
                y: this.position.y,
            }, 
            offset, // truyền từ lúc khổi tạo Sprite ở dưới - có tác dụng truyền vào cho update() để đổi hướng attackBox tùy thuộc vào player hay enemy

            // Chiều dài và rộng của attackBox
            width: 100,
            height: 50,
        }
        this.color = color // màu của model
        this.isAttacking // default là false
        this.health = 100
    }

    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attackBox
        if(this.isAttacking) { // chỉ show attackBox khi ấn attack => isAttacking = true
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)    
        }
    }

    update(){
        this.draw()

        //luôn update vị trí cho attackBox follow model
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x // lấy offset -50 (enemy) hoặc 0 (player) để đổi hướng attackBox
        this.attackBox.position.y = this.position.y

        // luôn update vị trí cho mỗi lần movement
        this.position.x += this.velocity.x // sẽ thêm số lượng pixel truyền vào mỗi frame => tạo hiệu ứng rơi
        this.position.y += this.velocity.y // sẽ thêm số lượng pixel truyền vào mỗi frame => tạo hiệu ứng rơi
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0 // ngăn không cho rơi xuống ngoài canvas
        } else {
            // chỉ rơi xuống nếu không rơi ra ngoài canvas
            this.velocity.y += gravity // thêm trọng lực - sẽ không còn hở khúc gần dưới màng hình khi rơi vì gravity được thêm vào cho đến khi tơi edge của canvas (576px)
        }
    }

    attack() { // khi bấm attack thì isAttacking sẽ thành true nhưng sau 100ms nó sẽ trở về false
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
});

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: -50, y: 0 },
})

enemy.draw();

const keys = { // để khắc phục việc buôn 1 phím nhưng dừng movement
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ attackRect, getHitRect }) { // detect collision between 2 rectangle
    
    // nếu mặt bên phải attackBox vượt qua mặt bên trái của enemy
    // và mặt bên trái của attackBox vượt qua mặt bên phải của enemy thì true    
    // nếu mặt dưới attackBox của player lớn hơn đỉnh đầu của enemy => player đang nhảy cao hơn enemy => hog dính attack
    // và nếu đỉnh đầu của player thấp hơn chiều cao của enemy nhảy lên   
    return (
        attackRect.attackBox.position.x + attackRect.attackBox.width >= getHitRect.position.x 
        && attackRect.attackBox.position.x <= getHitRect.position.x + getHitRect.width 
        && attackRect.attackBox.position.y + attackRect.attackBox.height >= getHitRect.position.y  
        && attackRect.attackBox.position.y <= getHitRect.position.y + getHitRect.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = "flex"
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = "Tie"
    } 
    else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = "Player win!"
    }
    else if (player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = "Enemy win!"
    }
}

let timer = 60
let timerId // dùng cho cancel loop khi có winner
function decreaseTimer(){ // end game by timer
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer === 0){
        determineWinner({player, enemy, timerId})
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate) // loop funct animate lại nhiều lần
                                        // để có thể animate object frame by frame
    c.fillStyle = 'black' // cho nền đen
    c.fillRect(0, 0, canvas.width, canvas.height) // fill full size canvas màu đen mỗi frame để tạo hiệu ứng rơi thật hơn - không bị chảy dài xuống như sơn 
    player.update()
    enemy.update()
    
    player.velocity.x = 0 // dừng model player character khi bỏ tay ra
    enemy.velocity.x = 0 // dừng model enemy character khi bỏ tay ra

    // player movement 
    if(keys.a.pressed && player.lastKey === 'a'){ // nếu pressed = true
        player.velocity.x = -5
    } 
    else if (keys.d.pressed && player.lastKey === 'd'){ 
        player.velocity.x = 5
    }

    // enemy movement 
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){ // nếu pressed = true
        enemy.velocity.x = -5
    } 
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){ 
        enemy.velocity.x = 5
    }

    // Nhận diện va chạm giữa model cho player
    if( rectangularCollision({ 
        attackRect: player,
        getHitRect: enemy
    }) && player.isAttacking ) 
    { 
        player.isAttacking = false; // dòng này chỉ cho phép get hit 1 lần
        console.log("player attack!");
        enemy.health = enemy.health - 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'// giảm máu enemy khi nhận sát thương
    }

    // Nhận diện va chạm giữa model cho enemy
    if( rectangularCollision({ 
        attackRect: enemy,
        getHitRect: player
    }) && enemy.isAttacking ) 
    { 
        enemy.isAttacking = false; // dòng này chỉ cho phép get hit 1 lần
        console.log("enemy attack!");
        player.health = player.health - 20
        document.querySelector('#playerHealth').style.width = player.health + '%'// giảm máu player khi nhận sát thương
    }

    // end game by out of health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }

}
animate()

window.addEventListener( 'keydown', (event) => {
    switch ( event.key){
        // movement player
        case 'd':
            keys.d.pressed = true; // di chuyển 1 px mỗi khi ấn d
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true;
            // di chuyển 1 px mỗi khi ấn a
            player.lastKey = 'a'
            break
        case 'w':
            // bay lên - hạ xuống được nhờ có gravity, vì gravity luôn kéo model xuống nếu như lơ lững (k gần edge rìa)
            player.velocity.y = -10 // thêm 20px vào trục y để nhảy
            break
        case 'j': // ấn space
            player.attack()
            break

        // movement enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true; // di chuyển 1 px mỗi khi ấn mũi tên phải
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            // di chuyển 1 px mỗi khi ấn mũi tên trái
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            // bay lên - hạ xuống được nhờ có gravity, vì gravity luôn kéo model xuống nếu như lơ lững (k gần edge rìa)
            enemy.velocity.y = -10 // thêm 20px vào trục y để nhảy
            break
        case '0': // ấn 0
            enemy.attack()
            break
    }
})

window.addEventListener( 'keyup', (event) => {
    // player
    switch ( event.key){
        case 'd':
            keys.d.pressed = false; // di chuyển 1 px mỗi khi ấn d
            break
        case 'a':
            keys.a.pressed = false; // di chuyển 1 px mỗi khi ấn a
            break
    }

    // enemy
    switch ( event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false; // di chuyển 1 px mỗi khi ấn d
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false; // di chuyển 1 px mỗi khi ấn a
            break
    }
})