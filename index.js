const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // create new rectangle đại diện cho nhân vật

const gravity = 0.2

class Sprite{
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
        this.draw()
        
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

function animate(){
    window.requestAnimationFrame(animate) // loop funct animate lại nhiều lần
                                        // để có thể animate object frame by frame
    c.fillStyle = 'black' // cho nền đen
    c.fillRect(0, 0, canvas.width, canvas.height) // fill full size canvas màu đen mỗi frame để tạo hiệu ứng rơi thật hơn - không bị chảy dài xuống như sơn 
    player.update()
    enemy.update()
}
animate()