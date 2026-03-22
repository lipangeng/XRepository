import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Go Home
      </Link>
    </div>
  )
}
