import './Styles/App.css';
import "./Styles/Sudoku.css"
import "./Styles/Snake.css"
import "./Styles/Pong.css"
import "./Styles/Pacman.css"
import DataContextProvider from './Components/DataContext';
import Games from './Components/Games';
import UserCredentials from './Components/UserCredentials';

function App() {

  return (
    <DataContextProvider>
      <div className="App">
        <Games />
        <UserCredentials />
      </div>
    </DataContextProvider>
  );
}

export default App;
