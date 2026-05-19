export default function MusicPlayer({ audioRef, playing, onToggle }) {
  return (
    <button
      className={`music-player ${playing ? 'music-playing' : ''}`}
      onClick={onToggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      title={playing ? 'Pause' : 'Play music'}
    >
      <span className="music-bars">
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </span>
      <span className="music-note">♪</span>
    </button>
  )
}
