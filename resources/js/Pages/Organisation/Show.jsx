import {Link, useForm, usePage, Head} from '@inertiajs/react'
import {useState} from 'react'
import axios from 'axios'
import Modal from '@/Components/Modal.jsx'
import HeaderLayout from "@/Layouts/HeaderLayout.jsx"
import Transition from '@/Components/Transition.jsx'
import UserAvatar from "@/Components/Chat/UserAvatar.jsx"
import {useEventBus} from "@/EventBus.jsx"
import Toast from "@/Components/Toast.jsx"

const baseButtonStyles = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150'
const dangerButtonStyles = `${baseButtonStyles} bg-red-600 border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-neutral-800`
const secondaryButtonStyles = `${baseButtonStyles} bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`
const textInputStyles = 'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm'
const disabledButtonStyles = 'opacity-50 cursor-not-allowed'
const primaryButtonStyles = `${baseButtonStyles} bg-neutral-800 dark:bg-neutral-200 border-transparent text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-white focus:bg-neutral-700 dark:focus:bg-white active:bg-neutral-900 dark:active:bg-neutral-300 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`
const labelStyles = 'block font-medium text-sm text-neutral-700 dark:text-neutral-300'
const errorStyles = 'text-sm text-red-600 dark:text-red-400'
const sectionHeaderStyles = 'text-lg font-medium text-neutral-900 dark:text-neutral-100'
const sectionDescriptionStyles = 'mt-1 text-sm text-neutral-600 dark:text-neutral-400'
const cardStyles = 'p-4 shadow sm:rounded-lg sm:p-8 dark:bg-neutral-800'

