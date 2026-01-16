import { Link, useLocation } from "wouter";
import { Copy, LayoutDashboard, Map, User, Menu } from "lucide-react"; // Using Copy as placeholder for Anamnese if ClipboardList not avail.
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Sidebar Items
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Minha Trilha", icon: Map, href: "/track" }, // Assuming route, might need adjustment
  { label: "Anamnese", icon: Copy, href: "/assessment" },
  { label: "Perfil", icon: User, href: "/profile" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-100 z-50">
        <div className="p-8">
            {/* Logo area */}
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                MetaTask
            </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
           {/* User mini profile could go here */}
           <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                   U
               </div>
               <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-900 truncate">Usuário</p>
                   <p className="text-xs text-slate-500 truncate">Sair</p>
               </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="flex-1 lg:ml-64 w-full min-h-screen transition-all duration-300 ease-in-out relative">
        <div className="p-6 pb-24 lg:pb-6 lg:p-10 max-w-7xl mx-auto">
            {children}
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 z-50 pb-safe">
        <div className="flex items-center justify-around">
            {NAV_ITEMS.map((item) => {
                 const isActive = location === item.href;
                 return (
                    <Link key={item.href} href={item.href}>
                        <a className="flex flex-col items-center gap-1 group">
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-200",
                                isActive ? "bg-blue-50 text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                            )}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            {/* Optional Label for Mobile? Usually cleaner without if icons are clear, or very small text */}
                            {/* <span className="text-[10px] font-medium">{item.label}</span> */}
                        </a>
                    </Link>
                 )
            })}
        </div>
      </div>
    </div>
  );
}
