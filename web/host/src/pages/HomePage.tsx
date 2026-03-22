import { Link } from 'react-router-dom'

const cards = [
  { to: '/repos', title: 'Repositories', desc: 'Manage artifact repositories', icon: '📦' },
  { to: '/tasks', title: 'Tasks', desc: 'View and trigger tasks', icon: '⚙️' },
  { to: '/settings', title: 'Settings', desc: 'System configuration', icon: '🔧' },
]

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
