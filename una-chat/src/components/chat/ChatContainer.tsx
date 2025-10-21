import { useAuth0 } from '@auth0/auth0-react'
import { useChat } from '../../hooks/useChat'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { getRandomColor } from '../../utils/helpers'
import { DEFAULT_COLORS } from '../../utils/constants'
// no local state needed here

export function ChatContainer() {
  const { messages, sendMessage, isLoading, error, loadHistory } = useChat()
  const { user } = useAuth0()
  const [userColor, setUserColor] = useLocalStorage('chat_color', DEFAULT_COLORS[0])
  

  if (!userColor) {
    setUserColor(getRandomColor())
  }

  const username = user?.name || user?.email || 'Anonymous'

  const handleSendMessage = (messageText: string): void => {
    sendMessage({
      nombre: username,
      mensaje: messageText,
      color: userColor,
      timestamp: new Date().toISOString(),
    })
    // reload history after sending so UI refreshes from server
    void loadHistory()
  }

  // removed test send helper; sendMessage now reloads history after send

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <p className="text-sm text-red-800 text-center">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={messages}
          currentUsername={username}
          isLoading={isLoading}
        />
  <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
