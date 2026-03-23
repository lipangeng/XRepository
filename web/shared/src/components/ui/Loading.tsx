export function Loading() {
  return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
}

export function LoadingPage() {
  return <div className="min-h-[60vh] flex items-center justify-center"><Loading /></div>
}
