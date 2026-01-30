# Triple Labs Landing Page - Implementation Plan

## Executive Summary

This plan addresses 14 requirements across 3 phases to transform a single-file HTML landing page into a production-ready, accessible, performant site. Total estimated effort: **34-42 story points** across **18 tasks**.

---

## Phase 1: Critical Bug Fixes (Blocking Issues)

**Goal:** Fix issues that prevent core functionality from working.
**Parallelization:** Tasks 1.1, 1.3, and 1.4 can run in parallel. Task 1.2 depends on 1.1.

### Task 1.1: Fix Navigation HTML Structure
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 214-221 |
| **Dependencies** | None |

**Problem Diagnosed:**
The navigation anchor tags are malformed. At line 214-221:
```html
<a href="#" class="flex items-center gap-2 group mr-8">
</a><a href="/" class="inline-block">
    <img src="..." alt="Logo" ...>
</a>
<span class="font-serif text-lg ...">Triple Labs</span>
```

The first `<a>` tag is empty and immediately closed. The logo image is in a separate anchor. The "Triple Labs" text span is outside any anchor, so it is not clickable and not associated with the logo.

**Recommended Fix:**
- Remove the empty `<a>` tag on line 214-215
- Wrap both the logo `<img>` AND the "Triple Labs" `<span>` inside a single `<a href="/">` element
- Ensure the `group` class is on that combined anchor for hover effects

**Verification:**
- Visual: Logo and text should be side-by-side, both clickable
- Accessibility: Screen reader should announce "Triple Labs, link" once (not as separate elements)
- HTML validator: Zero errors in nav region

---

### Task 1.2: Fix Navigation Anchor (#philosophy)
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 225-226, 458 |
| **Dependencies** | Task 1.1 |

**Problem Diagnosed:**
Navigation links to `#philosophy` (lines 225, 1040) but no element has `id="philosophy"`. The closest semantic match is `id="problem"` at line 458.

**Recommended Fix (Option A - Preferred):**
Add `id="philosophy"` to the Problem section at line 458:
```html
<section id="problem" class="py-24 px-4 md:px-6 max-w-7xl mx-auto">
```
becomes:
```html
<section id="philosophy" class="py-24 px-4 md:px-6 max-w-7xl mx-auto">
```

Then update the hero CTA button at line 442 from `href="#problem"` to `href="#philosophy"`.

**Verification:**
- Click "Philosophy" in nav - should scroll to the bento grid section
- All `#philosophy` links resolve (grep should show 2 matches, both functional)

---

### Task 1.3: Remove Scroll Hijacking
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 1212-1214, 1230-1231 |
| **Dependencies** | None |

**Problem Diagnosed:**
Lines 1212-1214 add event listeners that call `preventDefault()` on wheel and touchmove events during smooth scroll animation. This blocks ALL scrolling (keyboard arrows, trackpad, touch) until animation completes.

```javascript
window.addEventListener("wheel", preventScroll, { passive: false });
window.addEventListener("touchmove", preventScroll, { passive: false });
```

**Recommended Fix:**
Delete lines 1212-1214 and lines 1230-1231 (the corresponding `removeEventListener` calls). The smooth scroll animation will still work; users will simply be able to interrupt it with their own scroll input (which is expected behavior).

**Verification:**
- Click anchor link - smooth scroll begins
- During scroll animation, use scroll wheel - native scroll should work
- Touch devices: swipe should scroll normally at all times

---

### Task 1.4: Make Newsletter Forms Functional
| Attribute | Value |
|-----------|-------|
| **Complexity** | MEDIUM |
| **Effort** | 5 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 937-943 (hero form), 1006-1022 (footer form) |
| **Dependencies** | None |

**Problem Diagnosed:**
1. Hero form button at line 940-942 uses `type="button"` instead of `type="submit"`
2. Neither form has an `action` attribute (required for Formspree)
3. No client-side validation feedback
4. No loading/success states

