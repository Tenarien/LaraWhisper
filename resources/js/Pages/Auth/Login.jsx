import {Link, useForm} from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout.jsx";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-neutral-50 p-8 rounded shadow-md">
                    <h1 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">Login</h1>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Email */}
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="text-sm text-neutral-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="block w-full px-3 py-2 text-sm text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <div className="text-sm text-red-600">{errors.email}</div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="text-sm text-neutral-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="block w-full px-3 py-2 text-sm text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <div className="text-sm text-red-600">{errors.password}</div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-2 px-4 rounded text-neutral-50 font-semibold transition ${
                                processing
                                    ? 'bg-neutral-500 cursor-not-allowed'
                                    : 'bg-neutral-800 hover:bg-neutral-700'
                            }`}
                        >
                            {processing ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/register" className="text-neutral-900 hover:text-neutral-600">Don't have an account?</Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
