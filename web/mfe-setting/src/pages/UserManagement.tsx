import { Card } from 'host/components/ui/Card'
import { Button } from 'host/components/ui/Button'

export function UserManagement() {
  const users = [
    { username: 'admin', role: 'admin' },
    { username: 'developer', role: 'user' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button>Add User</Button>
      </div>

      <Card>
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="border-b border-border">
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Username</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="border-b border-border hover:bg-muted/50">
                <td className="p-3 text-sm">{user.username}</td>
                <td className="p-3 text-sm">{user.role}</td>
                <td className="p-3 text-sm">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