**Recommended Fix:**
1. Change `type="button"` to `type="submit"` at line 940
2. Add Formspree action to both forms: `action="https://formspree.io/f/{FORM_ID}" method="POST"`
3. Add `name="email"` attribute to email inputs
4. Add accessible labels with `for`/`id` association
5. Add client-side validation JS (~20 lines):
   - Validate email format on submit
   - Show loading state ("Submitting...")
   - Show success message after submission
   - Show error message for invalid email

**Verification:**
- Submit empty form - validation error appears
- Submit invalid email - validation error appears
- Submit valid email - loading state, then success message
- Check Formspree dashboard for received submission

---

### Task 1.5: Add Mobile Navigation Menu
| Attribute | Value |
|-----------|-------|
| **Complexity** | MEDIUM |
| **Effort** | 5 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 212-245 (navigation region) |
| **Dependencies** | Task 1.1 |

**Problem Diagnosed:**
Desktop nav links are hidden on mobile (`hidden md:flex` at line 224). No hamburger button exists for mobile users to access navigation.

**Recommended Fix:**
1. Add hamburger button before the desktop nav:
   ```html
   <button type="button" class="md:hidden p-2"
           aria-expanded="false"
           aria-controls="mobile-nav"
           aria-label="Toggle navigation menu">
       <!-- 3-line hamburger icon SVG -->
   </button>
   ```
2. Add mobile menu panel (hidden by default):
   ```html
   <nav id="mobile-nav" class="hidden fixed inset-x-0 top-20 ..."
        aria-label="Mobile navigation">
       <!-- Same links as desktop -->
   </nav>
   ```
3. Add JS to toggle menu visibility and update `aria-expanded`
4. Add focus trap when menu is open
5. Close menu on Escape key or click outside

**Verification:**
- Viewport < 768px: hamburger visible, desktop links hidden
- Click hamburger: menu slides/fades in, `aria-expanded="true"`
- Tab through menu: focus stays within menu
- Press Escape: menu closes
- Click outside menu: menu closes

---

## Phase 2: High Priority (Core Requirements)

**Goal:** Improve accessibility, SEO, and prepare for production deployment.
**Parallelization:** Tasks 2.1-2.4 can all run in parallel.

### Task 2.1: Replace Tailwind CDN with Build Process
| Attribute | Value |
|-----------|-------|
| **Complexity** | MEDIUM |
| **Effort** | 5 SP |
| **Files to Create** | `package.json`, `tailwind.config.js`, `src/input.css`, `.gitignore` |
| **File to Modify** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 23 (CDN script), 25-61 (inline config), 63-173 (inline CSS) |
| **Dependencies** | None |

**Current State:**
- Line 23: Tailwind CDN (~384KB runtime)
- Lines 25-61: Inline `tailwind.config` object
- Lines 63-173: Inline `<style>` block with custom CSS

**Recommended Fix:**
1. Create `package.json`:
   ```json
   {
     "name": "triplelabs-site",
     "scripts": {
       "dev": "npx tailwindcss -i ./src/input.css -o ./dist/styles.css --watch",
       "build": "npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify && cp index.html dist/ && cp favicon.svg dist/"
     },
     "devDependencies": {
       "tailwindcss": "^3.4.0"
     }
   }
   ```
2. Create `tailwind.config.js` by extracting lines 26-60
3. Create `src/input.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   /* Extract lines 64-172 here */
   ```
4. Create `.gitignore`: `node_modules/`, `dist/`
5. In `index.html`:
   - Remove line 23 (CDN script)
   - Remove lines 25-61 (inline config)
   - Remove lines 63-173 (inline style)
   - Add `<link rel="stylesheet" href="styles.css">` in `<head>`

**Verification:**
- `npm run build` completes without errors
- `dist/styles.css` exists and is < 20KB
- Page renders identically to before
- All Tailwind classes still work

---

