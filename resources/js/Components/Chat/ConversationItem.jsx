import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar.jsx";
import GroupAvatar from "./GroupAvatar.jsx";
import UserOptionsDropdown from "./UserOptionsDropdown.jsx";
import {formatMessageDateShort} from "@/helpers.jsx";

const ConversationItem = ({conversation, selectedConversation, online=null,})  => {
    const page = usePage();
    const currentUser = page.props.auth.user;

    let classes = "border-transparent";

    if (selectedConversation) {
        if (!selectedConversation.is_group && !conversation.is_group && selectedConversation.id === conversation.id) {
            classes = "border-neutral-500 bg-black/20"
        }
        if (selectedConversation.is_group && conversation.is_group && selectedConversation.id === conversation.id) {
            classes = "border-neutral-500 bg-black/20"
        }
    }
    return (
        <Link
            href={conversation.is_group ? route("chat.group", conversation) : route("chat.user", conversation)}
            preserveState
            className={"conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-1-4 hover:bg-black/30 " + classes}
        >{conversation.is_user && (<UserAvatar user={conversation} online={online}/>)}{conversation.is_group &&
            <GroupAvatar initial={conversation.users.name}/>}
            <div
                className={`flex-1 text-xs max-w-full overflow-hidden ` + (conversation.is_user && conversation.blocked_at ? " opacity-50" : "")}>
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">{conversation.name}</h3>
                    {conversation.last_message_date && (
                        <span className="text-nowrap">{formatMessageDateShort(conversation.last_message_date)}</span>)}
                </div>
                {conversation.last_message && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">{conversation.last_message}</p>
                )}
            </div>
        </Link>
    );
};

export default ConversationItem;
