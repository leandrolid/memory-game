import { useCallback, useEffect, useState } from 'react';

import { ICard } from '../../pages/Home';
import styles from './styles.module.scss';

interface CardProps {
  card: ICard;
  // eslint-disable-next-line no-unused-vars
  setCardPair: (param: ICard) => void;
  shouldResetGame: boolean
}

export const Card = ({ card, setCardPair, shouldResetGame }: CardProps) => {
  const [flipClass, setFlipClass] = useState('');
  const [shuffleClass, setShuffleClass] = useState('');
  const [isFrontVisible, setIsFrontVisible] = useState(false);
  const [showFrontTimer, setShowFrontTimer] = useState<number | null>(null);
  const [resetTimer, setResetTimer] = useState<number | null>(null);

  const toggleShowCard = useCallback(() => {
    setFlipClass(styles.flip);

    if (showFrontTimer) setShowFrontTimer(null);
    const newTimer = setTimeout(() => setIsFrontVisible(true), 100);
    setShowFrontTimer(newTimer);
  }, []);
  
  const toggleHideCard = useCallback(() => {
    setFlipClass('');

    if (showFrontTimer) setShowFrontTimer(null);
    const newTimer = setTimeout(() => setIsFrontVisible(false), 100);
    setShowFrontTimer(newTimer);
  }, []);

  useEffect(() => {
    if (!card.selected && !card.match) {
      if (resetTimer) setResetTimer(null);
      const newTimer  = setTimeout(toggleHideCard, 1000);
      setResetTimer(newTimer);
    }
  }, [card.selected, card.match]);

  const onPlayerSelectCard = () => {
    toggleShowCard();
    setCardPair(card);
  };

  useEffect(() => {
    if (shouldResetGame) {
      setShuffleClass(styles.shuffle);
      setTimeout(() => {
        setShuffleClass('');
      }, 1000);
    }
  }, [shouldResetGame]);

  const backDescription = 'Atrás da carta: Mário em 8 bits.';
  const frontDescription = (name: string) => `Frente da carta: ${name}.`;

  return (
    <button
      className={`${styles.card} ${flipClass} ${shuffleClass}`}
      onClick={onPlayerSelectCard}
      data-type={isFrontVisible ? 'front' : 'back'}
      disabled={card.match || card.selected}
    >
      <div
        style={{
          backgroundImage: `url(${isFrontVisible ? card.front : card.back})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: isFrontVisible ? '80%' : '65%',
          width: '100%',
          height: '100%',
        }}
        title={isFrontVisible ? frontDescription(card.name) : backDescription}
      />
    </button>
  );
};