### Task 2.2: Add Accessibility Features
| Attribute | Value |
|-----------|-------|
| **Complexity** | MEDIUM |
| **Effort** | 3 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Dependencies** | None |

**Issues to Fix:**

1. **No `<main>` landmark** - Screen readers cannot identify main content
2. **No skip link** - Keyboard users must tab through entire nav
3. **Form labels missing proper `id` association** - Footer form has label but hero form does not
4. **Decorative SVGs not hidden** - Should have `aria-hidden="true"`
5. **No visible focus indicators** - Default browser outline may be hidden

**Recommended Fixes:**
1. Add skip link at top of `<body>`:
   ```html
   <a href="#main-content" class="sr-only focus:not-sr-only ...">
       Skip to main content
   </a>
   ```
2. Wrap content (after header, before footer) in `<main id="main-content">`
3. Add `id` to hero form email input, add `<label for="..." class="sr-only">`
4. Add `aria-hidden="true"` to all decorative SVGs (icons that are next to text)
5. Add CSS focus-visible styles:
   ```css
   :focus-visible {
       outline: 2px solid #FF3D00;
       outline-offset: 2px;
   }
   ```

**Verification:**
- axe DevTools: Zero critical/serious violations
- Tab from top of page: skip link appears on first tab
- Activate skip link: focus moves to main content
- Tab through all interactive elements: visible focus ring

---

### Task 2.3: Add SEO Meta Tags
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 2 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | Insert after line 10 (after favicon link) |
| **Dependencies** | None |

**Missing Tags:**
- Open Graph (og:type, og:url, og:title, og:description, og:image)
- Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image)
- Canonical URL
- JSON-LD structured data

**Recommended Fix:**
Add the following after line 10:
```html
<link rel="canonical" href="https://triplelabs.com/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://triplelabs.com/">
<meta property="og:title" content="Triple Labs | Open, Simple, Calm">
<meta property="og:description" content="Open-source tools built for clarity, not complexity.">
<meta property="og:image" content="https://triplelabs.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Triple Labs | Open, Simple, Calm">
<meta name="twitter:description" content="Open-source tools built for clarity, not complexity.">
<meta name="twitter:image" content="https://triplelabs.com/og-image.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Triple Labs",
  "url": "https://triplelabs.com",
  "logo": "https://triplelabs.com/logo.png",
  "description": "Open-source tools built for clarity, not complexity."
}
</script>
```

**Note:** OG image (`og-image.png`) must be created separately (out of scope per spec).

**Verification:**
- Facebook Sharing Debugger: Shows correct preview
- Twitter Card Validator: Shows correct preview
- Google Rich Results Test: JSON-LD validates

---

### Task 2.4: Fix Color Contrast
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` (or `tailwind.config.js` after Task 2.1) |
| **Lines** | 38 (inline config) |
| **Dependencies** | None (but if Task 2.1 is done first, edit `tailwind.config.js`) |

**Problem Diagnosed:**
`text-muted` color is `#888888` (line 38). Against `#0a0a0a` background, contrast ratio is approximately 4.04:1, which fails WCAG AA (requires 4.5:1 for normal text).

**Recommended Fix:**
Change `#888888` to `#999999` (contrast ratio ~4.65:1, passes AA).

**Verification:**
- WebAIM Contrast Checker: `#999999` on `#0a0a0a` = 4.65:1 (AA pass)
- axe DevTools: Zero contrast violations
- Visual check: Text still readable and aesthetically consistent

---

## Phase 3: Enhancements (Performance and UX)

**Goal:** Optimize performance, add polish, add FAQ section.
**Parallelization:** Tasks 3.1-3.5 can all run in parallel. Task 3.6 is standalone.

### Task 3.1: Add Responsive Images with srcset
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 2 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Dependencies** | None |

**Images to Update:**
- Line 216-217: Logo (Cloudinary)
- Line 820-822: Team member 1 (Unsplash)
- Line 833-835: Team member 2 (Unsplash)
- Line 846-848: Team member 3 (Unsplash)
- Line 865-867: Blog background (Unsplash)
- Line 895-897: Community background (Unsplash)
- Line 993-994: Footer logo (Cloudinary)

