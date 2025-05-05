import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(window.route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const baseButtonStyles = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
    const dangerButtonStyles = `${baseButtonStyles} bg-red-600 border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-neutral-800`;
    const secondaryButtonStyles = `${baseButtonStyles} bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`;
    const textInputStyles = 'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm';
    const disabledButtonStyles = 'opacity-50 cursor-not-allowed';

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className={`${dangerButtonStyles} ${processing ? disabledButtonStyles : ''}`}
                disabled={processing}
            >
                Delete Account
            </button>

            {confirmingUserDeletion && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0"
                >
                    {/* Backdrop styling */}
                    <div className="fixed inset-0 transform transition-all" onClick={closeModal}>
                        <div className="absolute inset-0 bg-neutral-500 dark:bg-neutral-900 opacity-75"></div>
                    </div>

                    {/* Modal Content Container */}
                    <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg sm:mx-auto z-50">
                        <form onSubmit={deleteUser} className="p-6">
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                Are you sure you want to delete your account?
                            </h2>

                            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                Once your account is deleted, all of its resources and
                                data will be permanently deleted. Please enter your
                                password to confirm you would like to permanently delete
                                your account.
                            </p>

                            <div className="mt-6">
                                <label
                                    htmlFor="password_delete"
                                    className="sr-only"
                                >
                                    Password
                                </label>

                                <input
                                    id="password_delete"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className={`mt-1 block w-3/4 p-2 ${textInputStyles}`}
                                    autoFocus
                                    placeholder="Password"
                                    required
                                />

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={secondaryButtonStyles}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={`ms-3 ${dangerButtonStyles} ${processing ? disabledButtonStyles : ''}`}
                                    disabled={processing}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
