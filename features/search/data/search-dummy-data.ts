export type SearchAnime = {
    id: string
    title: string
    genres: string[]
    rating: number
    episodeCount: number
    cover: string
    year: number
}

export const GENRES = [
    'All',
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Isekai',
    'Mecha',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
]

export const SEARCH_RESULTS: SearchAnime[] = [
    { id: '1', title: 'Demon Slayer: Infinity Castle', genres: ['Action', 'Fantasy', 'Supernatural'], rating: 9.2, episodeCount: 12, year: 2025, cover: 'https://picsum.photos/seed/demonslayer300/300/420' },
    { id: '2', title: 'Frieren: Beyond Journey\'s End', genres: ['Adventure', 'Fantasy', 'Drama'], rating: 9.0, episodeCount: 28, year: 2023, cover: 'https://picsum.photos/seed/frieren300/300/420' },
    { id: '3', title: 'Solo Leveling Season 2', genres: ['Action', 'Fantasy', 'Isekai'], rating: 8.8, episodeCount: 13, year: 2025, cover: 'https://picsum.photos/seed/sololevel300/300/420' },
    { id: '4', title: 'Chainsaw Man', genres: ['Action', 'Supernatural', 'Horror'], rating: 8.9, episodeCount: 12, year: 2022, cover: 'https://picsum.photos/seed/chainsawman300/300/420' },
    { id: '5', title: 'Blue Lock', genres: ['Sports', 'Action'], rating: 8.7, episodeCount: 24, year: 2022, cover: 'https://picsum.photos/seed/bluelock300/300/420' },
    { id: '6', title: 'Spy × Family', genres: ['Comedy', 'Action', 'Slice of Life'], rating: 8.5, episodeCount: 25, year: 2022, cover: 'https://picsum.photos/seed/spyfamily300/300/420' },
    { id: '7', title: 'Dungeon Meshi', genres: ['Adventure', 'Fantasy', 'Comedy'], rating: 8.6, episodeCount: 24, year: 2024, cover: 'https://picsum.photos/seed/dungeon300/300/420' },
    { id: '8', title: 'Kaiju No. 8', genres: ['Action', 'Sci-Fi', 'Supernatural'], rating: 8.4, episodeCount: 12, year: 2024, cover: 'https://picsum.photos/seed/kaijuno8/300/420' },
    { id: '9', title: 'Wind Breaker', genres: ['Action', 'Sports'], rating: 8.3, episodeCount: 13, year: 2024, cover: 'https://picsum.photos/seed/windbreaker300/300/420' },
    { id: '10', title: 'My Hero Academia Season 7', genres: ['Action', 'Fantasy', 'Supernatural'], rating: 8.1, episodeCount: 21, year: 2024, cover: 'https://picsum.photos/seed/mhasea7/300/420' },
    { id: '11', title: 'Attack on Titan: The Final Season', genres: ['Action', 'Drama', 'Thriller'], rating: 9.1, episodeCount: 16, year: 2023, cover: 'https://picsum.photos/seed/aotfinal/300/420' },
    { id: '12', title: 'Jujutsu Kaisen Season 2', genres: ['Action', 'Fantasy', 'Supernatural'], rating: 9.0, episodeCount: 23, year: 2023, cover: 'https://picsum.photos/seed/jjkseason2/300/420' },
    { id: '13', title: 'Re:Zero Season 3', genres: ['Fantasy', 'Drama', 'Isekai'], rating: 8.8, episodeCount: 13, year: 2024, cover: 'https://picsum.photos/seed/rezero3/300/420' },
    { id: '14', title: 'One Piece', genres: ['Action', 'Adventure', 'Comedy'], rating: 8.9, episodeCount: 1100, year: 1999, cover: 'https://picsum.photos/seed/onepiece300/300/420' },
    { id: '15', title: 'Overlord Season 4', genres: ['Fantasy', 'Action', 'Isekai'], rating: 8.0, episodeCount: 13, year: 2022, cover: 'https://picsum.photos/seed/overlord4/300/420' },
    { id: '16', title: 'Mushoku Tensei Season 2', genres: ['Fantasy', 'Adventure', 'Isekai'], rating: 8.7, episodeCount: 25, year: 2023, cover: 'https://picsum.photos/seed/mushokutensei2/300/420' },
]
