import { useContext, useEffect, useRef } from "react";
import { DataContext } from "./DataContext";

const UserCredentials = () => {
    const { user, setUser, updateGame } = useContext(DataContext);
    let applied = useRef(false);

    function registerUser(e) {
        e.preventDefault();
        const registerData = {
            name: e.target[0].value,
            email: e.target[1].value,
            password: e.target[2].value
        }
        fetch('http://localhost:3001/register', {
            method: "POST",
            body: JSON.stringify({ data: registerData, type: "register" }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data[0] == "successful") {
                localStorage.setItem("loginData", JSON.stringify({ email: registerData.email }))
                setUser(data[1])
                console.log(data);
                console.log(data[1].games)
            } else {
                alert(data[0]);
            }
        })

    }

    function loginUser(e) {
        e.preventDefault();
        const loginData = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        fetch("http://localhost:3001/login", {
            method: "POST",
            body: JSON.stringify({ data: loginData, type: "login" }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data[0] === "successful") {
                localStorage.setItem("loginData", JSON.stringify({ email: loginData.email }))
                setUser(data[1]);
            }
        })
    }

    function goToRegister() {
        document.querySelector(".register").style.display = "flex";
        document.querySelector(".login").style.display = "none";
    }

    function goToLogin() {
        document.querySelector(".register").style.display = "none";
        document.querySelector(".login").style.display = "flex";
    }

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("loginData"));
        if (localUser) {
            fetch("http://localhost:3001/fetch", {
                method: "POST",
                body: JSON.stringify({ data: localUser, type: "fetch" }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                return res.json()
            }).then(data => {
                setUser(data);
            })


        }
    }, [])

    useEffect(() => {
        if (user && !applied.current) {
            const resize = document.getElementById("resize-credentials");
            resize.addEventListener("click", () => {
                resize.parentElement.classList.toggle("active");
                document.getElementById("games").classList.toggle("active");
                console.log("changed");
            })

            const headers = document.querySelectorAll("#user-credentials .game-header");
            headers.forEach(header => {
                header.addEventListener("click", () => {
                    console.log("clicked");
                    header.classList.toggle("active");
                    if (header.classList.contains("active")) {
                        header.nextElementSibling.style.height = header.nextElementSibling.scrollHeight + "px";
                    } else {
                        header.nextElementSibling.style.height = "0px";
                    }
                })
            })

            applied.current = true;
        }
    }, [user])


    if (!user) {
        return (
            <div id="user-credentials" className="active">
                <div className="register">
                    <h1>Register User</h1>
                    <form onSubmit={registerUser}>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button>Register</button>
                        <p>Already have an account? <span onClick={goToLogin}>Login</span></p>
                    </form>
                </div>
                <div className="login" style={{ display: "none" }}>
                    <h1>Login User</h1>
                    <form onSubmit={loginUser}>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button >Login</button>
                        <p>Don't have an account? <span onClick={goToRegister}>Register</span></p>
                    </form>
                </div>
                <div id="resize-credentials">
                    <span><i className="fa-solid fa-caret-left fa-beat-fade" style={{ "color": "#1575d5" }}></i><i className="fa-solid fa-caret-right fa-beat-fade" style={{ "color": "#1575d5" }}></i></span>
                </div>
            </div>)
    } else {
        return (
            <div id="user-credentials" style={{ display: "flex", flexDirection: "column" }} className="active">
                <h1> Hello {user.name}</h1>
                <div className="games-history">
                    <div className="game-header">Snake
                        <i className="fa-solid fa-caret-down"></i><i className="fa-solid fa-caret-up"></i>
                    </div>
                    <div className="game-data">
                        {user.games.snake.map((game, index) => {
                            return (
                                <div key={index}>
                                    <div>{game.score}</div>
                                    <div>{game.date}</div>
                                    <div>{game.time}</div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="game-header">Sudoku
                        <i className="fa-solid fa-caret-down"></i><i className="fa-solid fa-caret-up"></i>
                    </div>
                    <div className="game-data">
                        {user.games.sudoku.map((game, index) => {
                            return (
                                <div key={index}>
                                    <div>{game.score}</div>
                                    <div>{game.date}</div>

                                    <div>{game.time}</div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="game-header">Pacman
                        <i className="fa-solid fa-caret-down"></i><i className="fa-solid fa-caret-up"></i>
                    </div>
                    <div className="game-data">
                        {user.games.pacman.map((game, index) => {
                            return (
                                <div key={index}>
                                    <div>{game.score}</div>
                                    <div>{game.date}</div>

                                    <div>{game.time}</div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="game-header">Pong
                        <i className="fa-solid fa-caret-down"></i><i className="fa-solid fa-caret-up"></i>
                    </div>
                    <div className="game-data">
                        {user.games.pong.map((game, index) => {
                            return (
                                <div key={index}>
                                    <div>{game.score}</div>
                                    <div>{game.date}</div>

                                    <div>{game.time}</div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>

                <div id="resize-credentials">
                    <span><i className="fa-solid fa-caret-left fa-beat-fade" ></i><i className="fa-solid fa-caret-right fa-beat-fade" ></i></span>
                </div>
            </div>
        )
    }
}

export default UserCredentials;