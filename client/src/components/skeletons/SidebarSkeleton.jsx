import { useSelector } from "react-redux";

export default function SidebarSkeleton() {
    const { user } = useSelector((state) => state.auth);
    console.log(" from sidebar",user.role);
    let menuCount = 0;
    if (user?.role === 'Principal') {
        menuCount = 13;
    } else if (user?.role === 'Teacher') {
        menuCount = 6;
    }else if (user?.role === 'Parent') {
        menuCount = 3;
    }else if (user?.role === 'Super Admin') {
        menuCount = 3;
    }

    return (
        <div className="w-64 bg-blue-800 min-h-screen flex flex-col animate-pulse">
            <div className="p-4 border-b border-blue-700 flex items-center justify-between">
                <div className="h-8 w-15 bg-blue-700 rounded"></div>
                <div className="h-6 w-6 bg-blue-700 rounded"></div>
            </div>
            <nav className="flex-1 p-2 space-y-2">
                {[...Array(menuCount)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2 rounded">
                        <div className="h-5 w-5 bg-blue-700 rounded"></div>
                        <div className="h-4 w-24 bg-blue-700 rounded"></div>
                    </div>
                ))}
            </nav>
            <div className="p-2 border-t border-blue-700">
                <div className="flex items-center space-x-2 p-2 rounded">
                    <div className="h-5 w-5 bg-blue-700 rounded"></div>
                    <div className="h-4 w-16 bg-blue-700 rounded"></div>
                </div>
            </div>
        </div>
    );
}