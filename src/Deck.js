import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [draw, setDraw] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const [remaining, setRemaining] = useState(54);
    const [url, setUrl] = useState(`https://deckofcardsapi.com/api/deck`);

    const timer = useRef();

    useEffect(() => {
        async function loadDeck() {
            try {
                const res = await axios.get(`${url}/new/shuffle/?deck_count=1`);
                setDeck(res.data.deck_id);
                setRemaining((remaining) => remaining - 1);
            } catch (err) {
                alert(err)
            }
        }

        async function drawCard() {
            try {
                const res = await axios.get(
                    `${url}/${deck}/draw/?count=1`
                );
                setRemaining((remaining) => remaining - 1);
                setDraw((cards) => [...cards, res.data.cards[0]]);
            } catch (err) {
                console.log(err);
            }
        }

        if (remaining === 54) {
            loadDeck();
        }
        if (autoDraw && remaining) {
            timer.current = setInterval(() => {
                drawCard();
            }, 1000)
        }
        return () => {
            clearInterval(timer.current);
        }
    }, [autoDraw, remaining, draw, deck])

    const stopTimer = () => {
        clearInterval(timer.current);
        setAutoDraw((stop) => !stop);
    };

    const startTimer = () => {
        setAutoDraw((stop) => !stop);
    };

    const resetDeck = () => {
        setDraw([]);
        setRemaining(54);
    };

    return (
        <div className="Deck">
        {remaining !== 0 && (
          <button className="Deck-gimme"
            id="button"
            onClick={autoDraw ? startTimer : stopTimer}
            className="DeckCards-button"
          >
            {autoDraw ? "Stop" : "Gimme Cards"}
          </button>
        )}
  
        <button onClick={resetDeck}>
          Reset Deck
        </button>
  
        <div className="Deck-cardarea">
          {draw.map((card) => (
            <Card key={card.code} id={card.code} image={card.image} />
          ))}
        </div>
      </div>
    )
}

export default Deck;