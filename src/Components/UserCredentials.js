import { useContext, useEffect, useRef } from "react";
import { DataContext } from "./DataContext";
import toast, { Toaster } from 'react-hot-toast';

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
        toast.loading("Registering...");
        fetch('https://graceful-vest-ray.cyclic.app/register', {
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
                setUser(data[1]);
                toast.dismiss();
                toast.success("successfully registered", {
                    position: "top-right"
                });
            } else {
                toast.success(data);
                document.querySelector(".register .warning").innerHTML = data;
            }
        })

    }

    function loginUser(e) {
        e.preventDefault();
        const loginData = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        toast.loading("Logging in...");
        fetch("https://graceful-vest-ray.cyclic.app/login", {
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
                toast.dismiss();
                toast.success(`Successfully Logged in as ${data[1].name}`, {
                    position: "top-right"
                })
            } else {
                toast.success(data);
                document.querySelector(".login .warning").innerHTML = data;
            }
        })
    }

    function goToRegister() {
        document.querySelector(".register").classList.add("active")
        document.querySelector(".login").classList.remove("active");
    }

    function goToLogin() {
        document.querySelector(".register").classList.remove("active");
        document.querySelector(".login").classList.add("active");
    }

    function logOut() {
        setUser();
        localStorage.removeItem("loginData");
    }

    useEffect(() => {
        const resize = document.getElementById("resize-credentials");
        resize.addEventListener("click", () => {
            resize.parentElement.classList.toggle("active");
            document.getElementById("games").classList.toggle("active");
        })


        const localUser = JSON.parse(localStorage.getItem("loginData"));
        if (localUser) {
            fetch("https://graceful-vest-ray.cyclic.app/fetch", {
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
            const headers = document.querySelectorAll("#user-credentials .game-header");
            headers.forEach(header => {
                header.addEventListener("click", () => {
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

    function returnData(gameName) {
        return (
            <>
                <div className="game-header">{gameName}
                    <i className="fa-solid fa-caret-down"></i><i className="fa-solid fa-caret-up"></i>
                </div>
                <div className="game-data">
                    {user.games[gameName].length > 0 ? user.games[gameName].map((game, index) => {
                        return (
                            <div key={index}>
                                <div>{game.score}</div>
                                <div>{game.date}</div>
                                <div>{game.time}</div>
                            </div>
                        )
                    }) : <h1 className="no-data">No data found</h1>}
                </div>
            </>
        )
    }

    return (
        <div id="user-credentials" className="active">
            {!user ? (
                <>
                    <div className="register ">
                        <h1>Register User</h1>
                        <form onSubmit={registerUser}>
                            <input type="text" placeholder="Name" />
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <button>Register</button>
                            <div className="warning"></div>
                        </form>
                        <p>Already have an account? <span onClick={goToLogin}>Login</span></p>
                    </div>
                    <div className="login active" >
                        <h1>Login User</h1>
                        <form onSubmit={loginUser}>
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <button >Login</button>
                            <div className="warning"></div>
                        </form>
                        <p>Don't have an account? <span onClick={goToRegister}>Register</span></p>
                    </div>
                </>) : (
                <>
                    <h1> Hello {user.name}</h1>
                    <div className="games-history">
                        {returnData("snake")}
                        {returnData("sudoku")}
                        {returnData("pacman")}
                        {returnData("pong")}
                    </div>
                    <div id="log-out" onClick={logOut}>Log Out</div>
                </>)}
            <div id="resize-credentials">
                <span><i className="fa-solid fa-caret-left fa-beat-fade" ></i><i className="fa-solid fa-caret-right fa-beat-fade" ></i></span>
            </div>
            <Toaster toastOptions={{ position: "top-right", style: { fontSize: "1.2rem", fontFamily: "sans-serif", textDecoration: "capitalize", } }} />
        </div>
    )


}

export default UserCredentials;