import {useEventBus} from "@/EventBus.jsx";
import {useEffect, useState} from "react";
import {generateUUID} from "@/helpers.jsx";

export default function Toast() {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = generateUUID();

            setToasts((prevToasts) => [
                ...prevToasts, {message, uuid}
            ]);

            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((toast) => toast.uuid !== uuid))
            }, 4000)
        });
    }, [on]);
    return(
        <div className="toast">
            {toasts.map((toast, index) => (
                <div key={toast.uuid} className="alert bg-white/5 backdrop-blur-lg min-w-[300px]">
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
