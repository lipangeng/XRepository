export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 bg-card rounded-lg border border-border ${className}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
