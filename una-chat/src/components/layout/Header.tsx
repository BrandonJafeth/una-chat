import { useSocket } from '../../hooks/useSocket'
import { useHealthCheck } from '../../hooks/useHealthCheck'

interface HeaderProps {
  username?: string
  onLogout?: () => void
}

export function Header({ username, onLogout }: HeaderProps) {
  const { isConnected } = useSocket()
  const { isHealthy, lastChecked, checkHealth } = useHealthCheck()

  // Minimalist status logic: socket = online; if socket down check backend health to show degraded/offline.
  const connectionStatus = isConnected ? 'online' : isHealthy ? 'degraded' : 'offline'

  const colorMap: Record<string, string> = {
    online: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    offline: 'bg-red-500',
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"/></svg>
            </div>
            <div className="flex flex-col leading-4">
              <span className="text-sm font-semibold text-gray-900">UNA Chat</span>
              <button
                onClick={() => void checkHealth()}
                title={lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Check connection'}
                className="-mt-0.5 text-xs text-gray-500 hover:text-gray-700"
                aria-label="Check server health"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colorMap[connectionStatus]}`} />
                  <span className="hidden sm:inline">{connectionStatus === 'online' ? 'Connected' : connectionStatus === 'degraded' ? 'Limited' : 'Offline'}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {username && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm text-gray-700 max-w-[140px] truncate">{username}</span>
              </div>
            )}
            {onLogout && (
              <button onClick={onLogout} aria-label="Logout" className="p-2 text-gray-500 hover:text-red-600 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
