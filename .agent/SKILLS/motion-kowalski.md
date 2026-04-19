# Skill: Kowalski Motion (Premium Animations)

## Principles
- **No Linear Motion:** Never use `transition: all 0.3s linear`. It feels cheap.
- **Custom Easing:** Always use `cubic-bezier(0.16, 1, 0.3, 1)` (Out Expo) for entries and `cubic-bezier(0.34, 1.56, 0.64, 1)` for springy interactions.
- **Micro-Interactions:** Buttons should scale slightly `scale(0.98)` on press and expand `scale(1.02)` on hover.
- **Staggered Reveals:** When listing items (like Service Cards), animate them with a `100ms` delay between each card.

## Implementation Snippet (CSS)
```css
.premium-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.premium-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```
