import {useEffect, useRef, useState} from 'react';
import { usePage} from "@inertiajs/react";
import {useEventBus} from "@/EventBus.jsx";
import Toast from "@/Components/Toast.jsx";
import MessageNotification from "@/Components/Chat/MessageNotification.jsx";
import HeaderLayout from "@/Layouts/HeaderLayout.jsx";

export default function AuthLayout({ children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversations;
    const { emit } = useEventBus();
    const [currentConv, setCurrentConv] = useState({});

    const subscribed = useRef(new Set());

    useEffect(() => {
        // helper for MessageSent handling
        const handleMessageSent = (e) => {
            const raw = e.message;
            // normalize IDs to numbers
            const message = {
                ...raw,
                sender_id:   Number(raw.sender_id),
                receiver_id: Number(raw.receiver_id),
                group_id:    raw.group_id != null ? Number(raw.group_id) : null,
            };

            emit("message.created", message);
            if (message.sender_id !== user.id) {
                emit("message.notification", {
                    user: message.sender,
                    group_id: message.group_id,
                    message: message.message || `Shared ${raw.attachments.length} attachments`,
                });
            }
        };

        const handleMessageDeleted = (e) => {
            if (!e) return;

            emit("message.destroy", e);
        };

        // subscribe to any new channels
        conversations.forEach((conversation) => {
            const channel = conversation.is_user
                ? `message.user.${[user.id, conversation.id]
                    .map(Number)
                    .sort((a, b) => a - b)
                    .join("-")}`
                : `message.group.${conversation.id}`;

            if (!subscribed.current.has(channel)) {
                Echo.private(channel)
                    .error(console.error)
                    .listen("MessageSent", handleMessageSent)
                    .listen("MessageDeleted", handleMessageDeleted);
                subscribed.current.add(channel);
            }

            if (conversation.is_group) {
                const groupChannel = `group.deleted.${conversation.id}`;
                if (!subscribed.current.has(groupChannel)) {
                    Echo.private(groupChannel)
                        .error(err => console.error("Channel error:", err))
                        .listen("group.destroy", e => {
                            emit("group.destroy", {e});
                        });
                    subscribed.current.add(groupChannel);
                }
            }
        });

        // cleanup any channels that have been removed
        return () => {
            const current = new Set([
                ...conversations.map(c => c.is_user
                    ? `message.user.${[user.id, c.id].map(Number).sort((a,b)=>a-b).join("-")}`
                    : `message.group.${c.id}`
                ),

                ...conversations
                    .filter(c => c.is_group)
                    .map(c => `group.deleted.${c.id}`)
            ]);

            subscribed.current.forEach(channel => {
                if (!current.has(channel)) {
                    Echo.leave(channel);
                    subscribed.current.delete(channel);
                }
            });
        };
    }, [conversations, emit, user.id]);

    useEffect(() => {
        setCurrentConv(children.props.children.props.selectedConversation)
    }, [children]);

    return (
        <>
            <HeaderLayout user={user}></HeaderLayout>
            <main>{children}</main>
            <Toast/>
            <MessageNotification currentConv={currentConv}/>
        </>
    );
}
