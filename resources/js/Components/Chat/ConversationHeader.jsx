import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";
import GroupAvatar from "@/Components/Chat/GroupAvatar.jsx";

const ConversationHeader = ({ selectedConversation }) => {

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-neutral-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('home')}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-5" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-neutral-500">
                                    {selectedConversation.users.length} users
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
