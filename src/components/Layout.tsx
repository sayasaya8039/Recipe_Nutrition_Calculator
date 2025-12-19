import { NavLink, Outlet } from "react-router-dom";
import { Calculator, BookOpen, Calendar, Settings, Moon, Sun, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePlanStore } from "@/stores/planStore";

const VERSION = "1.0.0";

const navItems = [
  { to: "/", icon: Calculator, label: "計算" },
  { to: "/recipes", icon: BookOpen, label: "レシピ" },
  { to: "/plan", icon: Calendar, label: "プラン" },
  { to: "/stats", icon: BarChart3, label: "統計" },
  { to: "/settings", icon: Settings, label: "設定" },
];

export function Layout() {
  const { settings, toggleDarkMode } = usePlanStore();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--bg-secondary)] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">
            🍳 レシピ栄養計算
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">v{VERSION}</span>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {settings.darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* ボトムナビ */}
      <nav className="sticky bottom-0 bg-[var(--bg-secondary)] border-t border-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex justify-around">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex flex-col items-center py-2 px-4 transition-colors ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
