import { type ChatMessage } from '../../hooks/useChat'
import { securityService } from '../../services/security.service'
import { formatTimestamp } from '../../utils/helpers'

interface MessageProps {
  message: ChatMessage
  isOwn?: boolean
}

export function Message({ message, isOwn = false }: MessageProps) {
  const processedMessage = securityService.processMessage(message.mensaje)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 animate-fadeIn`}>
      <div className={`message-bubble max-w-[80%] sm:max-w-[70%] rounded-2xl transition-all duration-200 ${
        isOwn
          ? 'own bg-blue-600 text-white rounded-br-none shadow-md'
          : 'other bg-white text-gray-900 border border-gray-100 rounded-bl-none'
      }`}
      >
        <div className={`px-4 py-2 text-sm break-words leading-relaxed message-content ${isOwn ? 'text-white' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: processedMessage }} />

        <div className="px-3 pb-2 pt-1 text-[10px] text-gray-400 text-right">{formatTimestamp(message.timestamp)}</div>
      </div>
    </div>
  )
}
