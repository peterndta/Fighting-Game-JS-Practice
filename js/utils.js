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