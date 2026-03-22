import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/repos', label: 'Repositories', icon: '📦' },
  { to: '/tasks', label: 'Tasks', icon: '⚙️' },
  { to: '/settings', label: 'Settings', icon: '🔧' },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold text-foreground">XNexus</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
