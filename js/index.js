const gameBoard = document.querySelector('.gameboard')
const newGameBtn = document.querySelector('.new-game')
const gameOverText = document.querySelector('.game-over')
const width = 28
let score 
let highScore = 0
let squares = []
let ghosts = []
let pacDirection
let pacmanCurrentIndex

const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,2,2,2,2,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,0,0,0,0,0,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,0,0,0,0,0,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

function createGameboard() {
    for (let element of layout) {
        const square = document.createElement('div')
        gameBoard.appendChild(square)
        squares.push(square)

        if( element === 0) square.classList.add('dot')
        else if( element === 1) square.classList.add('wall')
        else if( element === 2) square.classList.add('ghost-lair')
        else if( element === 3) square.classList.add('powerpellet')
        else square.classList.add('empty')
    }
}
newGameBtn.addEventListener('click', newGame)

function newGame() {
    squares = []
    gameBoard.innerHTML = ''
    createGameboard()

    newGameBtn.disabled = true
    newGameBtn.style.cursor = 'not-allowed'

    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.remove(ghost.className)
        squares[ghost.currentIndex].classList.remove('ghost')
    })

    document.addEventListener('keyup', control)
    score = 0
    
    gameOverText.textContent = '' 
    document.querySelector('.score').textContent = 'Score: 0' 

    pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].classList.add('pacman')

    ghosts = [
        new Ghost('pinky', 348, 100),
        new Ghost('inky', 351, 200),
        new Ghost('blinky', 404, 200),
        new Ghost('clyde', 407, 200) 
    ]
    ghosts.forEach(ghost => ghostMove(ghost))

    highScore = localStorage.getItem('Best', score)
    document.querySelector('.high-score').textContent = 
        `
            High Score: ${JSON.parse(highScore)}
        `
}

function control(e) {
    squares[pacmanCurrentIndex].classList.remove('pacman')
    squares[pacmanCurrentIndex].classList.remove(`${pacDirection}`)
    switch (e.key) {
        case 'ArrowUp':
            if (
                !squares[pacmanCurrentIndex -width].classList.contains('wall') &&
                pacmanCurrentIndex - width >=0
                ){
                pacmanCurrentIndex -=width
                pacDirection = 'north'
            }

        break
        case 'ArrowDown':
            if (
                !squares[pacmanCurrentIndex +width].classList.contains('wall') &&
                pacmanCurrentIndex + width < width * width              
                ){
                pacmanCurrentIndex +=width 
                pacDirection = 'south'
            }
            
        break
        case 'ArrowLeft':
            if (
                !squares[pacmanCurrentIndex -1].classList.contains('wall') &&
                pacmanCurrentIndex % width !== 0
                ){
                pacmanCurrentIndex -=1
                pacDirection = 'west'
            }

            if (pacmanCurrentIndex === 364) {
                pacmanCurrentIndex = 391 
            }

        break
        case 'ArrowRight':
            if (
                !squares[pacmanCurrentIndex +1].classList.contains('wall') &&
                pacmanCurrentIndex % width < width -1
                ) {
                pacmanCurrentIndex +=1
                pacDirection = 'east'
            }

            if (pacmanCurrentIndex === 391) {
                pacmanCurrentIndex = 364 
            }

        break    
    }

    squares[pacmanCurrentIndex].classList.add('pacman')
    squares[pacmanCurrentIndex].classList.add(`${pacDirection}`)
    if (squares[pacmanCurrentIndex].classList.contains('dot')) dotEaten()
    if (squares[pacmanCurrentIndex].classList.contains('powerpellet')) pelletEaten()
    if (
        squares[pacmanCurrentIndex].classList.contains('ghost') &&
        !squares[pacmanCurrentIndex].classList.contains('scared') 
    ) gameOver() 
}

function dotEaten() {
    score++
    if (score === 242) gameOver()
    document.querySelector('.score').innerHTML = `Score: ${score}`
    squares[pacmanCurrentIndex].classList.remove('dot')
    squares[pacmanCurrentIndex].classList.add('empty')
}

function pelletEaten() {
    ghosts.forEach(ghost => {
        ghost.isScared = true
        setTimeout( () => {
            ghost.isScared = false
        }, 10000)
    })
    squares[pacmanCurrentIndex].classList.remove('powerpellet')
    squares[pacmanCurrentIndex].classList.add('empty')

}

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className
        this.startIndex = startIndex
        this.speed = speed
        this.currentIndex = startIndex
        this.isScared = false
        this.timerId = NaN
    }
}


function ghostMove(ghost) {
    const directions = [-1, +1, -width, +width]
    let direction = directions[Math.floor(Math.random() * directions.length)]

    ghost.timerId = setInterval( function() {
        if (
            !squares[ghost.currentIndex + direction].classList.contains('wall') &&
            !squares[ghost.currentIndex + direction].classList.contains('ghost') 
        ) {
            squares[ghost.currentIndex].classList.remove(ghost.className)
            squares[ghost.currentIndex].classList.remove('ghost')
            squares[ghost.currentIndex].classList.remove('scared')

            ghost.currentIndex += direction
            if(
                squares[ghost.currentIndex].classList.contains('pacman') &&
                !ghost.isScared
            ) gameOver()
            squares[ghost.currentIndex].classList.add(ghost.className)
            squares[ghost.currentIndex].classList.add('ghost')
            if(ghost.isScared) squares[ghost.currentIndex].classList.add('scared')

        } else direction = directions[Math.floor(Math.random() * directions.length)]

    }, ghost.speed)
    
}

function gameOver() {
    newGameBtn.disabled = false
    newGameBtn.style.cursor = 'pointer'
    if (score > highScore) localStorage.setItem('Best', JSON.stringify(score))

    if (score === 242) {
        gameOverText.textContent = 'You win!'
        gameOverText.style.color = '#56a832'
    }
    else {
        gameOverText.textContent = 'Game over!' 
        gameOverText.style.color = '#f20f0f'
    }

    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    
    squares[pacmanCurrentIndex].classList.remove('pacman')
    document.removeEventListener('keyup', control)
}