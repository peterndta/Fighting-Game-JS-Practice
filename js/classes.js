class Sprite{ // func for rendering image bg
    constructor({ position, imageSrc}) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image() // tạo html image trong code js property
        this.image.src = imageSrc // set image = hình muốn hiển thị
    }

    draw(){
        c.drawImage(this.image, this.position.x , this.position.y) // func drawImage để display image ra screen
    }

    update(){
        this.draw()
    }
}

class Fighter{
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
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){ // nếu model rơi lớn hơn giới hạn thì k rơi nữa => nhận biết khi nào chạm đất => k bị rơi xuống dưới sâu thêm nữa
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