import DOMPurify from 'dompurify'
import { isValidUrl } from '../utils/validators'

class SecurityService {
  sanitizeText(text: string): string {
    if (typeof text !== 'string') return ''

    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    })
  }

  sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'img', 'video', 'iframe', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'loading', 'controls', 'frameborder', 'allowfullscreen', 'allow'],
    })
  }

  validateAndSanitizeUrl(url: string): string | null {
    if (!isValidUrl(url)) {
      return null
    }

    try {
      const urlObj = new URL(url)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null
      }
      return urlObj.toString()
    } catch {
      return null
    }
  }

  parseMediaPlaceholders(message: string): string {
    const mediaRegex = /\[MEDIA:(image|youtube|video):([^\]]+)\]/g
    
    return message.replace(mediaRegex, (match, type, url) => {
      const sanitizedUrl = this.validateAndSanitizeUrl(url)
      
      if (!sanitizedUrl) {
        return '<span class="text-xs text-red-500">[Invalid media URL]</span>'
      }

      if (type === 'image') {
        return `<img src="${sanitizedUrl}" alt="Shared image" class="media-image" loading="lazy" />`
      } else if (type === 'youtube') {
        return `<iframe src="${sanitizedUrl}" class="media-video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      } else if (type === 'video') {
        return `<video src="${sanitizedUrl}" controls class="media-video"></video>`
      }

      return match
    })
  }

  processMessage(rawMessage: string): string {
    let sanitized = this.sanitizeText(rawMessage)
    
    // Detectar automáticamente URLs de imágenes
    const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)/gi
    sanitized = sanitized.replace(imageRegex, (url) => {
      const validUrl = this.validateAndSanitizeUrl(url)
      return validUrl 
        ? `[MEDIA:image:${validUrl}]` 
        : url
    })

    // Detectar automáticamente URLs de videos de YouTube
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}))/gi
    sanitized = sanitized.replace(youtubeRegex, (_match, _url, videoId) => {
      return `[MEDIA:youtube:https://www.youtube.com/embed/${videoId}]`
    })

    // Detectar automáticamente URLs de videos directos
    const videoRegex = /(https?:\/\/[^\s]+\.(?:mp4|webm|ogg)(?:\?[^\s]*)?)/gi
    sanitized = sanitized.replace(videoRegex, (url) => {
      const validUrl = this.validateAndSanitizeUrl(url)
      return validUrl 
        ? `[MEDIA:video:${validUrl}]` 
        : url
    })

    const withMedia = this.parseMediaPlaceholders(sanitized)
    return this.sanitizeHtml(withMedia)
  }
}

export const securityService = new SecurityService()
export default securityService
