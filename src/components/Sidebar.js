// Sidebar.jsx

import Link from "next/link";
import { usePathname } from "next/navigation"; // ⬅️ NEW IMPORT for tracking the current page
import { 
  LayoutDashboard, 
  Calendar,
  Book,
  MessageCircle,
  Settings
} from "lucide-react";

// Define the navigation items to make the list clean and reusable
const navItems = [
    { name: "Dashboard", href: "/doctors/dashboard", icon: LayoutDashboard },
    { name: "Today’s Schedule", href: "/doctors/dashboard/schedule", icon: Calendar },
    { name: "bookings", href: "/doctors/dashboard/bookings", icon: Book },
    { name: "Messages", href: "/doctors/dashboard/messages", icon: MessageCircle },
    { name: "Profile & Settings", href: "/doctors/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname(); // Get the current URL path

  return (
    // Base styling: Fixed width, white background, and full height
    <aside className="w-64 bg-white shadow-2xl h-screen px-4 py-8 flex flex-col justify-between">
      
      {/* 1. Branding */}
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-extrabold text-[#193cb8]">MediCare</h2>
        <p className="text-xs text-gray-500 mt-1">Doctor Portal</p>
      </div>

      {/* 2. Navigation */}
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          // Determine if the current link is active
          // Note: Use startsWith for dashboard to match sub-pages like /schedule
          const isActive = 
            item.href === "/doctors/dashboard" 
              ? pathname.startsWith(item.href) && pathname !== "/doctors/dashboard/schedule" 
              : pathname.startsWith(item.href);

          // Base classes for all links
          const baseClasses = 
            "flex items-center gap-3 px-3 py-3 rounded-xl transition duration-200 font-medium";
            
          // Active classes (Teal background, bold white text)
          const activeClasses = "bg-[#193cb8] text-white shadow-md";
          
          // Inactive classes (Muted text, subtle hover)
          const inactiveClasses = "text-gray-600 hover:bg-blue-50 hover:text-[#193cb8]";
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              <item.icon size={20} /> 
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Optional: Add a profile/logout link at the bottom */}
      <div className="mt-8 pt-4 border-t border-gray-100 px-2">
          {/* Add a user profile link here if needed */}
          <Link href="/#home" className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-500">
             Logout
          </Link>
      </div>
    </aside>
  );
}