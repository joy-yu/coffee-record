import { NavLink } from 'react-router-dom';
import { Coffee, PlusCircle, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: '首页', icon: Coffee, end: true },
  { to: '/new', label: '新建记录', icon: PlusCircle },
  { to: '/history', label: '历史记录', icon: Clock },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cream-300/60 backdrop-blur-sm" style={{ background: 'rgba(250, 244, 232, 0.92)' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #5c3d21, #a67c42)' }}
            >
              ☕
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-espresso-700 tracking-wide">手冲日志</div>
              <div className="text-[10px] text-espresso-400 tracking-widest font-sans uppercase hidden sm:block">Pour Over Log</div>
            </div>
          </NavLink>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive ? 'bg-espresso-600 text-cream-100 shadow-sm' : 'text-espresso-500 hover:bg-cream-200 hover:text-espresso-700'
                  }`
                }
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="border-t border-cream-300/50 py-6 text-center">
        <p className="text-xs text-espresso-400 font-sans tracking-wide">
          <span className="font-display italic text-sm text-espresso-500">&ldquo;Every cup tells a story.&rdquo;</span>
          <br />
          <span className="mt-1 inline-block opacity-60">Pour Over Log · 数据仅存储于本地浏览器</span>
        </p>
      </footer>
    </div>
  );
}
