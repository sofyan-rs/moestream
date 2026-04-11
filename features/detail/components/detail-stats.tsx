import StarIcon from '@/components/icons/star'
import { appTheme } from '@/constants/app-theme'
import { Card, Separator } from 'heroui-native'
import React from 'react'
import { Text, View } from 'react-native'
import { Calendar, ClockCircle, Home2, Playlist, Tv } from 'react-native-solar-icons/icons/bold'
import { useUniwind } from 'uniwind'
import { type AnimeDetail } from '../data/detail-dummy-data'

type StatItemProps = {
    icon: React.ReactNode
    label: string
    value: string
}

function StatItem({ icon, label, value }: StatItemProps) {
    return (
        <View className="items-center flex-1">
            <View className="mb-1">{icon}</View>
            <Text className="text-accent text-sm font-bold">{value}</Text>
            <Text className="text-foreground font-normal text-xs mt-0.5">{label}</Text>
        </View>
    )
}

type Props = {
    anime: AnimeDetail
}

export function DetailStats({ anime }: Props) {
    const { theme } = useUniwind();
    const isDark = theme === 'dark';
    const muted = isDark ? appTheme.colors.dark.textMuted : appTheme.colors.light.textMuted;

    return (
        <View className='px-5 mb-5'>
            <Card>
                <Card.Body>
                    <View className="flex-row items-center">

                        <StatItem
                            icon={<Tv size={16} color={muted} />}
                            label="Type"
                            value={anime.type}
                        />
                        <Separator orientation="vertical" />
                        <StatItem
                            icon={<ClockCircle size={16} color={muted} />}
                            label="Status"
                            value={anime.status}
                        />
                        <Separator orientation="vertical" />
                        <StatItem
                            icon={<StarIcon size={16} color={muted} />}
                            label="Score"
                            value={String(anime.score)}
                        />
                    </View>
                    <View
                        style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.15)', marginVertical: 12 }}
                    />
                    <View className="flex-row items-center">
                        <StatItem
                            icon={<Playlist size={16} color={muted} />}
                            label="Total Eps"
                            value={String(anime.totalEps)}
                        />
                        <Separator orientation="vertical" />
                        <StatItem
                            icon={<Calendar size={16} color={muted} />}
                            label="Released"
                            value={anime.releaseDate}
                        />
                        <Separator orientation="vertical" />
                        <StatItem
                            icon={<Home2 size={16} color={muted} />}
                            label="Studio"
                            value={anime.studio}
                        />
                    </View>
                </Card.Body>
            </Card>
        </View>

    )
}
