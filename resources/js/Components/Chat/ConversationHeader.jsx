import {Link, router, usePage} from "@inertiajs/react";
import {ArrowLeftIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/solid";
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";
import GroupAvatar from "@/Components/Chat/GroupAvatar.jsx";
import GroupDescription from "@/Components/Chat/GroupDescription.jsx";
import GroupUsers from "@/Components/Chat/GroupUsers.jsx";
import {useEventBus} from "@/EventBus.jsx";

const ConversationHeader = ({ selectedConversation }) => {
    const {auth} = usePage().props
    const {emit} = useEventBus();

    const onDelete = () => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;

        axios.delete(window.route("group.destroy", selectedConversation.id))
            .then(({data}) => {
                emit('toast.show', data.message);

                router.visit(data.redirect_url);
            })
            .catch((error) => {
                console.error(error);
            })
    };
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
                            {selectedConversation.owner_id === auth.user.id && (
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
                                            onClick={onDelete}
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
        </>
    );
};

export default ConversationHeader;
