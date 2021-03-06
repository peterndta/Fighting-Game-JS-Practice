class Sprite{ // func for rendering image bg
    constructor({ position, imageSrc, scale = 1, frameMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image() // tạo html image trong code js property
        this.image.src = imageSrc // set image = hình muốn hiển thị
        this.scale = scale // kích thước phóng của image 
        this.frameMax = frameMax // số lượng frame tối đa (với BG là 1, còn shop là 6)
        this.frameCurrent = 0 // frame hiện tại đang crop

        // 2 thằng dưới để giảm thời gian trôi frame không nhanh quá cho Shop.png
        this.frameElapsed = 0 // số lượng frame trôi qua
        this.frameHold = 9 // số lượng frame trôi qua trước khi tăng số frameCurrent => VD: frameHold = 10 thì 10 frame trôi qua mới chuyển 1 frame Shop => frameHold càng nhỏ thì animation càng nhanh
        this.offset = offset
    }

    draw(){
        // Để tạo hiệu ứng animation cho shop.png cần crop 1 frame đầu tiên
        // rồi di chuyển dần qua các frame tiếp theo để tạo hiệu ứng chuyển động

        // Lý do tại sao Background k di chuyển frame vì 1024 / 1 = 1024 => k chuyển động
        c.drawImage(
            this.image,
            // 2 argument đầu là vị trí crop ra ô vuông sao cho tương ứng với frame đầu 
            this.frameCurrent * (this.image.width / this.frameMax), // crop location x = 0 => start at top left-hand corner 
            0, // crop location y
            this.image.width / this.frameMax, // crop width: ở đây chia 6 vì shop.png có 6 frame
            this.image.height, // crop height
            this.position.x - this.offset.x, // location x of image
            this.position.y - this.offset.y, // location y of image
            (this.image.width / this.frameMax) * this.scale, // image width: / 6 vì nếu k nó sẽ lấy full width của image
            this.image.height * this.scale // image height
        ) // func drawImage để display image ra screen
    }

    animateFrames() {
        this.frameElapsed++ // frameElapsed sẽ tăng lên sau mỗi lần gọi update
        if(this.frameElapsed % this.frameHold === 0){        
            // Di chuyển frame by frame cho tới khi đạt được frameMax (là 6) thì quay về trở lại frame 0 r tiếp tục lập lại => tạo hiệu ứng movement cho shop
            if(this.frameCurrent < this.frameMax - 1){ // - 1 vì BG có frameMax = 1 mà frameCurrent = 0 => true => frameCurrent++ => crop mark vượt ngoài bg image => màu đen => flicking black screen on/off không mong muốn
                this.frameCurrent++
            }else{
                this.frameCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ 
        position, velocity, color = 'red', imageSrc, scale = 1, frameMax = 1,
        offset = { x: 0, y: 0 }, sprites, 
        attackBox = { offset: {}, width: undefined, height: undefined}
    }) {
        super({ // gọi constructor của parrent (Sprite)
            position,
            imageSrc,
            scale,
            frameMax,
            offset
        }) 
        
        this.velocity = velocity
        this.height = 150
        this.width = 50
        // lastKey dùng để keep track phím cuối được nhấn cho vào dòng if below
        // để tránh việc khi press A thì k press D đc vì if vào A đầu tiên 
        this.lastKey

        // Attack Box
        this.attackBox = {
            position:{  // cho attackBox luôn follow model
                // tạo vị trí của attackBox tùy thuộc vào player hay enemy
                x: this.position.x, 
                y: this.position.y,
            }, 
            offset: attackBox.offset, // truyền từ lúc khởi tạo Sprite ở dưới - có tác dụng truyền vào cho update() để đổi hướng attackBox tùy thuộc vào player hay enemy

            // Chiều dài và rộng của attackBox
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color // màu của model
        this.isAttacking // default là false
        this.health = 100

        this.frameCurrent = 0 // frame hiện tại đang crop
        // 2 thằng dưới để giảm thời gian trôi frame không nhanh quá cho Shop.png
        this.frameElapsed = 0 // số lượng frame trôi qua
        this.frameHold = 6 // số lượng frame trôi qua trước khi tăng số frameCurrent => VD: frameHold = 10 thì 10 frame trôi qua mới chuyển 1 frame Shop => frameHold càng nhỏ thì animation càng nhanh
        this.sprites = sprites // chuyển giữa các bộ sprites VD: từ sprites idle qua run hoặc jump
    
        // loop qua sprite object
        for (const sprite in this.sprites) { // sprite là key. VD run hoặc idle bên object sprites trong index.js
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

    }

    update(){
        this.draw()
        // Chuyển động tại chỗ cho Characters
        this.animateFrames()

        //luôn update vị trí cho attackBox follow model
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x // lấy offset -50 (enemy) hoặc 0 (player) để đổi hướng attackBox
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // AttackBox display on screen
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        // luôn update vị trí cho mỗi lần movement
        this.position.x += this.velocity.x // sẽ thêm số lượng pixel truyền vào mỗi frame => tạo hiệu ứng rơi
        this.position.y += this.velocity.y // sẽ thêm số lượng pixel truyền vào mỗi frame => tạo hiệu ứng rơi
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){ // nếu model rơi lớn hơn giới hạn thì k rơi nữa => nhận biết khi nào chạm đất => k bị rơi xuống dưới sâu thêm nữa
            this.velocity.y = 0 // ngăn không cho rơi xuống ngoài canvas
            this.position.y = 330 // tránh việc flash effect giữa idle và fall sprite do có 1 khoảng hở nhỏ của gravity và velocity code 
        } else {
            // chỉ rơi xuống nếu không rơi ra ngoài canvas
            this.velocity.y += gravity // thêm trọng lực - sẽ không còn hở khúc gần dưới màng hình khi rơi vì gravity được thêm vào cho đến khi tơi edge của canvas (576px)
        }
    }

    attack() { // khi bấm attack thì isAttacking sẽ thành true nhưng sau 100ms nó sẽ trở về false
        this.switchSprite('attack1')
        this.isAttacking = true
    } 

    // func để đổi sprites
    switchSprite(sprite) {
        if(this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.frameMax - 1) {
            return
        }
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image 
                    this.frameMax = this.sprites.idle.frameMax

                    /* 
                    tránh tình trạng chớp hình character khi chuyển sprite - vì current frame đang loop qua sprite đó, các frame tăng dần nên khi chuyển qua sprite khác thì
                    current frame vẫn đang bằng frame cuối trước khi bị chuyển qua sprites khác -> gây hiệu ứng chớp tắt -> phải luôn set current frame về 0 trc khi chuyển qua sprite khác
                    */
                    this.frameCurrent = 0 
                    
                }
                break;

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.frameMax = this.sprites.run.frameMax
                    this.frameCurrent = 0 
                }
                break;

            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.frameMax = this.sprites.jump.frameMax
                    this.frameCurrent = 0 
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.frameMax = this.sprites.fall.frameMax
                    this.frameCurrent = 0 
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.frameMax = this.sprites.attack1.frameMax
                    this.frameCurrent = 0 
                }
                break;
        }
    }
}