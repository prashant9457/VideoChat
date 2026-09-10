import { useEffect, useState } from "react";

export function useMediaStream () {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);

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

    function toggleMicrophone() {
        if(!stream) return;

        const audioTracks = stream.getAudioTracks();

        audioTracks.forEach((track) => {
            track.enabled = !track.enabled;
            setIsMicrophoneEnabled(track.enabled);
        }
    );
    }

    return {stream, toggleMicrophone, isMicrophoneEnabled};
}