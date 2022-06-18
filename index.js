const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // create new rectangle đại diện cho nhân vật

const gravity = 0.6

class Sprite{
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        
        // lastKey dùng để keep track phím cuối được nhấn cho vào dòng if below
        // để tránh việc khi press A thì k press D đc vì if vào A đầu tiên 
        this.lastKey
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y // sẽ thêm số lượng pixel truyền vào mỗi frame => tạo hiệu ứng rơi
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0 // ngăn không cho rơi xuống ngoài canvas
        } else {
            // chỉ rơi xuống nếu không rơi ra ngoài canvas
            this.velocity.y += gravity // thêm trọng lực - sẽ không còn hở khúc gần dưới màng hình khi rơi vì gravity được thêm vào cho đến khi tơi edge của canvas (576px)
        }
    }
}

const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 }
});

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 }
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
}
animate()

window.addEventListener( 'keydown', (event) => {
    switch ( event.key){
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