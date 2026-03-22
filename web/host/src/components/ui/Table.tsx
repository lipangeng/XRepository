export function Table({ children }: { children: React.ReactNode }) {
  return <div className="w-full overflow-auto"><table className="w-full">{children}</table></div>
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border hover:bg-muted/50">{children}</tr>
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-3 text-sm ${className}`}>{children}</td>
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="p-3 text-left text-sm font-medium text-muted-foreground">{children}</th>
}
