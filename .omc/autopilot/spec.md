# Triple Labs Landing Page - Complete Specification

## Project Overview

Fix and complete the Triple Labs landing page (single-file static HTML site) by addressing critical bugs, adding SEO/accessibility features, optimizing performance, and implementing missing functionality.

---

## Requirements Analysis

### Functional Requirements

#### Critical Fixes
1. **Fix Navigation HTML Structure** (index.html:214-221)
   - Repair malformed/unclosed anchor tags
   - Ensure logo and text are properly linked

2. **Mobile Navigation Menu**
   - Add hamburger menu for mobile viewports (< 768px)
   - Implement slide-out or dropdown navigation
   - Ensure keyboard accessibility and focus management

3. **Functional Newsletter Forms**
   - Fix submission mechanism (currently `type="button"`)
   - Add email validation (client-side)
   - Integrate with form service (Formspree or Netlify Forms)
   - Show loading and success states

4. **Remove Scroll Hijacking** (index.html:1213-1214)
   - Delete `wheel` and `touchmove` event prevention
   - Allow native scroll behavior

5. **Accessibility Improvements**
   - Add `<main>` landmark with `id="main-content"`
   - Add skip navigation link
   - Add `aria-hidden="true"` to decorative SVGs
   - Add proper form labels with `id` association
   - Add visible focus indicators

6. **Fix Navigation Anchor** (#philosophy)
   - Either point to existing `#problem` section or add `id="philosophy"` to appropriate section

#### SEO & Meta Tags
1. **Open Graph Tags** - title, description, image, url, type
2. **Twitter Card Tags** - card type, title, description, image
3. **Canonical URL** - `<link rel="canonical">`
4. **JSON-LD Structured Data** - Organization schema
5. **Optimize Meta Description** - Ensure it's compelling and within 155-160 characters

#### Performance Optimizations
1. **Replace Tailwind CDN** - Build with Tailwind CLI, purge unused styles
2. **Responsive Images** - Add `srcset` for multiple breakpoints
3. **Optimize Cloudinary** - Add `f_auto,q_auto` to image URLs
4. **Preload Critical Resources** - Fonts, above-fold images
5. **Reduced Motion Support** - Add `prefers-reduced-motion` media query
6. **Throttle Mousemove** - Use requestAnimationFrame for bento card hover effect

#### Missing Features
1. **FAQ Section** - Add collapsible accordion with common questions
2. **Mobile-Responsive Navigation** - Already covered under critical fixes
3. **Form UX Improvements** - Loading states, validation feedback, success messages
4. **Fix Color Contrast** - Adjust `text-muted` from #888 to #999 for WCAG AA compliance

### Non-Functional Requirements

#### Performance Targets
- **Lighthouse Performance Score:** 90+
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Total Page Weight:** < 500KB (including images)

#### Accessibility Standards
- **WCAG 2.1 Level AA Compliance**
- **Lighthouse Accessibility Score:** 95+
- **Zero Critical/Serious axe-core Violations**
- Keyboard-only navigation must work
- Screen reader compatibility

#### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge) - latest 2 versions
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for JavaScript-disabled users

#### SEO Targets
- **Lighthouse SEO Score:** 95+
- Valid Open Graph and Twitter Card markup
- Valid JSON-LD structured data (per Google Rich Results Test)

### Implicit Requirements

1. **Build Process Simplicity** - Avoid over-engineering; prefer npm scripts over bundlers
2. **Zero Backend Initially** - Use static form service (Formspree/Netlify Forms)
3. **Deployment Flexibility** - Must work on any static host (Netlify, Vercel, GitHub Pages, S3)
4. **Developer Experience** - Simple `npm run dev` and `npm run build` commands
5. **Mobile-First Responsive** - Already partially implemented; ensure all new features are responsive
6. **Error Handling** - Graceful degradation for image load failures, form errors
7. **Loading States** - Visual feedback during async operations (form submission)
8. **GDPR Compliance** - Form service must handle data properly

### Out of Scope

1. **Backend Development** - No custom API or server
2. **Content Changes** - Not redesigning sections or changing copy (except for FAQ which is new)
3. **New Product Features** - Not adding functionality beyond the landing page fixes
4. **Analytics Integration** - Not adding GA, Mixpanel, etc. (can be added separately)
5. **A/B Testing** - Not implementing experimentation framework
6. **CMS Integration** - Remains static HTML
7. **Internationalization** - English only
8. **Blog Functionality** - "Coming Soon" blog section remains placeholder

---

## Technical Specification

### Tech Stack

#### Current State
- **HTML5** - Single-file structure with inline styles/scripts
- **Tailwind CSS** - CDN version (384KB runtime, not production-ready)
- **Vanilla JavaScript** - ~100 lines inline
- **Google Fonts** - Instrument Serif + Inter
- **UnicornStudio** - Background animation (deferred 2s)
- **Cloudinary/Unsplash** - Image hosting

#### Proposed Modifications

| Component | Change | Rationale |
|-----------|--------|-----------|
| **Tailwind CSS** | CDN → Tailwind CLI with purge | Reduce from 384KB to ~10-15KB |
| **Build Process** | Add npm scripts (no bundler) | Simple, minimal complexity |
| **Form Handling** | Add Formspree integration | Zero backend, GDPR-friendly |
| **Validation** | Native HTML5 + lightweight JS | No library needed (~20 lines) |
| **CSS/JS** | Extract from inline to files | Better caching, maintainability |

### Architecture

```
Source Files                    Build Process                Output (dist/)
─────────────                   ─────────────                ──────────────
index.html          →           Copy + update links    →     index.html
src/input.css       →           Tailwind CLI purge     →     styles.css (~12KB)
tailwind.config.js                                           favicon.svg
```

**Key Decision:** Preserve single-file concept but split for build. No bundler (Webpack/Vite) needed.

### File Structure

```
triplelabs-site/
├── index.html              # Source HTML (modified)
├── favicon.svg             # Existing
├── tailwind.config.js      # NEW: Extracted Tailwind config
├── src/
│   └── input.css           # NEW: Tailwind directives + custom CSS
├── dist/                   # NEW: Build output
│   ├── index.html          # Production HTML
│   └── styles.css          # Purged CSS (~10-15KB)
├── package.json            # NEW: Build scripts
└── .gitignore              # NEW: node_modules/, dist/
```

### Dependencies

**Development Only:**
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.x"
  }
}
```

**External Services (Zero Install):**
- **Formspree** - Form handling (free tier: 50 submissions/month)
- **Google Fonts** - Typography (already integrated)
- **UnicornStudio** - Animation (already integrated)

### Build Process

```json
{
  "scripts": {
    "dev": "npx tailwindcss -i ./src/input.css -o ./dist/styles.css --watch",
    "build": "npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify && cp index.html dist/ && cp favicon.svg dist/"
  }
}
```

**Output Sizes:**
- Tailwind CSS: 384KB (CDN) → **10-15KB** (purged)
- HTML: ~50KB → **~48KB** (inline CSS removed)
- Total: ~440KB → **~60-70KB**

### Form Integration

**Formspree Approach:**

```html
<form action="https://formspree.io/f/{FORM_ID}" method="POST" id="newsletter-form">
    <label for="newsletter-email" class="sr-only">Email address</label>
    <input type="email"
           id="newsletter-email"
           name="email"
           required
           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
           aria-label="Email address"
           aria-describedby="email-error">
    <button type="submit">Notify me</button>
    <span id="email-error" class="sr-only" aria-live="polite"></span>
