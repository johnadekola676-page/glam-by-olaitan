# Skill: Design System and UI Patterns

## What This Covers
Setting up a design system from scratch, implementing UI component patterns,
working with design tokens, and building consistent interfaces.

## Design Token Setup (CSS Variables)
Always start with tokens — never hardcode colors or spacing.

```css
/* tokens.css */
:root {
  /* Colors */
  --color-primary: #0F172A;
  --color-primary-light: #1E293B;
  --color-accent: #6366F1;
  --color-accent-hover: #4F46E5;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-border: #E2E8F0;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Spacing (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Cal Sans', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
}
```

## Extracting Tokens From a Figma File

When reading a Figma design, extract into the token format above:

1. Find all Fill colors → map to –color-* variables
2. Find all Text styles → map to –text-* and –font-* variables
3. Find spacing values from Auto Layout → map to –space-* variables
4. Find corner radius values → map to –radius-* variables

## Component Patterns

### Button Component (React)

```jsx
const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled }) => {
  const variants = {
    primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
    ghost: 'text-[var(--color-accent)] hover:bg-[var(--color-surface)]'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[var(--radius-md)] font-medium transition-colors ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  )
}
```

### Card Component

```jsx
const Card = ({ children, className = '' }) => (
  <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] ${className}`}>
    {children}
  </div>
)
```

### Input Component

```jsx
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-[var(--color-text-primary)]">{label}</label>}
    <input
      className={`px-3 py-2 rounded-[var(--radius-md)] border text-[var(--color-text-primary)] bg-white outline-none transition-colors
        ${error
          ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
          : 'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20'
        }`}
      {...props}
    />
    {error && <span className="text-xs text-[var(--color-error)]">{error}</span>}
  </div>
)
```

## Responsive Layout System

```css
/* Mobile-first breakpoints */
/* sm: 640px — tablet portrait */
/* md: 768px — tablet landscape */
/* lg: 1024px — small desktop */
/* xl: 1280px — large desktop */

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { padding: 0 var(--space-6); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--space-8); }
}
```

## Typography Scale Usage

```css
h1 { font-size: var(--text-4xl); font-weight: 700; line-height: 1.15; }
h2 { font-size: var(--text-3xl); font-weight: 600; line-height: 1.25; }
h3 { font-size: var(--text-2xl); font-weight: 600; line-height: 1.3; }
h4 { font-size: var(--text-xl); font-weight: 500; }
p  { font-size: var(--text-base); line-height: 1.6; color: var(--color-text-secondary); }
```

## Dark Mode Setup

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-border: #334155;
    --color-text-primary: #F1F5F9;
    --color-text-secondary: #94A3B8;
  }
}
```
