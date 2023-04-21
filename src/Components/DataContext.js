import { useState, useEffect, createContext } from "react";
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
        user.games[game].unshift(newEntry);
        setUser({ ...user });
        fetch("http://localhost:3001/update", {
            method: "POST",
            body: JSON.stringify({ data: user, type: "update" }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }
        ).then(data => {
            console.log(data);
        })
    }

    return (
        <DataContext.Provider value={{ currGame, setCurrGame, changeGame, user, setUser, updateGame }}>
            {props.children}
        </DataContext.Provider>
    )
}

export default DataContextProvider;