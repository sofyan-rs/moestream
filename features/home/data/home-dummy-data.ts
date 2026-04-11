export type FeaturedAnime = {
    id: string
    title: string
    genres: string[]
    rating: number
    episodeCount: number
    cover: string
}

export type ContinueWatchingItem = {
    id: string
    title: string
    episode: string
    progress: number
    cover: string
}

export type TrendingAnime = {
    id: string
    title: string
    rating: number
    cover: string
}

export type NewEpisodeAnime = {
    id: string
    title: string
    episode: string
    timeAgo: string
    cover: string
}

export const FEATURED: FeaturedAnime[] = [
    {
        id: '1',
        title: 'Demon Slayer: Infinity Castle',
        genres: ['Action', 'Fantasy', 'Supernatural'],
        rating: 9.2,
        episodeCount: 12,
        cover: 'https://picsum.photos/seed/demonslayer800/800/450',
    },
    {
        id: '2',
        title: 'Frieren: Beyond Journey\'s End',
        genres: ['Adventure', 'Fantasy', 'Drama'],
        rating: 9.0,
        episodeCount: 28,
        cover: 'https://picsum.photos/seed/frieren800/800/450',
    },
    {
        id: '3',
        title: 'Solo Leveling Season 2',
        genres: ['Action', 'Fantasy', 'Isekai'],
        rating: 8.8,
        episodeCount: 13,
        cover: 'https://picsum.photos/seed/sololevel800/800/450',
    },
]

export const CONTINUE_WATCHING: ContinueWatchingItem[] = [
    { id: '1', title: 'Attack on Titan', episode: 'EP 22', progress: 0.65, cover: 'https://picsum.photos/seed/aot22/640/360' },
    { id: '2', title: 'One Piece', episode: 'EP 1105', progress: 0.3, cover: 'https://picsum.photos/seed/onepiece1105/640/360' },
    { id: '3', title: 'Jujutsu Kaisen', episode: 'EP 15', progress: 0.82, cover: 'https://picsum.photos/seed/jjk15ep/640/360' },
    { id: '4', title: 'Naruto Shippuden', episode: 'EP 300', progress: 0.5, cover: 'https://picsum.photos/seed/naruto300ep/640/360' },
]

export const TRENDING: TrendingAnime[] = [
    { id: '1', title: 'Chainsaw Man', rating: 8.9, cover: 'https://picsum.photos/seed/chainsawman/300/420' },
    { id: '2', title: 'Blue Lock', rating: 8.7, cover: 'https://picsum.photos/seed/bluelock/300/420' },
    { id: '3', title: 'Spy × Family', rating: 8.5, cover: 'https://picsum.photos/seed/spyfamily/300/420' },
    { id: '4', title: 'Frieren', rating: 9.0, cover: 'https://picsum.photos/seed/frieren99/300/420' },
    { id: '5', title: 'Wind Breaker', rating: 8.3, cover: 'https://picsum.photos/seed/windbreaker/300/420' },
]

export const NEW_EPISODES: NewEpisodeAnime[] = [
    { id: '1', title: 'Dungeon Meshi', episode: 'EP 24', timeAgo: '2h ago', cover: 'https://picsum.photos/seed/dungeon24/300/420' },
    { id: '2', title: 'My Hero Academia', episode: 'EP 8', timeAgo: '4h ago', cover: 'https://picsum.photos/seed/mhaep8/300/420' },
    { id: '3', title: 'Solo Leveling', episode: 'EP 12', timeAgo: '1d ago', cover: 'https://picsum.photos/seed/sololevel12/300/420' },
    { id: '4', title: 'Kaiju No. 8', episode: 'EP 6', timeAgo: '2d ago', cover: 'https://picsum.photos/seed/kaijuno8ep/300/420' },
]
