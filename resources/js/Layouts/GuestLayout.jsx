export default function GuestLayout({ children }) {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full p-6">
                    {children}
                </div>
            </div>
        </>
    );
}
