import { createContext, ReactNode, useContext, useRef, useState } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    next: boolean;
    prev: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    toogleShuffling: () => void;
    playList:(list: Episode[], index: number) => void;
    playNext:() => void;
    toogleLoop:() => void;
    playPrevius:() => void;
    play: (episode: Episode) => void;
    tooglePlay: () => void;
    setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode;
} 

export function PlayerContextProvider({children}: PlayerContextProviderProps){

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLopoping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const next = (currentEpisodeIndex + 1) < episodeList.length
    const prev = currentEpisodeIndex > 0

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index:number){
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function playNext(){         
       if(isShuffling){
        const nextRandonEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandonEpisodeIndex)

       }else if(next){
        setCurrentEpisodeIndex(currentEpisodeIndex +1)
       }
       
    }

    function playPrevius(){   
        if(prev){
            setCurrentEpisodeIndex(currentEpisodeIndex -1)
        }
       
    }

    function toogleLoop(){
        setIsLopoping(!isLooping)
    }
    
    function toogleShuffling(){
        setIsShuffling(!isShuffling)
    }

    function tooglePlay(){
        //!isPlaying ? setIsPlaying(true): setIsPlaying(false) funcao abaixo faz o mesmo
        setIsPlaying(!isPlaying)
    }

    function setPlayingState(state:boolean){
        setIsPlaying(state)
    }

    return (
        <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, next, prev, isLooping, isShuffling, play, playList, toogleLoop, playNext, playPrevius, isPlaying, tooglePlay, setPlayingState, toogleShuffling}}>
            {children}
        </PlayerContext.Provider>
        )
    }


export const usePlayer = () =>{
    return useContext(PlayerContext)
}