export default function ShowOrganisation({organisation, invites}) {
    const {auth} = usePage().props
    const [localOrganisation, setLocalOrganisation] = useState(organisation.data)
    const [localInvites, setLocalInvites] = useState(invites.data ?? invites)
    const [showConfirm, setShowConfirm] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showInviteConfirm, setShowInviteConfirm] = useState(false)
    const [toDeleteInvite, setToDeleteInvite] = useState(null)
    const [isDeletingInvite, setIsDeletingInvite] = useState(false)
    const {emit} = useEventBus()

    function onClickDelete(user) {
        setToDelete(user)
        setShowConfirm(true)
    }

    function confirmDelete() {
        let flashMessage = ''
        setIsDeleting(true)
        axios
            .delete(
                window.route('organisation.user.destroy', {
                    organisation: localOrganisation.id,
                    user: toDelete.id,
                })
            )
            .then(({data}) => {
                flashMessage = data.message
                setLocalOrganisation(org => ({
                    ...org,
                    users: org.users.filter(u => u.id !== toDelete.id),
                }))
            })
            .catch(err => {
                console.error(err)
                flashMessage = 'Something went wrong.'
            })
            .finally(() => {
                emit('toast.show', flashMessage)
                setShowConfirm(false)
                setToDelete(null)
                setIsDeleting(false)
            })
    }

    function onClickDeleteInvite(invite) {
        setToDeleteInvite(invite)
        setShowInviteConfirm(true)
    }

    function confirmDeleteInvite() {
        let flashMessage = ''
        setIsDeletingInvite(true)
        axios
            .delete(
                window.route('organisation.invite.destroy', {
                    organisation: localOrganisation.id,
                    invite: toDeleteInvite.id,
                })
            )
            .then(({data}) => {
                flashMessage = data.message
                setLocalInvites(invites => invites.filter(i => i.id !== toDeleteInvite.id))
            })
            .catch(err => {
                console.error(err)
                flashMessage = 'Something went wrong.'
            })
            .finally(() => {
                emit('toast.show', flashMessage)
                setShowInviteConfirm(false)
                setToDeleteInvite(null)
                setIsDeletingInvite(false)
            })
    }

    const {
        data: nameData,
        setData: setNameData,
        patch: patchName,
        processing: processingName,
        errors: nameErrors,
        recentlySuccessful: nameRecentlySuccessful,
    } = useForm({name: localOrganisation.name})

    const {
        data: inviteData,
        setData: setInviteData,
        post: postInvite,
        processing: processingInvite,
        errors: inviteErrors,
        recentlySuccessful: inviteRecentlySuccessful,
    } = useForm({email: ''})

    function updateName(e) {
        e.preventDefault()
        patchName(window.route('organisation.update', localOrganisation.id), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalOrganisation(prev => ({...prev, name: nameData.name}))
            },
        })
    }

    function sendInvite(e) {
        e.preventDefault()
        postInvite(window.route('organisation.invite', localOrganisation.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetInviteForm('email')
            },
        })
    }

    return (
        <>
            <HeaderLayout user={auth.user} />
            <Head title={localOrganisation.name} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className={cardStyles}>
                        <section>
                            <header>
                                <h2 className={sectionHeaderStyles}>Organisation Information</h2>
                                <p className={sectionDescriptionStyles}>
                                    Update your organisation's name.
                                </p>
                            </header>
                            <form onSubmit={updateName} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="org_name" className={labelStyles}>
                                        Name
                                    </label>
                                    <input
                                        id="org_name"
                                        type="text"
                                        className={`mt-1 block w-full p-2 ${textInputStyles}`}
                                        value={nameData.name}
                                        onChange={e => setNameData('name', e.target.value)}
                                        required
                                    />
                                    {nameErrors.name && (
                                        <p className={`mt-2 ${errorStyles}`}>{nameErrors.name}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        className={`${primaryButtonStyles} ${processingName ? disabledButtonStyles : ''}`}
                                        disabled={processingName}
                                    >
                                        Save Name
                                    </button>
                                    <Transition
                                        show={nameRecentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>
                    <div className={cardStyles}>
                        <section>
                            <header>
                                <h2 className={sectionHeaderStyles}>Users</h2>
                                <p className={sectionDescriptionStyles}>
                                    Current members of your organisation.
                                </p>
                            </header>
                            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto">
                                {localOrganisation.users.length > 0 ? (
                                    localOrganisation.users.map(user => (
                                        <div key={user.id} className="flex justify-between">
                                            <div className="flex gap-2 items-center text-sm text-neutral-800 dark:text-neutral-200">
                                                <UserAvatar user={user} />
                                                <Link href={`/user/${user.id}`} className="font-medium hover:text-white">
                                                    {user.name}
                                                </Link>
                                                <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                                                  {user.email}
                                                </span>
                                            </div>
                                            {user.id !== auth.user.id && (
                                                <button
                                                    onClick={() => onClickDelete(user)}
                                                    className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className={sectionDescriptionStyles}>
                                        No users found in this organisation yet.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className={cardStyles}>
                        <section>
                            <header>
                                <h2 className={sectionHeaderStyles}>Invited Users</h2>
                                <p className={sectionDescriptionStyles}>
                                    Pending invitations you’ve sent out.
                                </p>
                            </header>
                            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto">
                                {localInvites.length > 0 ? (
                                    localInvites.map(invite => (
                                        <div key={invite.id} className="flex justify-between">
                                            <div className="flex gap-2 items-center text-sm text-neutral-800 dark:text-neutral-200">
                                                <span className="font-medium">{invite.email}</span>
                                            </div>
                                            <button
                                                onClick={() => onClickDeleteInvite(invite)}
                                                className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={sectionDescriptionStyles}>
                                        No pending invites.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className={cardStyles}>
                        <section>
                            <header>
                                <h2 className={sectionHeaderStyles}>Group Chats</h2>
                                <p className={sectionDescriptionStyles}>
                                    Group conversations within your organisation.
                                </p>
                            </header>
                            <div className="mt-6 space-y-4">
                                {localOrganisation.groups.length > 0 ? (
                                    localOrganisation.groups.map(group => (
                                        <div key={group.id} className="text-sm text-neutral-800 dark:text-neutral-200">
                      <span className="font-medium hover:text-neutral-900 dark:hover:text-white">
                        <Link
                            href={`/group/${group.id}`}
                            className="hover:underline focus:outline-none focus:underline"
                        >
                          {group.name}
                        </Link>
                      </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className={sectionDescriptionStyles}>No group chats found for this organisation.</p>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className={cardStyles}>
                        <section>
                            <header>
                                <h2 className={sectionHeaderStyles}>Invite New User</h2>
                                <p className={sectionDescriptionStyles}>
                                    Send an invitation email to add a new user to the organisation.
                                </p>
                            </header>
                            <form onSubmit={sendInvite} className="mt-6 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-1">
                                        <input
                                            id="invite_email"
                                            type="email"
                                            placeholder="Email address"
                                            className={`block w-full p-2 ${textInputStyles}`}
                                            value={inviteData.email}
                                            onChange={e => setInviteData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`${primaryButtonStyles} ${processingInvite ? disabledButtonStyles : ''}`}
                                        disabled={processingInvite}
                                    >
                                        Send Invite
                                    </button>
                                </div>
                                {inviteErrors.email && <p className={`mt-2 ${errorStyles}`}>{inviteErrors.email}</p>}
                                <Transition
                                    show={inviteRecentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 dark:text-green-400">Invitation sent.</p>
                                </Transition>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
            <Modal
                show={showConfirm}
                onClose={() => {
                    setShowConfirm(false)
                    setToDelete(null)
                }}
                maxWidth="sm"
            >
                <div className="p-6">
                    <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
                    <p className="mt-2 text-sm text-neutral-300">
                        Are you sure you want to remove <strong>{toDelete?.name}</strong> from <em>{localOrganisation.name}</em>? This cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setShowConfirm(false)
                                setToDelete(null)
                            }}
                            className={secondaryButtonStyles}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className={`${dangerButtonStyles} ${isDeleting ? disabledButtonStyles : ''}`}
                            disabled={isDeleting}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showInviteConfirm}
                onClose={() => {
                    setShowInviteConfirm(false)
                    setToDeleteInvite(null)
                }}
                maxWidth="sm"
            >
                <div className="p-6">
                    <h3 className="text-lg font-medium text-white">Cancel Invitation</h3>
                    <p className="mt-2 text-sm text-neutral-300">
                        Are you sure you want to cancel the invitation to <strong>{toDeleteInvite?.email}</strong>? This cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setShowInviteConfirm(false)
                                setToDeleteInvite(null)
                            }}
                            className={secondaryButtonStyles}
                        >
                            Keep Invite
                        </button>
                        <button
                            onClick={confirmDeleteInvite}
                            className={`${dangerButtonStyles} ${isDeletingInvite ? disabledButtonStyles : ''}`}
                            disabled={isDeletingInvite}
                        >
                            Cancel Invite
                        </button>
                    </div>
                </div>
            </Modal>
            <Toast/>
        </>
    )
}
