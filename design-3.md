# FraudGraph UI Design Specification

## Purpose

Restyle the existing FraudGraph application using the supplied reference image as a **visual style reference only**.

The target aesthetic is:
- warm
- premium
- minimal
- soft
- modern
- analytical
- polished

Think premium productivity/analytics software rather than a dark cybersecurity dashboard.

## CRITICAL SCOPE

**Change ONLY visual design and interaction styling.**

Do NOT change:
- existing page content
- text or copy
- routes
- navigation items
- functionality
- API behavior
- authentication behavior
- GNN logic
- graph construction
- model behavior
- dataset
- backend
- component meaning
- information architecture

Do not add or remove product functionality.

Do not copy the reference image's HR content, layout, charts, people, labels, or components. Only reproduce its visual language.

---

# 1. Overall Visual Direction

Transform the current dark/cybersecurity-heavy appearance into a soft editorial AI analytics interface.

Target feeling:

> sophisticated + warm + intelligent + minimal + premium

Avoid:
- neon cyberpunk
- excessive blue glow
- excessive gradients
- heavy glassmorphism
- thick borders
- hard rectangular cards
- huge shadows
- excessive animations
- generic Bootstrap dashboard styling

Use generous whitespace, rounded surfaces, subtle depth, and restrained yellow accents.

---

# 2. Color System

## Background

Main:

```text
#EEF0F0
```

Use a very subtle warm ambient gradient:

```css
background:
  radial-gradient(circle at 85% 10%, rgba(255,216,77,0.16), transparent 35%),
  radial-gradient(circle at 15% 85%, rgba(255,255,255,0.8), transparent 40%),
  #EEF0F0;
```

Keep this extremely subtle.

## Surfaces

```text
Primary surface:   #F8F8F5
Secondary surface: #F2F2EE
Elevated surface:  #FFFFFF
```

Do not make everything pure white.

## Primary dark

```text
#292929
```

Hover:

```text
#1F1F1F
```

Use for primary buttons, active navigation, important controls, and strong visual anchors.

## Accent yellow

```text
Primary: #FFD84D
Soft:    #FFF0A8
```

Use yellow for selected, active, highlighted, or attention states.

Do not make every component yellow.

## Text

```text
Primary:   #171717
Secondary: #5E5E5E
Muted:     #858585
Disabled:  #A6A6A6
```

## Borders

```text
rgba(0,0,0,0.08)
```

Hover:

```text
rgba(0,0,0,0.14)
```

Borders should remain subtle.

## Fraud / Normal

Preserve the existing semantic meaning:

```text
Fraud:       #E94B4B
Fraud soft:  #FDE8E7

Normal:      #4A88E8
Normal soft: #EAF2FF

Selected:    #FFD84D
```

Do not rely on color alone; preserve existing labels such as Normal, Fraud, and Selected.

---

# 3. Main Container

Use a spacious centered layout.

```text
max-width: 1440px
margin: 0 auto
padding: 24px
```

At large screens:

```text
padding: 32px - 48px
```

The page should have visible breathing room around the main application.

---

# 4. Border Radius

Use the soft rounded geometry from the reference.

Main surfaces:

```text
24px - 32px
```

Cards:

```text
20px - 28px
```

Inputs:

```text
16px - 18px
```

Buttons and pills:

```text
999px
```

Avoid sharp corners.

---

# 5. Shadows

Use soft depth rather than dramatic shadows.

Card:

```css
box-shadow: 0 12px 40px rgba(0,0,0,0.06);
```

Hover:

```css
box-shadow: 0 18px 48px rgba(0,0,0,0.09);
```

Elevated:

```css
box-shadow: 0 8px 24px rgba(0,0,0,0.07);
```

No colored glow or heavy black shadows.

---

# 6. Navigation

Keep the existing navigation content exactly as it is.

Visually turn the navigation into a floating pill-shaped surface.

```text
background: rgba(255,255,255,0.72)
border: 1px solid rgba(0,0,0,0.05)
border-radius: 999px
backdrop-filter: blur(18px)
```

## Active navigation item