</form>
```

**Client-Side Validation (Vanilla JS):**
```javascript
// ~20 lines of validation + loading state handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        const email = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');

        if (!email.validity.valid) {
            e.preventDefault();
            email.classList.add('border-red-500');
            return;
        }

        button.disabled = true;
        button.textContent = 'Submitting...';
        // Form submits naturally to Formspree
    });
});
```

### Performance Optimizations

#### Critical Path
1. **Remove Tailwind CDN** (index.html:23) → Save 200-400ms render time
2. **Preload fonts** → Reduce font flash
3. **Add `fetchpriority="high"` to hero image** → Improve LCP

#### Images
```html
<!-- Before -->
<img src="https://res.cloudinary.com/.../logo.png">

<!-- After -->
<img src="https://res.cloudinary.com/.../logo"
     srcset="https://res.cloudinary.com/.../logo?w=300 300w,
             https://res.cloudinary.com/.../logo?w=600 600w"
     sizes="(max-width: 768px) 100vw, 300px"
     loading="lazy"
     decoding="async">
```

Apply Cloudinary transforms: `f_auto,q_auto` for automatic format selection (WebP/AVIF).

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    .animate-spin-slow,
    .animate-float,
    .animate-pulse-slow {
        animation: none;
    }
}
```

### Accessibility Implementation

#### Skip Link (Add at top of `<body>`)
```html
<a href="#main-content"
   class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">
    Skip to main content
</a>
```

#### Mobile Navigation
```html
<!-- Hamburger button (visible on mobile) -->
<button type="button"
        class="md:hidden"
        aria-expanded="false"
        aria-controls="mobile-nav"
        aria-label="Toggle navigation">
    <!-- Hamburger icon SVG -->
</button>

<!-- Mobile menu (hidden by default) -->
<nav id="mobile-nav" class="hidden md:flex" aria-label="Main navigation">
    <a href="#philosophy">Philosophy</a>
    <a href="#products">Products</a>
    <a href="#opensource">Open Source</a>
</nav>
```

#### Focus Indicators
```css
:focus-visible {
    outline: 2px solid #FF3D00;
    outline-offset: 2px;
}
```

#### Color Contrast Fix
```javascript
// In Tailwind config
colors: {
    'text-muted': '#999999' // Changed from #888888 for WCAG AA (4.65:1 ratio)
}
```

### SEO Implementation

