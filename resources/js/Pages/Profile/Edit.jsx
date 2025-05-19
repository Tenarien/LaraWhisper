import {Head, usePage} from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileForm';
import HeaderLayout from "@/Layouts/HeaderLayout.jsx";

export default function Edit({ mustVerifyEmail, status }) {
    const {auth} = usePage().props
    return (
        <>
            <HeaderLayout user={auth.user}></HeaderLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="p-4 shadow sm:rounded-lg sm:p-8 dark:bg-neutral-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 shadow sm:rounded-lg sm:p-8 dark:bg-neutral-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 shadow sm:rounded-lg sm:p-8 dark:bg-neutral-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );
}

