import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
//import "./style.css"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    // licznik rzutów kostką
    const [click, setClick] = React.useState(0) // stan dla kliknięcia
    const [hasClicked, setHasClicked] = React.useState(false) // czy button został kliknięty aby rozpocząć counter
    // timer
    const [startTime, setStartTime] = React.useState(null) // czas rozpoczęcia gry
    const[elapsedTime, setElapsedTime] = React.useState(0) // upływający czas
    const [timerActive, setTimerActive] = React.useState(false) // czy timer jest aktywny
    const [hasClickedTime, sethasClickedTime] = React.useState(false) // czy zostało klikniete koć i button
    // zapisanie najlepszego czasu do lokalnej bazy danych
    const [bestTime, setBestTime] = React.useState(localStorage.getItem('bestTime') || null)
    
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setTimerActive(false)
            const currentTime = Date.now() - startTime;
            if (!bestTime || currentTime < bestTime) {
                setBestTime(currentTime);
                localStorage.setItem('bestTime', currentTime);
            }
        }
    }, [dice, startTime, bestTime])
    
    React.useEffect(() => {
        let timer;
        if (timerActive) {
            timer = setInterval(() => {
                setElapsedTime(Date.now() - startTime)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [timerActive, startTime])
    
    function countClicks() {
        setClick( prevClick => prevClick + 1)
        //console.log(click)
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function timerOn() {
        if (!timerActive) {
                setStartTime(Date.now())
                setTimerActive(true)
        }
    }
    
    function rollDice() {
        if(!tenzies) {
            countClicks()
            setHasClicked(true)
            sethasClickedTime(true)
            timerOn()
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            countClicks()
            setTenzies(false)
            setHasClicked(false)
            setElapsedTime(0)
            setTimerActive(false)
            sethasClickedTime(false)
            setClick(0)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        sethasClickedTime(true)
        timerOn()
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function resetBestTime() {
        localStorage.removeItem('bestTime');
        setBestTime(null);
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice button" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className={`counters_and_time ${!bestTime && !hasClickedTime ? 'centered' : ''}`}>
                <div className="counters">
                    {hasClickedTime && 
                        <p className="timeCounter" >Time: {formatTime(elapsedTime)}</p>}
                    {hasClicked && 
                        <p className="rollCounter">Dice rolls: {click}</p>}
                </div>
                <div className="time_local counter_container">
                    {bestTime && 
                        <p>Best Time: {formatTime(bestTime)}</p>}
                    {bestTime && 
                        <button className="reset_best_time button" onClick={resetBestTime}>Reset Best Time</button>}
                </div>
            </div>
        </main>
    )
}