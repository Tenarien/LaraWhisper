import {useForm, usePage} from "@inertiajs/react";
import {useEventBus} from "@/EventBus.jsx";
import {useEffect, useState} from "react";
import Modal from "@/Components/Modal.jsx";
import UserPicker from "@/Components/UserPicker.jsx";


export default function GroupCreateModal({ show = false, onClose = () => {}}) {
    const page = usePage();
    const conversations = page.props.conversations;
    const [group, setGroup] = useState({});
    const {on, emit} = useEventBus();

    const users = conversations.filter((conversation) => !conversation.is_group)

    const {data, setData, post, put, errors, processing, reset} = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const onCreateOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            put(window.route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" updated successfully.`);
                }
            });
            return;
        }
        post(window.route("group.store"), {
            onSuccess: () => {
                closeModal();
                emit("toast.show", `Group "${data.name}" created successfully.`);
            }
        })
    };

    useEffect(() => {
        return on("group.show.modal", (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users.filter((user) => group.owner_id !== user.id).map((user) => user.id),
            });
            setGroup(group);
        });
    }, [on]);

    const closeModal = () => {
        reset();
        onClose();
    };



    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={onCreateOrUpdateGroup} className="p-6 overflow-y-auto bg-black/25 rounded-b-md">
                <h1 className="text-xl text-neutral-100">{group.id ? `Edit "${group.name}"` : "Create new Group"}</h1>
                <div className="flex flex-col gap-2 mt-6">
                    <label htmlFor="name">Name</label>
                    <input className="border border-white/25 rounded-md p-2 bg-black/25" required autoFocus type="text"
                           id="name" name="name" value={data.name}
                           onChange={(e) => setData("name", e.target.value)}/>
                    {errors.name ?? (<p className="mt-2 text-red-500">{errors.name}</p>)}
                </div>
                <div className="mt-2">
                    <label>Select Users</label>
                    <UserPicker
                        selected={users.filter((user) => group.owner_id !== user.id && data.user_ids.includes(user.id)) || []}
                        options={users}
                        onChange={(users) => setData("user_ids", users.map((user) => user.id))}
                    />
                    {errors.user_ids ?? (<p className="mt-2 text-red-500">{errors.user_ids}</p>)}
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea required id="description" name="description" rows="3"
                              className="mt-1 w-full block border border-white/25 rounded-md p-2 bg-black/25"
                              value={data.description}
                              onChange={(e) => setData("description", e.target.value)}/>
                    {errors.description ?? (<p className="mt-2 text-red-500">{errors.description}</p>)}
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        className="border border-white/25 rounded-md px-3 py-2 hover:bg-black/25 transition-all duration-300"
                        onClick={closeModal}>Cancel
                    </button>
                    <button
                        className="border border-white/25 rounded-md px-3 py-2 bg-black/30 hover:bg-black/50 transition-all duration-300"
                        disabled={processing}>{group.id ? "Update" : "Create"}</button>
                </div>
            </form>
        </Modal>
    );
}
