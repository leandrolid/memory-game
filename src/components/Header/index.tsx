/* eslint-disable jsx-a11y/media-has-caption */
import { useRef, useState } from 'react';

import soundOff from '../../assets/img/sound-off.svg';
import soundOn from '../../assets/img/sound-on.svg';
import marioSong from '../../assets/sounds/mario-8bit-song.mp3';
import { IPlayerInfo } from '../../pages/Home';
import styles from './styles.module.scss';

interface HeaderProps {
  playerInfo: IPlayerInfo;
  onResetGame: () => void;
}
export const Header = ({ playerInfo, onResetGame }: HeaderProps) => {
  const [spinClass, setSpinClass] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const verifyIfAudioStarted = () => {
    setTimeout(() => {
      const time = audioRef.current?.currentTime;
      if (time !== 0) setIsPlaying(true);
      else setIsPlaying(false);
    }, 500);
  };

  const setStartAudio = async () => {
    if (!isPlaying) {
      audioRef.current!.volume = 0.2;
      await audioRef.current?.play();
    }
    else {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
    }

    verifyIfAudioStarted();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span>Jogadas: {playerInfo.turns}</span>
        <span>Vitórias: {playerInfo.wins}</span>
        <div className={styles.controls}>
          <audio
            ref={audioRef}
            src={marioSong}
            loop
          />
          <button type="button" onClick={setStartAudio}>
            {
              isPlaying
              ? <img src={soundOn} alt="Som ligado." />
              : <img src={soundOff} alt="Som desligado." />
            }
          </button>
          <button type="button" className={spinClass} onClick={() => {
            setSpinClass(styles.spin);
            onResetGame();
            setTimeout(() => setSpinClass(''), 500);
          }}>
            <svg strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#fff" strokeWidth="2" d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
