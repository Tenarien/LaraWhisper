import {useEffect, useRef, useState} from 'react'
import { Link } from '@inertiajs/react'
import UserAvatar from '@/Components/Chat/UserAvatar.jsx'
import {useEventBus} from "@/EventBus.jsx";
import {generateUUID} from "@/helpers.jsx";

export default function MessageNotification({ currentConv }) {
    const [toasts, setToasts] = useState([])
    const { on } = useEventBus()
    const convRef = useRef({});

    useEffect(() => {
        convRef.current = currentConv;
    }, [currentConv]);

    useEffect(() => {
        on('message.notification', ({ message, user, group_id }) => {
            const uuid = generateUUID()
            const conv = convRef.current;

            if (conv?.id === user.id) return;

            setToasts(ts => [...ts, { message, uuid, user, group_id }]);

        })
    }, [on])

    const removeToast = (uuid) =>
        setToasts((ts) => ts.filter((t) => t.uuid !== uuid))

    return (
        <div className="toast toast-top toast-center space-y-2 mx-auto">
            {toasts.map((t) => (
                <Toast
                    key={t.uuid}
                    toast={t}
                    onDone={() => removeToast(t.uuid)}
                />
            ))}
        </div>
    )
}

function Toast({ toast, onDone }) {
    const [visible, setVisible] = useState(false)
    const [progressWidth, setProgressWidth] = useState('100%')

    useEffect(() => {
        setVisible(true)

        const kick = setTimeout(() => {
            setProgressWidth('0%')
        }, 20)

        const hide = setTimeout(() => setVisible(false), 4000)
        const rem  = setTimeout(onDone, 4400)

        return () => {
            clearTimeout(kick)
            clearTimeout(hide)
            clearTimeout(rem)
        }
    }, [])

    return (
            <Link href={toast.group_id ? route('chat.group', toast.group_id) : route('chat.user',  toast.user.id)}
            >
                <div
                    className={[
                        "relative alert alert-top alert-left bg-white/5 backdrop-blur-lg",
                        "min-w-[300px] max-w-[300px]",
                        "transform transition-all ease-out duration-100",
                        "flex items-center gap-2 overflow-hidden",
                        visible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                    ].join(" ")}
                >
                    <UserAvatar user={toast.user} />
                    <span className="flex-1 truncate min-w-0">
      {toast.message}
    </span>
                    <div
                        className="absolute bottom-0 left-0 h-[2px] bg-neutral-100"
                        style={{
                            width: progressWidth,
                            transition: 'width 4000ms linear'
                        }}
                    />
                </div>
            </Link>
    )
}
