import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import ConversationItem from "@/Components/Chat/ConversationItem.jsx";
import { PencilSquareIcon } from '@heroicons/react/24/solid';

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    }

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers((prevOnlineUsers) => ({
                    ...prevOnlineUsers, ...onlineUsersObj
                }));
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => ({
                    ...prevOnlineUsers,
                    [user.id]: user
                }));
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updated = { ...prevOnlineUsers };
                    delete updated[user.id];
                    return updated;
                });
            }).error((error) => {
            console.error('error', error);
        });

        return () => {
            Echo.leave('online');
        }
    }, []);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    return (
        <>
            <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden">
                <div
                    className={`
                      transition-transform duration-300
                      h-full bg-neutral-800 text-neutral-100
                      sm:w-[300px] md:w-[400px] lg:w-[500px]
                      flex flex-col overflow-hidden
                      ${selectedConversation
                          ? '-translate-x-full sm:translate-x-0 w-0'
                          : 'translate-x-0'}
                    `}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                        My conversations
                        <div className="tooltip tooltip-left" data-tip="Create new Group">
                            <button className="text-neutral-400 hover:text-neutral-200">
                                <PencilSquareIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>

                    <div className="p-3">
                        <input
                            onKeyUp={onSearch}
                            placeholder="Filter users by group"
                            className="w-full px-3 py-2 text-sm rounded-lg text-neutral-100 border border-neutral-300 focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
                        />
                    </div>

                    <div className="flex-1 overflow-auto min-h-0">
                        {sortedConversations?.map((conversation) => (
                            <ConversationItem
                                key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className={`
                          flex flex-1 flex-col justify-end h-full min-h-0
                          text-neutral-100 transition-transform duration-300 transform
                          sm:w-max md:w-max lg:w-max
                          overflow-hidden
                          ${selectedConversation
                            ? 'translate-x-0'
                            : 'translate-x-full sm:translate-x-0 w-0'}
                    `}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default ChatLayout;
