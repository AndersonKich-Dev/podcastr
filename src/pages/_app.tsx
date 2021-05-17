import { Header } from '../components/Header'
import '../styles/global.scss'
import style from '../styles/app.module.scss'
import { Player } from '../components/Player'
import { PlayerContextProvider } from '../contexts/PlayerContext'

function MyApp({ Component, pageProps }) {

  return(
    <PlayerContextProvider>
      <div className={style.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>  
    </PlayerContextProvider>
  )
}

export default MyApp
