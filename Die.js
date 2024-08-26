import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

const getDotClassNames = (value) => {
    const positions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    //console.log(`Value: ${value}, Positions: ${positions[value]}`);

    return Array.from({ length: 9 }, (_, idx) => (
        <span key={idx} className={`dot ${positions[value].includes(idx) ? "active" : ""}`}></span>
    ));
};

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <div className="dots-container">
                {getDotClassNames(props.value)}
            </div>
        </div>
    )
}



/*
import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    const dotElements = []
    for (let i = 0; i < props.value; i++) {
        dotElements.push(<span key={i} className="dot"></span>)
    }
    
    return (
        <div 
            className="die-face " 
            style={styles}
            onClick={props.holdDice}
        >
            <div className="dots-container">
                {dotElements}
            </div>
        </div>
    )
}
    */