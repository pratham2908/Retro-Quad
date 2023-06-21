import { useState, useEffect, createContext } from "react";
import toast, { Toaster } from 'react-hot-toast';
export const DataContext = createContext();



const DataContextProvider = (props) => {
    const [currGame, setCurrGame] = useState('');
    const [user, setUser] = useState();
    const games = ['sudoku', 'snake', 'pacman', 'pong'];


    function changeGame(index) {
        if (index === -1) {
            setCurrGame('');
            return;
        }
        setCurrGame(games[index]);
    }

    function updateGame(game, newEntry) {
        if (user == undefined) {
            toast.loading("Saving Score.. ")
            document.querySelector(".loading-screen").classList.add("active");

            setTimeout(() => {
                toast.dismiss();
                toast.error("Please login to save your score");
                document.querySelector(".loading-screen").classList.remove("active");
            }, 1000);
            return;
        }
        newEntry.date = new Date().toLocaleDateString();
        newEntry.time = new Date().toLocaleTimeString();
        newEntry.time = newEntry.time.slice(0, newEntry.time.length - 6) + newEntry.time.slice(newEntry.time.length - 3, newEntry.time.length);
        newEntry.date = newEntry.date.slice(0, newEntry.date.length - 4) + newEntry.date.slice(newEntry.date.length - 2, newEntry.date.length);
        user.games[game].unshift(newEntry);
        setUser({ ...user });
        document.querySelector(".loading-screen").classList.add("active");
        toast.loading("Saving Score.. ")
        fetch("https://graceful-vest-ray.cyclic.app/update", {
            method: "POST",
            body: JSON.stringify({ data: user, type: "update" }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }
        ).then(data => {
            toast.dismiss();
            toast.success("Score Saved!", {
                style: { fontSize: "1.5rem", padding: "10px" }
            })
            document.querySelector(".loading-screen").classList.remove("active");

        })
    }

    return (
        <DataContext.Provider value={{ currGame, setCurrGame, changeGame, user, setUser, updateGame }}>

            {props.children}
            <Toaster toastOptions={{ position: "top-right", style: { fontSize: "1.2rem", fontFamily: "sans-serif", textDecoration: "capitalize", } }} />
        </DataContext.Provider>
    )
}

export default DataContextProvider;