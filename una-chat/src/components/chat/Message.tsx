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
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
          isOwn
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-sm font-semibold ${
              isOwn ? 'text-blue-100' : ''
            }`}
            {...(!isOwn && { style: { color: message.color } })}
          >
            {message.nombre}
          </span>
          <span
            className={`text-xs ${
              isOwn ? 'text-blue-200' : 'text-gray-500'
            }`}
          >
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div
          className="text-sm break-words"
          dangerouslySetInnerHTML={{ __html: processedMessage }}
        />
      </div>
    </div>
  )
}
