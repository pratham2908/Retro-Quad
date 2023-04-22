import { useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "./DataContext";

const Pong = ({ isActive }) => {
    const { updateGame, changeGame } = useContext(DataContext);
    useEffect(() => {
        if (isActive) {
            const ctx = document.getElementById('canvas').getContext('2d');
            const game = document.getElementById('pong-game');
            const startBtnPong = document.getElementById('start-pong');
            const board = document.getElementById("user-board");
            const computer = document.getElementById("computer-board");
            const score = document.getElementById("user-score");
            const sound = document.getElementById("hit");
            const playAgainBtn = document.querySelector(".play-again-pong");
            const closeBtn = document.querySelector("#pong-game > i")

            let height = ctx.canvas.height = window.innerHeight;
            let width = ctx.canvas.width = window.innerWidth;

            class Ball {
                constructor(x, y, velX, velY, color, size) {
                    this.x = x;
                    this.y = y;
                    this.velX = velX;
                    this.velY = velY;
                    this.color = color;
                    this.size = size;
                }

                draw() {
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    ctx.fill();
                }

                update() {
                    let boardTop = board.getBoundingClientRect().top;
                    let computerTop = computer.getBoundingClientRect().top;

                    if (((this.y + this.size) >= height) || ((this.y - this.size) <= 0)) {
                        this.velY = -(this.velY);
                    }

                    //user
                    if ((this.x - this.size <= board.offsetWidth) && (this.y + this.size >= boardTop) && (this.y - this.size <= boardTop + board.offsetHeight)) {
                        this.velX = -(this.velX);
                        score.innerHTML = parseInt(score.innerHTML) + 1;
                        sound.load();
                        sound.play();
                    }

                    //computer
                    if ((this.x + this.size >= window.innerWidth - computer.offsetWidth) && (this.y + this.size >= computerTop) && (this.y - this.size <= computerTop + computer.offsetHeight)) {
                        this.velX = -(this.velX);
                        sound.load();
                        sound.play();
                    }

                    if ((this.x - this.size) <= 0 || (this.x + this.size >= width)) {
                        this.delete();
                        return;
                    }

                    this.x += this.velX;
                    this.y += this.velY;

                    if (this.x > window.innerWidth / 2 && this.x - this.velX <= window.innerWidth / 2 && this.velX > 0) {
                        updateComputer(this.x, this.y, this.velX, this.velY, this.size);
                    }
                    this.draw();
                }

                delete() {
                    balls.splice(balls.indexOf(this), 1);
                    checkGameOver();
                }
            }

            function updateComputer(x, y, vx, vy, size) {
                let steps = Math.floor((window.innerWidth - computer.offsetWidth - x - size * 2) / vx)
                if (vy > 0) {
                    steps -= Math.floor((window.innerHeight - size - y) / vy)
                } else {
                    steps -= Math.floor((y - size) / Math.abs(vy));
                }

                let cycleSteps = Math.floor((window.innerHeight - 2 * size) / Math.abs(vy))
                let cycleCount = Math.floor(steps / cycleSteps);
                let extraSteps = steps % cycleSteps;
                let finalVy = cycleCount % 2 === 1 ? vy : -(vy);
                let finalY = finalVy > 0 ? (0 + size + finalVy * extraSteps) : (window.innerHeight - size + finalVy * extraSteps);
                let top = finalY;
                top = top > computer.offsetHeight / 2 ? top : computer.offsetHeight / 2;
                top = top > window.innerHeight - computer.offsetHeight / 2 ? window.innerHeight - computer.offsetHeight / 2 : top;
                computer.style.top = top + "px";
                const data = { y, vy, steps, cycleSteps, cycleCount, extraSteps, finalVy, finalY, top }

            }

            let balls = []
            let request = 0;

            function animate() {
                request = requestAnimationFrame(animate);
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.fillRect(0, 0, width, height);

                for (const element of balls) {
                    element.update();
                }
            }

            startBtnPong.addEventListener('click', () => {
                startBtnPong.style.display = "None";
                document.getElementById("boards").style.display = "flex";
                document.getElementById("score").style.display = "flex";
                balls = [];
                balls.push(new Ball(300, 400, 12, 15, 'blue', 20));
                animate();
            }
            )

            window.addEventListener("mousemove", (e) => {
                let y = e.clientY > board.offsetHeight / 2 ? e.clientY : board.offsetHeight / 2;
                y = y > window.innerHeight - board.offsetHeight / 2 ? window.innerHeight - board.offsetHeight / 2 : y;
                board.style.top = y + "px";
            })

            function checkGameOver() {
                if (balls.length === 0) {
                    document.body.style.cursor = "default";
                    updateGame("pong", { score: score.innerHTML, date: new Date().toLocaleString() });
                    cancelAnimationFrame(request);
                    document.getElementById("score").classList.add("game-over");
                    playAgainBtn.classList.add("active");
                    playAgainBtn.addEventListener('click', () => {
                        document.getElementById("score").classList.remove("game-over");
                        playAgainBtn.classList.remove("active");
                        startBtnPong.style.display = "block";
                        document.getElementById("boards").style.display = "none";
                        score.innerHTML = 0;
                    })
                }
            }

            closeBtn.addEventListener('click', () => {
                cancelAnimationFrame(request);
            })



        }
    }, [isActive])



    if (isActive) {
        return (
            <div id="pong-game">
                <div id="start-pong">Start</div>
                <div id="boards">
                    <div className="user">
                        <div id="user-board"></div>

                    </div>
                    <div className="computer">
                        <div id="computer-board"></div>
                    </div>

                </div>
                <div id="score">
                    <h1>Score</h1>
                    <div id="user-score">0</div>
                    <button className="play-again-pong">Play Again</button>
                </div>
                <canvas id="canvas"></canvas>
                <audio id="hit" src="hit.mp3"></audio>
            </div>
        )
    } else {
        return (
            <div id="pong-game">
                <video src="pong.mp4" autoPlay loop muted></video>
            </div>
        )
    }
}

export default Pong;