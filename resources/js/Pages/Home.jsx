import {useCallback, useEffect, useRef, useState} from "react";
import AuthLayout from "@/Layouts/AuthLayout.jsx";
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import MessageItem from "@/Components/Chat/MessageItem.jsx";
import ConversationHeader from "@/Components/Chat/ConversationHeader.jsx";
import MessageInput from "@/Components/Chat/MessageInput.jsx";
import {useEventBus} from "@/EventBus.jsx";
import AttachmentPreviewModal from "@/Components/Chat/Modals/AttachmentPreviewModal.jsx";
import {Head} from "@inertiajs/react";

function Home({ selectedConversation, messages }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesContainerRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) return;

        const firstMessage = localMessages[0];

        axios.get(window.route("message.loadOlder", firstMessage.id))
            .then((response) => {
                if (!response.data.data || response.data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesContainerRef.current.scrollHeight;
                const scrollTop = messagesContainerRef.current.scrollTop;
                const clientHeight = messagesContainerRef.current.clientHeight;

                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prevMessages) => {
                    return [...response.data.data.reverse(), ...prevMessages];
                })
            })
    }, [localMessages]);

    const onAttachmentClick = (attachments, index) => {
        setPreviewAttachment({
            attachments,
            index,
        });

        setShowAttachmentPreview(true);
    };

    const messageCreated = (message) => {
        if (
            selectedConversation?.is_group &&
            message.group_id === selectedConversation.id
        ) {
            setLocalMessages(prev => [...prev, message]);
        }

        if (
            selectedConversation?.is_user &&
            (
                message.sender_id === selectedConversation.id ||
                // if receiver_id is a string, parse to number
                message.receiver_id === selectedConversation.id ||
                parseInt(message.receiver_id, 10) === selectedConversation.id
            )
        ) {
            setLocalMessages(prev => [...prev, message]);
        }
    };

    const messageDeleted = ({message}) => {
        if (
            selectedConversation?.is_group &&
            message.group_id === selectedConversation.id
        ) {
            setLocalMessages(prev => {
                return prev.filter((m) => m.id !== message.id)
            });
        }

        if (
            selectedConversation?.is_user &&
            (
                message.sender_id === selectedConversation.id ||
                // if receiver_id is a string, parse to number
                message.receiver_id === selectedConversation.id ||
                parseInt(message.receiver_id, 10) === selectedConversation.id
            )
        ) {
            setLocalMessages(prev => {
                return prev.filter((m) => m.id !== message.id)
            });
        }
    };

    useEffect(() => {
        setLocalMessages(messages
            ? [...messages.data].reverse()
            : []
        );
    }, [messages]);

    useEffect(() => {
        if (messagesContainerRef.current && scrollFromBottom !== null) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight -
                messagesContainerRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && loadMoreMessages()),
            {
                rootMargin: "0px 0px 150px 0px"
            }
        );

        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100)
        }

        return () => {
            observer.disconnect();
        };

    }, [localMessages, noMoreMessages]);

    useEffect(() => {
        const offCreated = on('message.created', messageCreated);
        const offDeleted = on('message.destroy', messageDeleted);

        setNoMoreMessages(false);

        setTimeout(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        }, 0);

        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    return (
        <>
            <Head title={selectedConversation ? selectedConversation.name : 'Home'} />
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-neutral-100">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block"/>
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesContainerRef}
                        className="flex flex-col flex-1 overflow-y-auto p-5"
                    >
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-neutral-50">
                                    <p>No messages found</p>
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex flex-col space-y-2">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput
                        conversation={selectedConversation}
                    />
                </>
            )}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.index}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthLayout>
    );
}

export default Home;
