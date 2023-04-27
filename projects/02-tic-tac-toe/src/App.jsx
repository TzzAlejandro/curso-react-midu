import { useState } from 'react'
import confetti from "canvas-confetti"

import { Square } from './components/Square';
import { WinnerModal } from './components/WinnerModal';
import { TURNS } from './constants';
import { checkWinner, checkEndGame } from './logic/board';

import './App.css'


function App() {
  // Los estados condicionales con el hook usestate se pasan como funcionen porque como condicionales da el error de posicion. Puesto que el estado se lee en orden.
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X
  });
  // null: no hay ganador - false: es un empate - true: hay un ganador
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }
  
  const updateBoard = (index) => {
    // Si ya existe algo en la posicion no hacemos nada
    if(board[index] || winner) return;
        // Creamos una copia porque no podemos mutar nunca las props ni el estado, tenemos que tratarlo como inmutables. Por eso se crea una copia y se asigna con el setEstado.
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", newTurn)

    const newWinner = checkWinner(newBoard);
    if(newWinner) {
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)) {
      setWinner(false);
    }
  }

  return (
  <main className='board'>
    <h1>Tic tac toe</h1>
    <button onClick={resetGame}>Reset del juego</button>
    <section className='game'>
      {
        board.map((square, index) => {
          return (
            <Square
            key={index}
            index={index}
            updateBoard={updateBoard}
            >
              {square}
            </Square>
          )
        })
      }
    </section>

    <section className='turn'>
      <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
      <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
    </section>
    <WinnerModal resetGame={resetGame} winner={winner} />
  </main>
  )
}

export default App
