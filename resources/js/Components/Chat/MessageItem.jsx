import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React, {useEffect, useState} from "react";
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "@/Components/Chat/MessageAttachments.jsx";
import MessageDropdown from "@/Components/Chat/MessageDropdown.jsx";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;
    const [isHidden, setIsHidden] = useState(true);

    return (
        <div
            className={"chat " + (message.sender_id === currentUser.id ? "chat-end" : "chat-start")}
            onMouseOver={(e) => {setIsHidden(false)}}
            onMouseLeave={(e) => {setIsHidden(true)}}
        >
            <UserAvatar user={message.sender} />
            <div className="chat-header">
                {message.sender_id !== currentUser.id ? message.sender.name : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>
            <div className={"chat-bubble relative break-words " + (message.sender_id === currentUser.id ? "bg-blue-500" : "bg-neutral-800")} >
                {message.sender_id === currentUser.id && (
                    <MessageDropdown message={message} hide={isHidden}/>
                )}
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default MessageItem;
