import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function AppLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-container">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            
            {isSidebarOpen && (
                <div className="sidebar-backdrop" onClick={closeSidebar} />
            )}

            <div className="main-content-area">
                <Topbar onToggleSidebar={toggleSidebar} />
                <main className="main-scroll-pane">
                    {children}
                </main>
                <footer className="app-footer">
                    <span>© {new Date().getFullYear()} Hammad Shaikh</span>
                    <span className="app-footer-dot" aria-hidden="true">·</span>
                    <span>DocSphere</span>
                </footer>
            </div>
        </div>
    );
}

export default AppLayout;