interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export function Loading({ size = 'md', message }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full`}
        />
        <div
          className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
        />
      </div>
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  )
}
