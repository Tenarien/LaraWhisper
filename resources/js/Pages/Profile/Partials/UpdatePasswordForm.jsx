import Transition from '../../../Components/Transition.jsx';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(window.route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const baseButtonStyles = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
    const primaryButtonStyles = `${baseButtonStyles} bg-neutral-800 dark:bg-neutral-200 border-transparent text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-white focus:bg-neutral-700 dark:focus:bg-white active:bg-neutral-900 dark:active:bg-neutral-300 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`;
    const textInputStyles = 'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm';
    const labelStyles = 'block font-medium text-sm text-neutral-700 dark:text-neutral-300';
    const errorStyles = 'text-sm text-red-600 dark:text-red-400';
    const disabledButtonStyles = 'opacity-50 cursor-not-allowed';

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password_update" className={labelStyles}>
                        Current Password
                    </label>
                    <input
                        id="current_password_update"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className={`mt-1 block w-full ${textInputStyles}`}
                        autoComplete="current-password"
                        required
                    />
                    {errors.current_password && (
                        <p className={`mt-2 ${errorStyles}`}>
                            {errors.current_password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_update" className={labelStyles}>
                        New Password
                    </label>
                    <input
                        id="password_update"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={`mt-1 block w-full ${textInputStyles}`}
                        autoComplete="new-password"
                        required
                    />
                    {errors.password && (
                        <p className={`mt-2 ${errorStyles}`}>{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation_update" className={labelStyles}>
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation_update"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className={`mt-1 block w-full ${textInputStyles}`}
                        autoComplete="new-password"
                        required
                    />
                    {errors.password_confirmation && (
                        <p className={`mt-2 ${errorStyles}`}>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className={`${primaryButtonStyles} ${processing ? disabledButtonStyles : ''}`}
                        disabled={processing}
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
