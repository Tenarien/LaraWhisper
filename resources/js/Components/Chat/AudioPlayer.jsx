import {useRef, useState} from "react";
import {PauseCircleIcon, PlayCircleIcon} from "@heroicons/react/24/solid";


const AudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolume = (e) => {
        const volume = e.target.value;
        audioRef.current.volume = volume;
        setVolume(volume);
    };

    const handleTime = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const handleSeek = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="flex w-full items-center gap-2 py-2 px-3 rounded-md bg-neutral-800">
            <audio
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTime}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
            />
            <button onClick={togglePlayPause}>
                {isPlaying
                    ? <PauseCircleIcon className="w-5 text-neutral-400"/>
                    : <PlayCircleIcon className="w-5 text-neutral-400"/>
                }
            </button>
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                />
            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
            />
        </div>
    );
};

export default AudioPlayer;
