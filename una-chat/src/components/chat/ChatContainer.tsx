import { useAuth0 } from '@auth0/auth0-react'
import { useChat } from '../../hooks/useChat'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { getRandomColor } from '../../utils/helpers'
import { DEFAULT_COLORS } from '../../utils/constants'

export function ChatContainer() {
  const { messages, sendMessage, isLoading, error, loadHistory } = useChat()
  const { user } = useAuth0()
  const [userColor, setUserColor] = useLocalStorage('chat_color', DEFAULT_COLORS[0])
  

  if (!userColor) {
    setUserColor(getRandomColor())
  }

  const username = user?.name || user?.email || 'Anonymous'

  const handleSendMessage = (messageText: string): void => {
    const msg = {
      nombre: username,
      mensaje: messageText,
      color: userColor,
      timestamp: new Date().toISOString(),
    }

    // Call async sendMessage and refresh history on success
    void sendMessage(msg)
      .then(() => {
        void loadHistory()
      })
      .catch((err) => {
        console.warn('Failed to send message:', err)
      })

    })
    void loadHistory()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-3 animate-fadeIn">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-stretch justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-4xl h-full flex flex-col shadow-sm rounded-xl overflow-hidden bg-white">
          <MessageList
            messages={messages}
            currentUsername={username}
            isLoading={isLoading}
          />
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}