**Recommended Fix:**
Add `srcset` and `sizes` attributes. Example for team images:
```html
<img src="https://images.unsplash.com/photo-...?w=300"
     srcset="https://images.unsplash.com/photo-...?w=160 160w,
             https://images.unsplash.com/photo-...?w=320 320w"
     sizes="160px"
     ...>
```

**Verification:**
- DevTools Network tab: Smaller image served on mobile
- Lighthouse: No "Properly size images" warning

---

### Task 3.2: Optimize Cloudinary Images
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 216, 993 |
| **Dependencies** | None |

**Current URLs:**
```
https://res.cloudinary.com/dyoyo7dcd/image/upload/v1767094689/logo_vibje2.png
```

**Recommended Fix:**
Add `f_auto,q_auto` transforms:
```
https://res.cloudinary.com/dyoyo7dcd/image/upload/f_auto,q_auto/v1767094689/logo_vibje2.png
```

This enables automatic format selection (WebP/AVIF where supported) and quality optimization.

**Verification:**
- Request logo in Chrome: Response should be WebP
- Image file size should be smaller than original PNG

---

### Task 3.3: Add Preload Hints for Critical Resources
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | Insert in `<head>` after resource hints (line 15) |
| **Dependencies** | None |

**Recommended Fix:**
```html
<link rel="preload" href="https://fonts.gstatic.com/s/instrumentserif/..."
      as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://res.cloudinary.com/.../logo_vibje2.png"
      as="image">
```

**Note:** Exact font URL must be extracted from Google Fonts CSS.

**Verification:**
- DevTools Network: Fonts and logo load with high priority
- Lighthouse: "Preload key requests" audit passes

---

### Task 3.4: Add Reduced Motion Support
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` (or `src/input.css` after Task 2.1) |
| **Dependencies** | None |

**Current Animations:**
- `animate-spin-slow` (line 48)
- `animate-float` (line 49)
- `animate-pulse-slow` (line 50)
- Various `transition-*` effects

**Recommended Fix:**
Add to CSS:
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Verification:**
- macOS: System Preferences > Accessibility > Display > Reduce motion ON
- Reload page: All animations should be effectively disabled
- Functionality preserved (elements still appear, just without animation)

---

### Task 3.5: Throttle Mousemove Handler
| Attribute | Value |
|-----------|-------|
| **Complexity** | LOW |
| **Effort** | 1 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | 1169-1178 |
| **Dependencies** | None |

**Problem Diagnosed:**
Mousemove handler fires on every mouse movement (can be 60+ times per second). This updates CSS custom properties and triggers repaints.

```javascript
card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    // ... updates --mouse-x, --mouse-y
});
```

**Recommended Fix:**
Wrap in `requestAnimationFrame` to limit to one update per frame:
```javascript
let rafId = null;
card.addEventListener('mousemove', e => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        rafId = null;
    });
});
```

**Verification:**
- DevTools Performance: Fewer "Recalculate Style" events during hover
- Visual effect still works smoothly

---

### Task 3.6: Add FAQ Section
| Attribute | Value |
|-----------|-------|
| **Complexity** | MEDIUM |
| **Effort** | 3 SP |
| **File** | `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` |
| **Lines** | Insert after newsletter section (line 954), before contact section |
| **Dependencies** | None |

**Recommended Implementation:**
Use native `<details>` and `<summary>` elements for accessibility:
```html
<section id="faq" class="py-24 px-6 max-w-4xl mx-auto">
    <h2 class="text-4xl font-serif mb-12 text-center">Frequently Asked Questions</h2>

    <div class="space-y-4">
        <details class="glass-panel rounded-xl p-6 group">
            <summary class="cursor-pointer flex justify-between items-center font-medium">
                When will the products launch?
                <span class="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p class="mt-4 text-text-muted">
                We're currently in alpha and targeting a 2026 release for Editor and Layouts.
            </p>
        </details>

        <!-- Additional FAQ items -->
    </div>
