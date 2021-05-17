import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../Utils/convertDurationToTimeString'

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
 

    const { episodeList, currentEpisodeIndex, isPlaying, next, prev, isLooping, isShuffling, toogleShuffling, toogleLoop, tooglePlay, playNext, playPrevius, setPlayingState } = usePlayer()

    const episode = episodeList[currentEpisodeIndex]
    const [progress, setProgress] = useState(0)

    function setupProgressListener(){
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', ()=>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount:number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    useEffect(()=>{
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    },[isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src='/playing.svg' alt='Tocando agora'/>
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit='cover'/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                <strong>Selecione um poscast para ouvir</strong>
            </div>
            )}
            

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                   { episode ? (
                       <Slider
                        max={episode.duration}
                        value={progress}
                        onChange={handleSeek}
                        trackStyle={{backgroundColor: '#04d361'}}
                        railStyle={{backgroundColor: '#9f75ff'}}
                        handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                       />
                   ) : (
                        <div className={styles.slider}>
                            <div className={styles.emptySlider}/>
                        </div>
                   )}
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onPlay={()=> setPlayingState(true)}
                        onPause={()=> setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />

                )}

                <div className={styles.buttons}>
                    <button type='button' disabled={!episode || episodeList.length === 1} onClick={toogleShuffling} className={isShuffling ? styles.isActive : ''}>
                        <img src='/shuffle.svg' alt='Embaralhar'/>
                    </button>

                    <button  type='button' disabled={!episode || !prev} onClick={playPrevius}>
                        <img src='/play-previous.svg' alt='Tocar anterior'/>
                    </button>

                    <button className={styles.playButton} onClick={tooglePlay} type='button' disabled={!episode}>
                        { isPlaying ? <img src='/pause.svg' alt='Tocar episódio'/>
                        : <img src='/play.svg' alt='Tocar episódio'/>}
                    </button>

                    <button  type='button' disabled={!episode || !next} onClick={playNext}>
                        <img src='/play-next.svg' alt='Tocar proxima'/>
                    </button>

                    <button  type='button' disabled={!episode} onClick={toogleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src='/repeat.svg' alt='Repetir'/>
                    </button>
                </div>
            </footer>
        </div>
    )
}