```text
background: #292929
color: #FFFFFF
border-radius: 999px
```

## Inactive hover

```text
background: rgba(0,0,0,0.05)
color: #171717
```

Optional:

```text
transform: translateY(-1px)
```

Transition:

```text
180ms - 220ms ease
```

Do not make navigation bounce or scale dramatically.

---

# 7. Buttons

## Primary

```text
background: #292929
color: #FFFFFF
border-radius: 999px
```

Hover:

```text
background: #1F1F1F
transform: translateY(-1px)
box-shadow: 0 8px 20px rgba(0,0,0,0.10)
```

Active:

```text
transform: translateY(0)
```

Transition:

```text
180ms ease
```

## Secondary

```text
background: rgba(255,255,255,0.65)
border: 1px solid rgba(0,0,0,0.08)
color: #292929
```

Hover:

```text
background: #FFFFFF
border-color: rgba(0,0,0,0.14)
transform: translateY(-1px)
```

---

# 8. Cards

Use:

```text
background: #F8F8F5
border-radius: 24px
border: 1px solid rgba(0,0,0,0.045)
padding: 24px - 32px
box-shadow: 0 10px 32px rgba(0,0,0,0.045)
```

Cards should feel soft and tactile.

## Interactive card hover

Only for interactive cards:

```text
transform: translateY(-3px)
box-shadow: 0 16px 40px rgba(0,0,0,0.08)
```

Transition:

```text
240ms cubic-bezier(0.22,1,0.36,1)
```

Do not animate static information cards.

---

# 9. Metric Cards

Keep all existing metrics and their values/content.

Only restyle them.

Use:
- large but not excessively bold numbers
- muted labels
- generous whitespace
- subtle surface differences
- soft rounded corners

Fraud metrics can have a very subtle warm red tint, but do not turn the entire card bright red.

---

# 10. Graph Container

Do not change the existing graph library, graph data, or graph behavior.

Only change its visual container.

Use:

```text
background: #F7F7F3
border-radius: 28px
border: 1px solid rgba(0,0,0,0.05)
box-shadow: 0 12px 36px rgba(0,0,0,0.045)
```

Do NOT put the graph inside a large dark rectangle.

---

# 11. Graph Nodes

Preserve the current semantics.

## Normal

```text
fill: #4A88E8
```

Subtle halo:

```css
filter: drop-shadow(0 2px 5px rgba(74,136,232,0.18));
```

## Fraud

```text
fill: #E94B4B
```

Subtle halo:

```css
filter: drop-shadow(0 2px 5px rgba(233,75,75,0.18));
```

## Selected

```text
stroke: #FFD84D
stroke-width: 3px
```

The selected node may have a very subtle pulse.

---

# 12. Graph Hover

On node hover:
- slightly increase node size
- increase brightness
- show pointer cursor
- show the existing/appropriate transaction tooltip
- subtly highlight connected edges

Use approximately:

```text
scale: 1.12
duration: 140ms
ease-out
```

Do not make nodes jump.

---

# 13. Graph Selection

When a node is selected:

1. Selected node gets a yellow ring.
2. Immediate neighbors get a subtle yellow/amber ring.
3. Connected edges become more visible.
4. Unrelated nodes become slightly less prominent.
5. Existing transaction inspector updates smoothly.

Use opacity transitions around:

```text
200ms - 300ms
```

This should visually reinforce:

```text
Selected transaction
        +
Neighbors
        ↓
GNN context
```

---

# 14. Transaction Inspector

Keep the existing content and functionality.

Only change presentation.

Use:

```text
background: #F8F8F5
border-radius: 24px
border: 1px solid rgba(0,0,0,0.045)
box-shadow: 0 10px 32px rgba(0,0,0,0.045)
```

Make the prediction visually dominant.

Fraud:
- soft red background
- red indicator

Normal:
- soft blue background
- blue indicator

Confidence should use a thin elegant progress indicator.

---

# 15. Progress Indicators

Use:

```text
height: 6px
border-radius: 999px
background: rgba(0,0,0,0.07)
```