```html
<!-- Canonical -->
<link rel="canonical" href="https://triplelabs.com/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://triplelabs.com/">
<meta property="og:title" content="Triple Labs | Open, Simple, Calm">
<meta property="og:description" content="Open-source tools built for clarity, not complexity.">
<meta property="og:image" content="https://triplelabs.com/og-image.png">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Triple Labs | Open, Simple, Calm">
<meta name="twitter:description" content="Open-source tools built for clarity, not complexity.">
<meta name="twitter:image" content="https://triplelabs.com/og-image.png">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Triple Labs",
  "url": "https://triplelabs.com",
  "logo": "https://triplelabs.com/logo.png",
  "description": "Open-source tools built for clarity, not complexity.",
  "sameAs": [
    "https://github.com/triple-labs",
    "https://twitter.com/triplelabs"
  ]
}
</script>
```

### FAQ Section

Add after newsletter section (before footer):

```html
<section class="relative py-24" id="faq">
    <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-4xl font-serif mb-12">Frequently Asked Questions</h2>

        <!-- Accordion items -->
        <details class="group mb-4 glass-panel rounded-xl p-6">
            <summary class="cursor-pointer font-medium">
                When will the products launch?
                <span class="float-right group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p class="mt-4 text-text-muted">
                We're currently in alpha and targeting a 2026 release for Editor and Layouts.
            </p>
        </details>

        <!-- More FAQ items... -->
    </div>
</section>
```

---

## Implementation Priority

### Phase 1: Critical (Blocking Issues)
1. Fix navigation HTML structure (index.html:214-221)
2. Add mobile navigation menu
3. Remove scroll hijacking (index.html:1213-1214)
4. Make forms functional with Formspree

### Phase 2: High Priority (Core Requirements)
5. Replace Tailwind CDN with build process
6. Add accessibility features (skip link, labels, focus indicators, main landmark)
7. Add SEO meta tags (OG, Twitter, canonical, JSON-LD)
8. Fix color contrast (#888 → #999)

### Phase 3: Enhancements (Performance & UX)
9. Add responsive images with srcset
10. Optimize Cloudinary images (f_auto,q_auto)
11. Add preload hints for critical resources
12. Add reduced-motion support
13. Throttle mousemove handler
14. Add FAQ section

---

## Validation Checklist

### Functional Validation
- [ ] All navigation links resolve to existing anchors
- [ ] Mobile navigation opens/closes correctly
- [ ] Forms submit successfully (test with real email)
- [ ] Form validation shows errors for invalid input
- [ ] Success message appears after submission
- [ ] Native scroll works immediately (no hijacking)

### Performance Validation
- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP < 2.5s (test on 4G throttled)
- [ ] CSS file size < 20KB
- [ ] Total page weight < 500KB

### Accessibility Validation
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] Zero critical axe-core violations
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces all content correctly
- [ ] Skip link appears on focus
- [ ] Color contrast passes WCAG AA (4.5:1)

### SEO Validation
- [ ] Lighthouse SEO score ≥ 95
- [ ] Open Graph preview works (Facebook Sharing Debugger)
- [ ] Twitter Card preview works (Twitter Card Validator)
- [ ] JSON-LD validates (Google Rich Results Test)
- [ ] Canonical URL is set

### Browser Testing
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

---

## Known Risks & Mitigations

### Risk: Tailwind Build Complexity
- **Mitigation:** Use Tailwind CLI only (no PostCSS config); keep scripts minimal

### Risk: Form Service Limitations (Free Tier)
- **Mitigation:** Formspree free tier allows 50 submissions/month; monitor usage; upgrade if needed

### Risk: Color Contrast May Still Fail on Some Monitors
- **Mitigation:** Increase to #aaa if #999 is insufficient

### Risk: UnicornStudio Third-Party Dependency
- **Mitigation:** Already deferred 2s; consider removing if performance issues arise

### Risk: Missing Actual Domain URL
- **Mitigation:** Use placeholder `https://triplelabs.com/` for now; update before deploy

---

## File References

### Files to Modify
- `/Users/teddyburtonburger/Desktop/Code-hub/triplelabs-site/index.html` (primary changes)

### Files to Create
- `tailwind.config.js`
- `src/input.css`
- `package.json`
- `.gitignore`
- `dist/` directory (output)

### Key Line References
- Tailwind CDN to remove: index.html:23
- Tailwind config to extract: index.html:25-61
- Custom CSS to extract: index.html:63-173
- Navigation to fix: index.html:214-221
- Mobile nav (hidden, needs hamburger): index.html:224-232
- Newsletter form: index.html:937-943
- Footer form: index.html:1006-1022
- Scroll hijacking to remove: index.html:1213-1214

---

## Success Criteria

**The landing page is complete when:**
1. All Lighthouse scores ≥ 90
2. All forms submit successfully
3. Mobile navigation works on all devices
4. No accessibility violations (axe-core)
5. SEO meta tags validate correctly
6. Page loads in < 3s on 4G
7. Build process runs without errors
