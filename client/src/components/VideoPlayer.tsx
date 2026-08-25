
interface VideoPlayerProps {
    stream: MediaStream | null;
    muted ?: boolean;
}

export default function VideoPlayer({stream, muted = false} : VideoPlayerProps) {
    return (
        <video
            ref={(video) => {
                if(video && stream) {
                    video.srcObject = stream;
                }
            }}
            autoPlay
            playsInline
            muted={muted}
        />
    )
}