Fill:
- yellow for general progress
- red for fraud risk
- blue for normal-related state

Animate the fill when first displayed.

```text
duration: 700ms
ease-out
```

---

# 16. Inputs

Use:

```text
background: rgba(255,255,255,0.75)
border: 1px solid rgba(0,0,0,0.08)
border-radius: 16px
```

Focus:

```text
border-color: #FFD84D
box-shadow: 0 0 0 3px rgba(255,216,77,0.18)
```

Transition:

```text
180ms ease
```

Avoid browser-default blue focus styling.

---

# 17. Landing Page Scroll Effects

Do not add or remove landing-page content.

Only style and animate existing sections.

On first viewport entry:

```text
opacity: 0
transform: translateY(24px)
```

to:

```text
opacity: 1
transform: translateY(0)
```

Duration:

```text 600ms
```

Easing:

```text cubic-bezier(0.22,1,0.36,1)
```

Use IntersectionObserver or the existing animation mechanism.

Trigger once rather than repeatedly.

---

# 18. Staggered Scroll Animation

For multiple cards/items appearing together:

```text
Item 1: 0ms
Item 2: 60ms
Item 3: 120ms
Item 4: 180ms
```

Keep the entire sequence quick.

The user should never have to wait for content to become readable.

---

# 19. Hero / Graph Ambient Animation

If the existing landing page has a graph visualization, preserve it.

Only change its styling.

Use subtle node motion:

```text
scale: 1 → 1.03
opacity: 0.9 → 1
```

Duration:

```text 2.5s - 4s
```

Use staggered delays.

Avoid large movement and particle effects.

---

# 20. Page Transitions

When changing routes:

```text
opacity: 0
transform: translateY(8px)
```

to:

```text
opacity: 1
transform: translateY(0)
```

Duration:

```text 250ms
```

Use a subtle transition only.

---

# 21. Sign-In Styling

Keep all current sign-in content and functionality.

Only restyle it.

Use:
- warm gray background
- floating light card
- large radius
- subtle shadow
- yellow accent
- charcoal primary button

The sign-in card may have a very subtle yellow ambient glow behind it:

```css
radial-gradient(
  circle,
  rgba(255,216,77,0.14),
  transparent 65%
)
```

Keep it understated.

---

# 22. Modal / Popover Animation

If already present:

Opening:

```text
opacity: 0 → 1
transform: scale(0.97) translateY(4px)
```

Closing:

```text
opacity: 1 → 0
transform: scale(0.98) translateY(4px)
```

Duration:

```text
160ms - 200ms
```

Use a soft backdrop, not an opaque black overlay.

---

# 23. Tooltips

Use:
- charcoal background
- white text
- rounded corners
- small shadow
- short appearance delay

Animation:

```text
opacity: 0
transform: translateY(3px)
```

to:

```text
opacity: 1
transform: translateY(0)
```

Duration:

```text 140ms
```

---

# 24. Loading States

Avoid generic spinning loaders everywhere.

Prefer:
- skeleton surfaces
- subtle shimmer
- softly pulsing graph nodes
- progressive metric appearance

Skeleton colors:

```text
#EEEEEA
#F7F7F3
```

Keep shimmer subtle.

---

# 25. Icon Hover

For existing icon buttons:

Default:

```text
background: transparent
```

Hover:

```text
background: rgba(0,0,0,0.06)
transform: scale(1.03)
```

Active:

```text
background: #292929
color: white
```

Keep transitions short.

---

# 26. Typography

Use the existing font if it is already suitable.

Otherwise use:

```text
Inter
```

or:

```text
Geist
```

Large headings:

```text
font-weight: 500 - 600
letter-spacing: -0.03em
```

Body:

```text
font-weight: 400
```

Labels:

```text
font-weight: 500
```

Avoid extremely heavy typography.

---

# 27. Scrollbar

Use a subtle scrollbar.

Track:

```text
#E4E5E3
```

Thumb:

```text
#B7B8B5
```

Hover:

```text
#989A96
```

Keep it thin.

---

# 28. Responsive Styling

Do not change information architecture.

