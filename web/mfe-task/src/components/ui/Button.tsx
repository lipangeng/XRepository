import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button className={twMerge(clsx(base, variants[variant], sizes[size], className))} {...props}>
      {children}
    </button>
  )
}
