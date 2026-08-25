import { useEffect, useState } from "react";

export function useMediaStream () {
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(()=> {

        let mediaStream: MediaStream;
        async function getMedia() {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                setStream(mediaStream);
    
            } catch (error) {
                console.error("failed to access camera/microphone ", error);
            }
        }
        getMedia();

        return () => {
            mediaStream?.getTracks().forEach((track)=> {
                track.stop();
            });
        };
    }, []);

    return stream;
}