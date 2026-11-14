import type { Channel } from '@chappy/shared'
import ChannelCard from './ChannelCard'

type ChannelListProps = {
    channels: Channel[]
}

export default function ChannelList({ channels }: ChannelListProps) {
    return ( 
        <section>
            {channels.map((channel) => (
                <ChannelCard key={channel.PK} channel={channel} />
            ))}
        </section>
    )
}