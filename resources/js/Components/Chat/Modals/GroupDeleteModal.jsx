import {router, useForm, usePage} from "@inertiajs/react";
import {useEventBus} from "@/EventBus.jsx";
import {useEffect, useState} from "react";
import Modal from "@/Components/Modal.jsx";


const baseButtonStyles = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
const secondaryButtonStyles = `${baseButtonStyles} bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`;
const dangerButtonStyles = `${baseButtonStyles} bg-red-600 border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-neutral-800`;
const disabledButtonStyles = 'opacity-50 cursor-not-allowed';

export default function GroupDeleteModal({ show = false, onClose = () => {}}) {
    const page = usePage();
    const selectedConversation = page.props.selectedConversation ?? null;
    const [isDeleting, setIsDeleting] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const {emit} = useEventBus();

    const onDeleteGroup = (e) => {
        if (isDeleting) return;

        e.preventDefault();
        setIsDeleting(true);

        axios.delete(window.route("group.destroy", selectedConversation.id))
            .then(({data}) => {
                emit('toast.show', data.message);

                router.visit('/dashboard');
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsDeleting(false);
            })
    };

    useEffect(() => {
        setIsDeleting(true);
        setCountdown(5);

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsDeleting(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [show]);

    const closeModal = () => {
        onClose();
    };



    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={onDeleteGroup} className="p-6 overflow-y-auto bg-black/25 rounded-b-md">
                <h1 className="text-xl text-neutral-100">Delete {selectedConversation.name} Group</h1>
                <p className="mt-2 text-sm text-neutral-300">
                    Are you sure you want to
                    remove <strong>{selectedConversation.name}</strong>? This cannot be
                    undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        className={secondaryButtonStyles}
                        onClick={closeModal}>Cancel
                    </button>
                    <button
                        className={`ms-3 ${dangerButtonStyles} ${isDeleting ? disabledButtonStyles : ''}`}
                        disabled={isDeleting}
                    >
                        {isDeleting ? `Delete ${countdown}` : 'Delete'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
