import {Link, router, usePage} from "@inertiajs/react";
import {ArrowLeftIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/solid";
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";
import GroupAvatar from "@/Components/Chat/GroupAvatar.jsx";
import GroupDescription from "@/Components/Chat/GroupDescription.jsx";
import GroupUsers from "@/Components/Chat/GroupUsers.jsx";
import {useEventBus} from "@/EventBus.jsx";
import GroupDeleteModal from "@/Components/Chat/Modals/GroupDeleteModal.jsx";
import {useState} from "react";

const ConversationHeader = ({ selectedConversation }) => {
    const {auth} = usePage().props
    const [showGroupDeleteModal, setShowGroupDeleteModal] = useState(false);
    const {emit} = useEventBus();

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
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescription description={selectedConversation.description} />
                            <GroupUsers users={selectedConversation.users} />
                            {(
                                selectedConversation?.owner_id === auth.user.id
                                || auth.organisation?.owner_id === auth.user.id
                            ) && (
                                <div className="flex gap-3">
                                    <div className="tooltip tooltip-left" data-tip="Edit this Group">
                                        <button
                                            onClick={() => {
                                                emit("group.show.modal", selectedConversation);
                                            }}
                                            className="text-neutral-400 hover:text-neutral-200"
                                        >
                                            <PencilSquareIcon className="w-6 h-6"/>
                                        </button>
                                    </div>
                                    <div className="tooltip tooltip-left" data-tip="Delete this Group">
                                        <button
                                            onClick={(e) => setShowGroupDeleteModal(true)}
                                            className="text-neutral-400 hover:text-neutral-200"
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                </div>
            )}
            <GroupDeleteModal
                show={showGroupDeleteModal}
                onClose={() => setShowGroupDeleteModal(false)}
            />
        </>
    );
};

export default ConversationHeader;
