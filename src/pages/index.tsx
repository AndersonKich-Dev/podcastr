import { GetStaticProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import { api } from '../Services/api'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../Utils/convertDurationToTimeString'

import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'

type Episodes = {
  id: string,
  title: string,
  members: string
  thumbnail: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string
} 

type HomeProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}
 

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {

const { playList } = usePlayer()

const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
            {latestEpisodes.map((episode, index) => {
              return(
                <li key={episode.id}>
                  <img 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    />

                  <div className={styles.episodeDetails}>
                   <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                   </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type='button' onClick={() => playList(episodeList, index)}>  
                    <img src='/play-green.svg' alt='Tocar episodio'/>
                  </button>
                </li>
              )
            })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) =>{
                return(
                  <tr>
                    <td>
                      <Image width={120} height={120} objectFit='cover' src={episode.thumbnail}/>                     
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                    </Link>
                    </td>
                    <td>
                      {episode.members}
                    </td>
                    <td style={{width: 100}}>
                      {episode.publishedAt}
                    </td>
                    <td>
                      {episode.durationAsString}
                    </td>
                    <td>
                      <button type='button' onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                        <img src='/play-green.svg' alt='Tocar episódio'/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
   
}

//Com typescript

export const getStaticProps: GetStaticProps = async () => {
  const { data }  = await api.get('episodes',{
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBr }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return{
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}



// Antes de usar o typescript
/*
export async function getStaticProps() {
  const response  = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return{
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8,
  }
}
*/