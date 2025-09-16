import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('deve renderizar com texto', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('deve aplicar variantes corretas', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })

  it('deve aplicar tamanhos corretos', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByText('Large Button')
    expect(button).toHaveClass('h-11')
  })

  it('deve desabilitar quando disabled', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('deve executar onClick', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve não executar onClick quando disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled Click</Button>)
    
    fireEvent.click(screen.getByText('Disabled Click'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('deve renderizar como Slot quando asChild=true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('deve aplicar className customizada', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })

  it('deve aplicar todas as variantes corretamente', () => {
    const variants = [
      { variant: 'default', expectedClass: 'bg-primary' },
      { variant: 'destructive', expectedClass: 'bg-destructive' },
      { variant: 'outline', expectedClass: 'border' },
      { variant: 'secondary', expectedClass: 'bg-secondary' },
      { variant: 'ghost', expectedClass: 'hover:bg-accent' },
      { variant: 'link', expectedClass: 'text-primary' }
    ]

    variants.forEach(({ variant, expectedClass }) => {
      const { unmount } = render(
        <Button variant={variant as any}>{variant} Button</Button>
      )
      
      const button = screen.getByText(`${variant} Button`)
      expect(button).toHaveClass(expectedClass)
      
      unmount()
    })
  })

  it('deve aplicar todos os tamanhos corretamente', () => {
    const sizes = [
      { size: 'default', expectedClass: 'h-10' },
      { size: 'sm', expectedClass: 'h-9' },
      { size: 'lg', expectedClass: 'h-11' },
      { size: 'icon', expectedClass: 'h-10', expectedWidth: 'w-10' }
    ]

    sizes.forEach(({ size, expectedClass, expectedWidth }) => {
      const { unmount } = render(
        <Button size={size as any}>{size} Button</Button>
      )
      
      const button = screen.getByText(`${size} Button`)
      expect(button).toHaveClass(expectedClass)
      if (expectedWidth) {
        expect(button).toHaveClass(expectedWidth)
      }
      
      unmount()
    })
  })

  it('deve passar props HTML corretamente', () => {
    render(
      <Button 
        type="submit" 
        data-testid="submit-button"
        aria-label="Submit form"
      >
        Submit
      </Button>
    )
    
    const button = screen.getByTestId('submit-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })

  it('deve focar corretamente', () => {
    render(<Button>Focusable Button</Button>)
    const button = screen.getByText('Focusable Button')
    
    button.focus()
    expect(button).toHaveFocus()
  })

  it('deve ter role button por padrão', () => {
    render(<Button>Button</Button>)
    const button = screen.getByRole('button', { name: 'Button' })
    expect(button).toBeInTheDocument()
  })

  it('deve aplicar classes de foco corretamente', () => {
    render(<Button>Focus Button</Button>)
    const button = screen.getByText('Focus Button')
    
    expect(button).toHaveClass('focus-visible:outline-none')
    expect(button).toHaveClass('focus-visible:ring-2')
    expect(button).toHaveClass('focus-visible:ring-ring')
  })

  it('deve aplicar classes de transição', () => {
    render(<Button>Transition Button</Button>)
    const button = screen.getByText('Transition Button')
    
    expect(button).toHaveClass('transition-colors')
  })

  it('deve renderizar ícones corretamente', () => {
    render(
      <Button>
        <svg data-testid="icon" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Button with Icon
      </Button>
    )
    
    const icon = screen.getByTestId('icon')
    // As classes são aplicadas via CSS selector [&_svg], então verificamos se o ícone está presente
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
  })
})
