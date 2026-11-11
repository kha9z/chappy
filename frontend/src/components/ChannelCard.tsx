import { Link } from 'react-router-dom'
import type { Channel } from '@chappy/shared'

type ChannelCardProps = {
    channel: Channel
}

export default function ChannelCard ({ channel }: ChannelCardProps) {
    const id = channel.PK.replace(/^CHANNEL#/, '')

    return (
        <article>
          <Link to={`/channels/${encodeURIComponent(id)}`}>
            <h2>{channel.name}</h2>
            <p>{channel.description}</p>
            <p>{channel.isLocked ? 'Locked' : 'Public'}</p>
          </Link>
        </article>
    )
}