</section>
```

**Suggested FAQ Content (based on page context):**
1. "When will the products launch?" - 2026 target
2. "Is everything really open source?" - Yes, MIT license
3. "How do I get early access?" - Sign up for newsletter
4. "Can I contribute?" - Yes, GitHub contributions welcome
5. "What's your pricing model?" - Free for individuals, enterprise tiers coming

**Verification:**
- Click summary: Content expands/collapses
- Keyboard: Enter/Space toggles open state
- Screen reader: Announces "collapsed"/"expanded" state
- Visual: Chevron rotates on open

---

## Dependency Graph

```
Phase 1 (Critical):
    1.1 (Nav HTML) ─┬─> 1.2 (Fix #philosophy)
                    └─> 1.5 (Mobile Nav)
    1.3 (Scroll Hijack) ──> [No deps]
    1.4 (Forms) ──────────> [No deps]

Phase 2 (High Priority):
    2.1 (Tailwind Build) ──> [No deps]
    2.2 (Accessibility) ───> [No deps]
    2.3 (SEO Tags) ────────> [No deps]
    2.4 (Contrast) ────────> [No deps]

Phase 3 (Enhancements):
    3.1 (Responsive Images) ──> [No deps]
    3.2 (Cloudinary Optimize) ─> [No deps]
    3.3 (Preload Hints) ──────> [No deps]
    3.4 (Reduced Motion) ─────> [No deps]
    3.5 (Throttle Mousemove) ──> [No deps]
    3.6 (FAQ Section) ────────> [No deps]
```

---

## Effort Summary

| Phase | Tasks | Story Points | Parallelizable |
|-------|-------|--------------|----------------|
| Phase 1 | 5 | 13 SP | 3 parallel tracks |
| Phase 2 | 4 | 11 SP | Fully parallel |
| Phase 3 | 6 | 9-10 SP | Fully parallel |
| **Total** | **15** | **33-34 SP** | - |

---

## Verification Checklist (Success Criteria)

### Functional
- [ ] All navigation links resolve to existing anchors
- [ ] Mobile navigation opens/closes correctly with keyboard/touch
- [ ] Forms submit successfully to Formspree
- [ ] Form validation shows errors for invalid input
- [ ] Native scroll works immediately (no hijacking)

### Performance
- [ ] Lighthouse Performance >= 90
- [ ] LCP < 2.5s on 4G throttled
- [ ] CSS file size < 20KB (purged Tailwind)
- [ ] Total page weight < 500KB

### Accessibility
- [ ] Lighthouse Accessibility >= 95
- [ ] Zero critical axe-core violations
- [ ] Skip link appears and works
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast passes WCAG AA

### SEO
- [ ] Lighthouse SEO >= 95
- [ ] OG preview works (Facebook Debugger)
- [ ] Twitter Card preview works
- [ ] JSON-LD validates (Google Rich Results)

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tailwind build produces different output | Medium | High | Test all pages visually before/after |
| Formspree free tier limit (50/mo) | Low | Medium | Monitor usage; upgrade if needed |
| `#999` contrast still fails on some monitors | Low | Low | Increase to `#aaa` if violations persist |
| UnicornStudio affects performance | Medium | Medium | Already deferred 2s; can remove if LCP fails |
| OG image missing | High | Low | Create placeholder or use logo |

---

## File Reference Summary

| File | Action | Notes |
|------|--------|-------|
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` | Modify | Primary changes |
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/package.json` | Create | Build scripts |
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/tailwind.config.js` | Create | Extracted config |
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/src/input.css` | Create | Tailwind directives + custom CSS |
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/.gitignore` | Create | Exclude node_modules, dist |
| `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/dist/` | Generate | Build output directory |