Desktop:
- generous whitespace
- large rounded cards
- soft depth

Tablet:
- slightly reduced spacing

Mobile:
- preserve content
- stack existing areas naturally
- maintain rounded surfaces
- reduce padding

The graph must remain usable.

---

# 29. Motion System

Create centralized motion tokens if the project does not already have them:

```css
:root {
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 140ms;
  --duration-standard: 220ms;
  --duration-slow: 600ms;
}
```

Avoid dozens of unrelated animation timings.

---

# 30. Design Tokens

Create centralized variables if there is no existing design system:

```css
:root {
  --bg: #EEF0F0;

  --surface: #F8F8F5;
  --surface-elevated: #FFFFFF;
  --surface-muted: #F2F2EE;

  --text: #171717;
  --text-secondary: #5E5E5E;
  --text-muted: #858585;

  --dark: #292929;
  --dark-hover: #1F1F1F;

  --accent: #FFD84D;
  --accent-soft: #FFF0A8;

  --fraud: #E94B4B;
  --fraud-soft: #FDE8E7;

  --normal: #4A88E8;
  --normal-soft: #EAF2FF;

  --border: rgba(0,0,0,0.08);

  --radius-card: 24px;
  --radius-large: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 12px 40px rgba(0,0,0,0.06);
  --shadow-hover: 0 18px 48px rgba(0,0,0,0.09);
}
```

Use the tokens consistently instead of scattering arbitrary values.

---

# 31. Accessibility

Do not reduce accessibility while restyling.

Maintain:
- keyboard navigation
- visible focus states
- readable contrast
- semantic buttons
- accessible controls
- accessible graph interactions

Do not rely exclusively on red/blue/yellow.

Preserve text labels for states.

---

# 32. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable or greatly reduce:
- floating graph animation
- scroll reveal animation
- count-up animation
- large transitions
- node pulse

Functional state changes must still be obvious.

---

# 33. Strict "Do Not Change" List

Claude must NOT:

- rename the project
- change existing copy
- rewrite text
- add sections
- remove sections
- change routes
- change navigation labels
- change API endpoints
- change backend logic
- change GNN architecture
- change graph generation
- change model predictions
- change dataset handling
- change authentication logic
- replace working graph libraries
- invent metrics
- fabricate data
- add fake features
- alter the meaning of existing controls

Only change:
- colors
- backgrounds
- gradients
- borders
- shadows
- typography styling
- radii
- visual spacing refinements
- hover states
- focus states
- transitions
- scroll/reveal effects
- graph visual styling
- loading effects
- micro-interactions
- visual hierarchy

---

# 34. Reference Image Interpretation

The supplied reference should be treated as **visual inspiration only**.

Reproduce these visual characteristics:

1. Large rounded surfaces.
2. Warm cream/off-white background.
3. Soft gray surrounding canvas.
4. Subtle yellow ambient lighting.
5. Charcoal active controls.
6. Pill-shaped navigation.
7. Large rounded cards.
8. Very soft shadows.
9. Minimal borders.
10. Generous whitespace.
11. Light modern typography.
12. Yellow used selectively.
13. Small smooth hover interactions.
14. Subtle motion.
15. Premium productivity-dashboard feeling.

Do not copy its content or layout.

FraudGraph must remain clearly a **GNN fraud detection application**.

---

# 35. Final Acceptance Criteria

The redesign is successful when:

- Existing functionality still works.
- Existing content remains unchanged.
- The application feels substantially more polished.
- The old dark/cybersecurity visual style is replaced by the warm premium aesthetic.
- Cards feel soft and elevated.
- Navigation feels like a floating pill.
- Yellow is a controlled accent.
- Fraud and normal colors remain clear.
- Graph nodes remain readable.
- Selected graph neighborhoods remain visually clear.
- Hover states feel responsive.
- Scroll animations feel smooth.
- Page transitions feel polished.
- Loading states feel intentional.
- The UI is not over-animated.
- The design remains accessible.
- All three pages feel like the same product.

## Guiding principle

> **Do not change what FraudGraph does. Change how it feels to use.**
