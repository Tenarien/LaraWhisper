import React from 'react';
import {Head, Link, usePage} from "@inertiajs/react";
import {ArrowUpOnSquareStackIcon, ChatBubbleLeftRightIcon, UserGroupIcon} from "@heroicons/react/24/solid";
import HeaderLayout from "@/Layouts/HeaderLayout.jsx";

export default function Welcome() {
    const {auth} = usePage().props

    return (
        <>
            <Head title="Welcome"/>
            <div className="p-6 flex justify-between">
                <HeaderLayout user={auth.user}/>
                <div>
                    <Link href="/login" className="btn btn-soft">Log In</Link>
                </div>
            </div>


            <div className="bg-neutral-900 text-neutral-100 flex flex-col">
                {/* Hero Section */}
                <header className="hero flex-1 bg-neutral-800">
                    <div className="hero-content text-center py-20 px-4 md:px-0">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-bold">Welcome to Larawhisper</h1>
                            <p className="py-6 text-lg">
                                A modern, secure, team-centric chat platform. Streamline your internal communications
                                with granular organisation control, media sharing, and topic-focused group channels.
                            </p>
                            <Link href="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        </div>
                    </div>
                </header>

                {/* Features */}
                <section className="py-16 px-6 md:px-0 bg-neutral-900">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-10">What Larawhisper Can Do</h2>
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                            <div className="card bg-neutral-800 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <ChatBubbleLeftRightIcon className="w-10 h-10"/>
                                    <h3 className="card-title">Instant Messaging</h3>
                                    <p>One-to-one or group chats keep your team in sync in real time.</p>
                                </div>
                            </div>

                            <div className="card bg-neutral-800 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <ArrowUpOnSquareStackIcon className="w-10 h-10"/>
                                    <h3 className="card-title">Files & Media</h3>
                                    <p>Share images, videos, and Documents. Keep everything in one place.</p>
                                </div>
                            </div>

                            <div className="card bg-neutral-800 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <UserGroupIcon className="w-10 h-10"/>
                                    <h3 className="card-title">Group Channels</h3>
                                    <p>Create focused spaces team, Dev team, Ops team, whatever you need.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Organisation UI */}
                <section className="py-16 px-6 md:px-0 bg-neutral-800">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <img
                                src="/img/larawhisper.png"
                                alt="Organisation Dashboard"
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-semibold mb-4">Full Organisation Control</h2>
                            <p className="mb-6">
                                The “Organisation Owner” sets up the workspace, invites team members, and controls
                                permissions. Rest easy knowing your org’s chats and files are private and secure.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Invite or remove users at any time</li>
                                <li>Manage group channel membership</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Sign up Now */}
                <footer className="bg-neutral-900 py-12 text-center">
                    <h3 className="text-2xl mb-4">Ready to Whisper With Your Team?</h3>
                    <Link href="/register" className="btn btn-primary btn-lg">Sign Up Now</Link>
                    <p className="mt-4 text-sm text-neutral-400">
                        Already have an account? <Link href="/login" className="link link-primary">Log in</Link>
                    </p>
                </footer>
            </div>
        </>
    );
}
