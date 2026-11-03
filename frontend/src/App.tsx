import { useEffect, useState } from 'react'

type Channel = {
  PK: string
  SK: string
  name: string
  description: string
  isLocked: boolean
}

function App() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch('/api/channels')

        if (!response.ok) {
          throw new Error('Could not fetch channels')
        }

        const data: Channel[] = await response.json()
        setChannels(data)
      } catch (error) {
        setError('Failed to load channels')
        console.error(error)
      }
    }
    fetchChannels()
  }, [])

  return (
    <main>
      <h1>Chappy API Test</h1>

      {error && <p>{error}</p>}

      {channels.map((channel) => (
        <div key={channel.PK}>
          <h3>{channel.name}</h3>
          <p>PK (Partition Key): {channel.PK}</p>
          <p>SK (Sort Key): {channel.SK}</p>
          <p>Name: {channel.name}</p>
          <p>Description: {channel.description}</p>
          <p>Access: {channel.isLocked ? 'Locked' : 'Public'}</p>
        </div>
      ))}
    </main>
  )
}
export default App
