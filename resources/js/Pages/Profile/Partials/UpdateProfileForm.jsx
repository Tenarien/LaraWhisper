import Transition from '../../../Components/Transition.jsx';
import { Link, useForm, usePage } from '@inertiajs/react';
import {useEffect, useState} from 'react';
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";

export default function UpdateProfileInformationForm({mustVerifyEmail, status, className = '',}) {
    const user = usePage().props.auth.user;

    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        _method: 'patch',
    });

    const submit = (e) => {
        e.preventDefault();

        post(window.route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview(null);
                }
            },
            onError: (errorData) => {
                console.error('Profile update errors:', errorData);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setData('avatar', null);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
            setAvatarPreview(null);
        }
    };

    const baseButtonStyles = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
    const primaryButtonStyles = `${baseButtonStyles} bg-neutral-800 dark:bg-neutral-200 border-transparent text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-white focus:bg-neutral-700 dark:focus:bg-white active:bg-neutral-900 dark:active:bg-neutral-300 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`;
    const secondaryButtonStyles = `${baseButtonStyles} bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800`;
    const textInputStyles = 'border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm';
    const labelStyles = 'block font-medium text-sm text-neutral-700 dark:text-neutral-300 mb-1';
    const errorStyles = 'text-sm text-red-600 dark:text-red-400';
    const disabledButtonStyles = 'opacity-50 cursor-not-allowed';
    const linkStyles = "rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-100 dark:focus:ring-offset-neutral-800";
    const avatarImageStyles = "h-20 w-20 rounded-full object-cover";

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Update your account's profile information, email address, and avatar.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div>
                    <label className={labelStyles}>Avatar</label>
                    <div className="mt-2 flex items-center gap-x-4">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="New avatar preview"
                                className={avatarImageStyles}
                            />
                        ) : (
                            <UserAvatar user={user} className={avatarImageStyles} />
                        )}
                        <label
                            htmlFor="avatar_upload"
                            className={`${secondaryButtonStyles} cursor-pointer`}
                        >
                            <span>Change Avatar</span>
                            <input
                                id="avatar_upload"
                                name="avatar"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/webp, image/gif"
                            />
                        </label>
                    </div>
                    {errors.avatar && (
                        <p className={`mt-2 ${errorStyles}`}>{errors.avatar}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="name_profile" className={labelStyles}>
                        Name
                    </label>
                    <input
                        id="name_profile"
                        type="text"
                        className={`mt-1 block w-full ${textInputStyles}`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.name && (
                        <p className={`mt-2 ${errorStyles}`}>{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email_profile" className={labelStyles}>
                        Email
                    </label>
                    <input
                        id="email_profile"
                        type="email"
                        className={`mt-1 block w-full ${textInputStyles}`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && (
                        <p className={`mt-2 ${errorStyles}`}>{errors.email}</p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
                            Your email address is unverified.&nbsp;
                            <Link
                                href={window.route('verification.send')}
                                method="post"
                                as="button"
                                className={linkStyles}
                                preserveScroll
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className={`${primaryButtonStyles} ${processing ? disabledButtonStyles : ''}`}
                        disabled={processing}
                    >
                        Save Changes
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
