import { useCallback, useEffect, useState } from 'react';

import cardsOrigin from '../../assets/cards';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { useUpdateEffect } from '../../hooks/useUpdateEffect';
import styles from './styles.module.scss';

export interface ICard {
  id: number;
  name: string;
  front: string;
  back: string;
  match?: boolean;
  selected?: boolean;
}

export interface IPlayerInfo {
  wins: number
  turns: number
}

export function Home() {
  const [cards, setCards] = useState<Array<ICard>>([]);
  const [shouldResetSelectedCards, setShouldResetSelectedCards] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<IPlayerInfo>({wins: 0, turns: 0});
  const [shouldResetGame, setShouldResetGame] = useState(true);

  const sumTurnsNumber = (changedCards: ICard[]) => {
    const selectedCards = changedCards.filter((card) => card.selected);
    if (selectedCards.length === 2) {
      setPlayerInfo((prevInfo) => ({ ...prevInfo, turns: prevInfo.turns + 1 }));
    }
  };
  
  const sumWinsNumber = (changedCards: ICard[]) => {
    const isFinished = changedCards.every((card) => card.match);
    if (isFinished) setPlayerInfo((prevInfo) => ({ ...prevInfo, wins: prevInfo.wins + 1 }));
  };

  const onResetGame = () => {
    setCards((prevCards) => prevCards.map((card) => ({...card, match: false, selected: false })));
    setTimeout(() => {
      setPlayerInfo((prevInfo) => ({ ...prevInfo, turns: 0 }));
      setShouldResetGame(true);
    }, 1500);
  };

  useEffect(() => {
    if (shouldResetGame) {
      const randomOrderCards = cardsOrigin.sort(() => Math.random() - 0.5);
      setCards(randomOrderCards);
      setShouldResetGame(false);
    }
  }, [shouldResetGame]);

  const setCardPair = useCallback((card: ICard) => {
    const newCards = cards.map((prevCard) => {
      if (prevCard.id === card.id) return ({ ...prevCard, selected: true });
      return prevCard;
    });

    sumTurnsNumber(newCards);
    setCards(newCards);
  }, [cards]);

  useEffect(() => sumWinsNumber(cards), [cards]);

  useUpdateEffect(() => {
    const selectedCards = cards.filter((card) => card.selected);

    if (selectedCards.length === 2) {
      const [cardOne, cardTwo] = selectedCards;
      console.log('verificando selecionadas');

      if (cardOne?.name === cardTwo?.name) {
        setCards((prevCads) => {
          const newCards = prevCads.map((card) => {
            if (cardOne.name === card.name) return ({...card, match: true});
            return card;
          });

          return newCards;
        });

        // console.log('deu match');
        setShouldResetSelectedCards(true);
      } else {
        // console.log('não deu match');
        setShouldResetSelectedCards(true);
      }
    }
  }, [cards]);
  
  useEffect(() => {
    if (shouldResetSelectedCards) {
      // console.log('removendo seleção');
      const newCards = cards.map((card) => ({...card, selected: false}));
      setCards(newCards);
      setShouldResetSelectedCards(false);
    }
  }, [shouldResetSelectedCards]);

  return (
    <>
      <Header playerInfo={playerInfo} onResetGame={onResetGame} />
      <main className={styles.cardsContainer}>
        {
          cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              setCardPair={setCardPair}
              shouldResetGame={shouldResetGame}
            />
          ))
        }
      </main>
    </>
  );
}
