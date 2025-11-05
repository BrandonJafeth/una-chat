import { z } from 'zod'
import { MAX_MESSAGE_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from './constants'

export const messageSchema = z.object({
  nombre: z
    .string()
    .min(MIN_USERNAME_LENGTH, 'Username must be at least 3 characters')
    .max(MAX_USERNAME_LENGTH, 'Username must be less than 50 characters'),
  mensaje: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, 'Message is too long'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
})

export type MessageInput = z.infer<typeof messageSchema>

export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(color)
}
