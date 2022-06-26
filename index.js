const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // create new rectangle đại diện cho nhân vật

const gravity = 0.6

const background = new Sprite({ // sprite để render bg
    position: { x: 0, y: 0 },
    imageSrc: './BG/background.png'
})

const shop = new Sprite({ // sprite để render shop animation
    position: { x: 600, y: 128 },
    imageSrc: './BG/shop.png',
    scale: 2.75, // phóng to shop image lên 1.5 px
    frameMax: 6
})

const player = new Fighter({
    position: { x: 54, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    imageSrc: './P1/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
})

const enemy = new Fighter({
    position: { x: 900, y: 100 },
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

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate) // loop funct animate lại nhiều lần
                                        // để có thể animate object frame by frame
    c.fillStyle = 'black' // cho nền đen
    c.fillRect(0, 0, canvas.width, canvas.height) // fill full size canvas màu đen mỗi frame để tạo hiệu ứng rơi thật hơn - không bị chảy dài xuống như sơn 
    background.update() // gọi bg trc để k bị đè lên model character
    shop.update() 
    player.update()
    // enemy.update()
    
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