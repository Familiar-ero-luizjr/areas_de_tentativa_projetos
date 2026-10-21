/** Referências aos tokens CSS: uma única fonte para globals.css e styled-components. */
export const theme = {
  colors: {
    primary: 'var(--aj-color-primary)',
    primaryDeep: 'var(--aj-color-primary-deep)',
    accent: 'var(--aj-color-accent)',
    background: 'var(--aj-color-background)',
    surface: 'var(--aj-color-surface)',
    text: 'var(--aj-color-text)',
    muted: 'var(--aj-color-muted)',
    border: 'var(--aj-color-border)',
    success: 'var(--aj-color-success)',
    danger: 'var(--aj-color-danger)',
  },
  radius: { card: 'var(--aj-radius-card)', button: 'var(--aj-radius-button)' },
  shadow: 'var(--aj-shadow-card)',
} as const;
