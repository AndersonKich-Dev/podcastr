import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../Services/api';
import Link from 'next/link'
import Head from 'next/head'
import { format, parseISO } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import styles from './episode.module.scss'
import Image from 'next/image'
import { convertDurationToTimeString } from '../../Utils/convertDurationToTimeString';
import { usePlayer } from '../../contexts/PlayerContext'
type Episode = {
    id: string,
    title: string,
    members: string
    thumbnail: string,
    publishedAt: string,
    duration: number,
    durationAsString: string,
    description: string,
    url: string
  } 

type EpisodProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodProps) {

    const { play } = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type='button'>
                        <img src='/arrow-left.svg' alt='Voltar' />
                    </button>
                </Link>
                <Image width={700} height={160} objectFit='cover' src={episode.thumbnail} />
                <button type='button' onClick={() => play(episode)}>
                    <img  src='/play.svg' alt='Tocar episódio'/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html:episode.description}}/>
                
       
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async ()=>{
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps= async (ctx) =>{
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBr }),
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      description: data.description,
      url: data.file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,
    }
}