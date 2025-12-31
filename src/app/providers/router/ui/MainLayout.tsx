import { Outlet } from 'react-router-dom';

/**
 * MainLayout Component.
 * Structural wrapper for authenticated pages.
 * Defines the grid: Sidebar + Main Content.
 */
export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* Sidebar Placeholder - We will replace this with a Widget later */}
      <aside className="w-64 border-r border-white/10 bg-[#030712] p-6 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="text-xl font-bold mb-10 text-indigo-500">
            App Name
          </div>

          <nav className="flex-1 space-y-2">
            <div className="p-3 bg-white/5 rounded-lg text-sm">Dashboard</div>
            <div className="p-3 text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
              Projects
            </div>
            <div className="p-3 text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
              Settings
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            {/* Logout button will be moved here later */}
            <div className="text-sm text-red-400 cursor-pointer">Logout</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Render actual page content (e.g. DashboardPage) */}
        <Outlet />
      </main>
    </div>
  );
};
