import Sudoku from './Sudoku';
import Snake from './Snake';
import Pacman from './Pacman';
import Pong from './Pong';
import { useContext } from 'react';
import { DataContext } from './DataContext';
import { useEffect } from 'react';


const Games = () => {

    const { currGame, changeGame } = useContext(DataContext);

    useEffect(() => {
        const allGames = document.querySelectorAll('#games > div');
        const gamesParent = document.querySelector('#games');
        allGames.forEach(game => {
            const crossBtn = document.createElement("i");
            crossBtn.classList.add("fas", "fa-times");
            crossBtn.addEventListener('click', () => {
                changeGame(-1);
                game.classList.remove('active');
                game.style.width = "100%";
                game.style.height = "100%";
                gamesParent.nextElementSibling.classList.add("active");
                gamesParent.classList.remove("active");
                console.log(crossBtn);
            })
            game.appendChild(crossBtn);
        })

        allGames.forEach((game, index) => {
            game.addEventListener('click', (e) => {
                if (e.target === game.querySelector("i")) return;
                allGames.forEach(game => {
                    game.classList.remove("active")
                    game.style.zIndex = 0;
                })
                game.style.zIndex = 10000;
                document.querySelector("#user-credentials").classList.remove("active");
                gamesParent.classList.add("active");
                game.style.width = "100vw";
                game.style.height = "100vh";
                game.classList.add('active');
                changeGame(index);

            })
        })

    }, [])

    return (
        <div id="games">
            <Sudoku isActive={currGame == "sudoku"} />
            <Snake isActive={currGame == "snake"} />
            <Pacman isActive={currGame == "pacman"} />
            <Pong isActive={currGame == "pong"} />
        </div>
    )
}


export default Games;