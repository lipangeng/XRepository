import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from 'host/components/ui/Card'
import { Button } from 'host/components/ui/Button'

export function SystemSettings() {
  const [settings, setSettings] = useState({
    serverName: 'XNexus',
    baseUrl: 'http://localhost:8080',
    maxUploadSize: '10GB',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving settings:', settings)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Server Name</label>
              <input
                type="text"
                value={settings.serverName}
                onChange={(e) => setSettings({ ...settings, serverName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base URL</label>
              <input
                type="text"
                value={settings.baseUrl}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Upload Size</label>
              <input
                type="text"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
