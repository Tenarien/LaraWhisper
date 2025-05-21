import {Head, Link, useForm} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import HeaderLayout from "@/Layouts/HeaderLayout.jsx";
import Toast from "@/Components/Toast.jsx";

export default function RegisterPage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    console.log(errors)

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <Head title="Register"/>
            <HeaderLayout />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md bg-neutral-50 p-8 rounded shadow-md">
                    <h1 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">Register</h1>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Name */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-sm text-neutral-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full px-3 py-2 text-sm text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <div className="text-sm text-red-600">{errors.name}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm text-neutral-700">
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
                            <label htmlFor="password" className="text-sm text-neutral-700">
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

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label htmlFor="password_confirmation" className="text-sm text-neutral-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="block w-full px-3 py-2 text-sm text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
                                placeholder="Confirm your password"
                            />
                            {errors.password_confirmation && (
                                <div className="text-sm text-red-600">{errors.password_confirmation}</div>
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
                                'Register'
                            )}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-neutral-900 hover:text-neutral-600">Already have an account?</Link>
                    </div>
                </div>
            </div>
            <Toast/>
        </GuestLayout>
    );
}
