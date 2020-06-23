document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = document.querySelectorAll('.grid div')
    const mobileControls = document.querySelector('.mobile-controls')
    const scoreDisplay =  document.querySelector('#score')
    const startBtn =  document.querySelector('#startButton')
    const restartBtn = document.querySelector('#restartButton')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = ['orange', 'red', 'purple', 'green', 'blue']

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][0]

    const draw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
    
    const undraw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    const controls = event => {
        console.log(event.keyCode);
        if (timerId) {
            switch (event.keyCode) {
                case 38:
                    rotate()
                    break;
                case 37:
                    moveLeft()
                    break;
                case 39:
                    moveRight()
                    break;
                case 40:
                    moveDown()
                    break;
            }
        }  
    }
    const mbControls = event => {
        console.log(event.target.id);
        switch (event.target.id) {
            case 'mobileUp':
                rotate()
                break;
            case 'mobileLeft':
                moveLeft()
                break;
            case 'mobileRight':
                moveRight()
                break;
            case 'mobileDown':
                moveDown()
                break;
        }
    }
    document.addEventListener('keydown', controls)

    mobileControls.addEventListener('click', mbControls)

    const freeze = () => {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    const moveDown = () => {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }
    const moveLeft = () => {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }
    const moveRight = () => {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }
    const rotate = () => {
        undraw()
        currentRotation ++
        console.log(theTetrominoes[random].length);
        console.log(current.length);
            
        if (currentRotation === current.length) currentRotation = 0
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    timerId = setInterval(moveDown, 400)

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    ]

    const displayShape = () => {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }
    displayShape()

    startBtn.onclick = () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
            startBtn.innerHTML = 'Resume'
            grid.focus()
        }
        else {
            draw()
            timerId = setInterval(moveDown, 400)
            startBtn.innerHTML = 'Pause'
        }
    }

    restartBtn.onclick = () => {
        window.location.reload()
    }

    const addScore = () => {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                squares = Array.prototype.slice.call(squares)
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    const gameOver = () => {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
            document.removeEventListener('keydown', controls, false)
            mobileControls.removeEventListener('click', mbControls, false)
            scrollTo(0, 0)
        }
    }
})