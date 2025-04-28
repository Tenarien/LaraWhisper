import {MicrophoneIcon, StopCircleIcon} from "@heroicons/react/24/solid";
import {useState} from "react";

const AudioRecorder = ({ ready }) => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);

            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }

        setRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (e) => {
                chunks.push(e.data)
            });

            newMediaRecorder.addEventListener("stop", (e) => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus"
                });
                let audioFile = new File([audioBlob], "recorded_audio.gg", {
                    type: "audio/ogg; codecs=opus"
                })

                const url = URL.createObjectURL(audioFile);

                ready(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.error("Error: ", error)
        }
    };
    return (
        <button onClick={onMicrophoneClick} className="ml-2 p-1 text-neutral-400 hover:text-neutral-200">
            {recording && <StopCircleIcon className="w-5 h-5 text-red-600"/>}
            {!recording && <MicrophoneIcon className="w-5 h-5" />}
        </button>
    );
};

export default AudioRecorder;
