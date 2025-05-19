import { useForm } from '@inertiajs/react';

export default function AcceptInvitation({ invite }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post(window.route('organisation.invitation.register', invite.token));
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl mb-4">Join {invite.organisationName}</h1>
            <p className="mb-6">You’ve been invited as <strong>{invite.email}</strong>.</p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                </div>

                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && <div className="text-red-600">{errors.password}</div>}
                </div>

                <div>
                    <label className="block mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full btn btn-primary"
                >
                    Set Password & Join
                </button>
            </form>
        </div>
    );
}
