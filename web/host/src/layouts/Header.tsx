import { useAuth } from '../stores/auth-store'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background">
      <div className="text-sm text-muted-foreground">Artifact Repository Manager</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground">{user?.username}</span>
        <button onClick={logout} className="text-sm text-destructive hover:text-destructive/80">
          Logout
        </button>
      </div>
    </header>
  )
}
