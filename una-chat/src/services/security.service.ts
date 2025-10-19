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
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
      ALLOWED_ATTR: ['href', 'target'],
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
    const mediaRegex = /\[MEDIA:(image|video):([^\]]+)\]/g
    
    return message.replace(mediaRegex, (match, type, url) => {
      const sanitizedUrl = this.validateAndSanitizeUrl(url)
      
      if (!sanitizedUrl) {
        return '[Invalid media URL]'
      }

      if (type === 'image') {
        return `<img src="${sanitizedUrl}" alt="Image" class="max-w-full rounded-lg my-2" loading="lazy" />`
      } else if (type === 'video') {
        if (url.includes('youtube.com/embed/')) {
          return `<iframe src="${sanitizedUrl}" class="w-full aspect-video rounded-lg my-2" frameborder="0" allowfullscreen></iframe>`
        }
        return `<video src="${sanitizedUrl}" controls class="max-w-full rounded-lg my-2"></video>`
      }

      return match
    })
  }

  processMessage(rawMessage: string): string {
    const sanitized = this.sanitizeText(rawMessage)
    const withMedia = this.parseMediaPlaceholders(sanitized)
    return this.sanitizeHtml(withMedia)
  }
}

export const securityService = new SecurityService()
export default securityService
