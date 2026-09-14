# EdgeCourse BD — Complete Reverse-Engineering & Product Blueprint
### Master Analysis Document · 20 Outputs · September 2026
---

> **Reference analyzed:** https://edgecoursebd.com (EdgeCourse / HulkenStein Bangladesh)  
> **Platform type:** Bengali-language EdTech platform — SSC, HSC, Admission & Job prep  
> **Stack detected:** Next.js (App Router), AWS S3 (media), SSLCommerz (payments), Google Play App  
> **Framework signals:** `/_next/static/`, `/_next/image` optimization, `_next/static/media` SVG assets

---

## OUTPUT 1 — EXECUTIVE ANALYSIS

### What EdgeCourse BD Does Well

**1. Ecosystem positioning over single-product thinking**
EdgeCourse is not just a course platform — it presents itself as a full EdTech ecosystem (HulkenStein Ltd.) with four interconnected properties: EdgeCourse BD (video courses), QZTest (exam platform), QNA Publication (physical books), and a dedicated Android App. This multi-product moat is a strong trust and retention signal.

**2. Ruthless niche focus**
Rather than trying to compete globally (like Udemy), EdgeCourse targets a very specific vertical: Bangladeshi students in SSC, HSC, Medical, Engineering, and University admission pipelines. Every product, every course title, every UI copy is tuned to this audience. The Bengali-language-first approach eliminates friction for their core user base.

**3. Social proof at massive scale**
The homepage prominently features "1M+ Students," "15k+ Lessons," "120+ Instructors," and "5k+ Materials." Student testimonials with real names and exam batches (HSC-26, SSC-25) are directly on the homepage, not buried on a separate page. This builds trust at the highest-traffic touchpoint.

**4. Price anchoring as a conversion weapon**
Many courses show a strikethrough original price alongside the discounted price (e.g., BDT 7,850 → 5,499). This is aggressive but effective for Bangladesh's price-sensitive student market. The platform also uses enrollment counts ("কোর্সটি করছে: 11123") as live social proof on each card.

**5. Offline-first mobile app**
Prominently advertising "নেট না থাকলেও ক্লাস চলবে" (classes run even without internet) is a killer feature for rural Bangladesh where connectivity is unreliable. This is not buried in features — it's a headline value proposition.

**6. Free resources as acquisition funnel**
A dedicated `/free-resources` page provides 40+ downloadable study files (Google Drive links) for free. This is a classic lead magnet strategy — build trust, grow the audience, convert to paid later.

**7. Credentialed instructor positioning**
Every instructor card shows their institution affiliation (DU, BUET, SSMC, etc.), which carries enormous trust weight in Bangladesh's prestige-driven academic culture.

### What Makes the Site Feel Premium (or NOT)
**Weaknesses:**
- The design feels functional but generic — there is no distinctive visual identity
- No animations, microinteractions, or scroll effects detected
- Course card design is basic (thumbnail + title + price + enrollment count)
- The "section title icon" pattern (small SVG decoration before headings) is a minor stylistic choice but is the extent of the visual language
- Tab-based filtering on course sections (Science/Arts/Commerce) is good but not animated
- The hero section appears to be a search bar + navigation — there is no hero image, video, or emotional hook
- The free resources page is just a raw HTML table — a missed design opportunity

### What Increases Conversion
- Enrollment counts on cards (FOMO: "11,123 students enrolled")
- Discount pricing with strikethrough
- "প্রিমিয়াম পিকস" (Premium Picks) featured section curates best-sellers
- App download CTA + offline feature = reduces purchase hesitation
- Strong brand association with real Bangladesh universities (DU, BUET, SSMC)

### What Should Be Avoided in a New Platform
- Raw HTML tables for resources pages — use proper card grids
- No loading skeletons detected
- No visible progress indicators, gamification, or student dashboard previews
- Navigation heavy with text links (8+ items) — reduces focus
- No sticky enrollment CTA on course detail pages (inferred)
- Dual branding (EdgeCourse + HulkenStein) creates confusion — single cohesive brand is better

### Combined Recommendation
Build a platform that takes EdgeCourse's **ecosystem depth** and **local trust signals**, adds a **premium visual identity**, introduces **smooth micro-interactions and scroll animations**, and creates a **student dashboard that feels like a product**, not an afterthought.

---

## OUTPUT 2 — COMPLETE SITEMAP

```
edgecoursebd.com/
│
├── / (Homepage)
│   └── WHY: Primary acquisition page — social proof, category nav, featured courses, instructor showcase
│
├── /categories?category_type=normal (Course Category Browser)
│   ├── /categories?category_type=live (Live Courses)
│   ├── /categories?category_type=job (Job Prep Courses)
│   └── WHY: Top-level taxonomy entry point, splits recorded vs live vs job tracks
│
├── /subcategories/:id (Subcategory Landing)
│   ├── /subcategories/1  → Class 6,7,8
│   ├── /subcategories/8  → SSC Prep
│   ├── /subcategories/9  → HSC Science
│   ├── /subcategories/10 → HSC Arts
│   ├── /subcategories/11 → HSC Commerce
│   ├── /subcategories/12 → Alim & Dakhil
│   ├── /subcategories/13 → Admission (Pvt & Public)
│   └── /subcategories/14 → Nursing, NU & DCU
│   └── WHY: Filtered course lists per educational track
│
├── /courses/:id (Course Detail Page)
│   └── WHY: Product page — the primary conversion point
│
├── /free-resources (Free Resource Hub)
│   └── WHY: Lead acquisition — 40+ free downloads, builds trust and email list
│
├── /eligibility-calculator (Eligibility Checker Tool)
│   └── WHY: Interactive tool that qualifies students by exam readiness
│
├── /syllabus-calculator (Syllabus Calculator Tool)
│   └── WHY: Study planning tool — increases time-on-site and perceived value
│
├── /admission26 (Admission 2026 Landing Page)
│   └── WHY: Seasonal campaign page for the 2026 admission cohort
│
├── /college-guide (College Selection Guide)
│   └── WHY: Decision-support tool to help students pick colleges
│
├── /teachers (Instructor Directory)
│   └── WHY: Builds trust through credential display; supports SEO
│
├── /blog (Blog/Content Hub)
│   └── /blog/:slug (Individual Article)
│   └── WHY: SEO acquisition, content marketing, student guidance articles
│
├── /login (Login Page)
│   └── WHY: Authentication gateway — phone/OTP or email
│
├── /register (Registration Page)
│   └── WHY: New student onboarding
│
├── /dashboard (Student Dashboard) [protected]
│   ├── /dashboard/my-courses
│   ├── /dashboard/progress
│   ├── /dashboard/certificates
│   ├── /dashboard/profile
│   ├── /dashboard/orders
│   └── WHY: Core retention surface — students return here daily
│
├── /course-player/:enrollmentId (Video Lesson Player) [protected]
│   └── WHY: Primary product delivery surface
│
├── /checkout/:courseId (Checkout Flow)
│   └── WHY: Payment conversion point — SSLCommerz integration
│
├── /about (About Us)
│   └── WHY: Trust page — company story, mission, community stats
│
├── /company/our-story
├── /company/mission-vision
├── /company/management
├── /company/awards
├── /company/career (Careers)
│
├── /content/privacy-policy
├── /content/terms-and-conditions
├── /content/refund-policy
│   └── WHY: Legal compliance, student protection, trust signals
│
└── External Ecosystem Links:
    ├── qztestexam.com (Exam platform)
    ├── qnapublication.com (Books store)
    └── play.google.com (Android app)
```

---

## OUTPUT 3 — PAGE-BY-PAGE BREAKDOWN

### Page 1: Homepage (`/`)

**Purpose:** Convert visitors into enrolled students or registered users  
**Target user:** Student (SSC/HSC/Admission-age, 14–22), parents, returning alumni  
**Primary CTA:** "View Details" on featured course cards  
**Secondary CTA:** App download, Login, Social community join

**Section Order & Purpose:**
1. **Sticky Navbar** — Navigation + course search + login
2. **Hero/Header** — Brand identity with search bar (weak — no visual hero)
3. **Cross-platform promo strip** — QNA Publication + QZ Test links (ecosystem depth)
4. **Stats bar** — 1M+ Students, 15k+ Lessons, 120+ Instructors, 5k+ Materials
5. **Course Categories grid** — 8 subcategory tiles with icons
6. **HulkenStein Premium Picks** — 10 best-seller course cards (horizontal scroll)
7. **HSC Academic Courses** — Tabbed section (Science/Arts/Commerce/Alim/EV)
8. **Admission Preparation Courses** — Tabbed (Varsity/Medical/Engineering/Nursing/JU/DCU/NU)
9. **ComeBack Courses for HSC 27** — Tabbed section
10. **Private University Prep courses** — Grid section
11. **SSC & School courses** — Tabbed section
12. **English Version courses** — Grid section
13. **Scholarship Programs** — Grid section
14. **App Download CTA block** — Offline feature highlight
15. **QZ Test ecosystem block** — External platform promotion
16. **YouTube Playlist / Guideline Videos** — 10+ video thumbnails
17. **Why Choose EdgeCourse** — 6-feature icon grid
18. **Social channels CTA** — Facebook/YouTube/Instagram
19. **Student Testimonials** — Auto-scroll testimonial cards
20. **Instructor Team grid** — 35+ instructor cards with institution tags
21. **Footer** — Links, payment methods, app download, social

**Conversion role:** High — multiple CTAs, social proof, price anchoring throughout  
**Mobile behavior:** Single column, horizontal scroll for course sections  
**Accessibility gap:** Course cards lack proper `aria-label`; search has a placeholder but no visible label

---

### Page 2: Categories (`/categories`)

**Purpose:** Entry point for course discovery  
**Target user:** New visitor evaluating the range of offerings  
**Primary CTA:** Click subcategory to browse courses  
**Secondary CTA:** Filter by type (Main / Live / Job)

**Sections:**
1. Tab switcher: Main | Live | Job (URL param: `?category_type=`)
2. 8-grid subcategory cards with thumbnail + Bengali label
3. Footer

**UX notes:** Clean, simple. No search. No price filters. No rating display. Minimal friction is appropriate here — discovery first, details later.

---

### Page 3: Free Resources (`/free-resources`)

**Purpose:** Lead generation through free value; trust building  
**Target user:** First-time visitors, budget-constrained students  
**Primary CTA:** Download resource files  
**Secondary CTA:** Visit paid courses

**Current state:** A plain numbered HTML table with 40 download links (Google Drive)  
**Opportunity:** Convert to a searchable, filterable card grid with subject tags, file type badges, and a "Unlock more free resources by registering" gate for email capture

---

### Page 4: About (`/about`)

**Purpose:** Build brand trust and mission alignment  
**Target user:** Parents, media, potential instructors, curious students  
**Sections:**
1. Founding story (2020, COVID origin)
2. What we deliver (5 delivery types)
3. Philosophy ("কমন আসবেই" — "will definitely come common")
4. Community stats (100k+ paid, 2M+ free learners)
5. Mission statement

**Key trust signals:** HolonIQ Top 100 EdTech South Asia 2025 recognition

---

### Page 5: Course Detail (`/courses/:id`) [inferred from card data]

**Inferred sections:**
1. Course thumbnail + title
2. Price + discount display
3. Enrollment count
4. Instructor bio block
5. Curriculum/lesson list
6. "Enroll Now" sticky CTA
7. What you'll learn section
8. Course reviews (likely)
9. Related courses

---

## OUTPUT 4 — COMPONENT INVENTORY

### Global Components

| Component | Type | Description |
|---|---|---|
| **Navbar** | Global | Logo + 8 nav links + search bar + Login CTA |
| **Mobile Navbar** | Global | Hamburger → full-page drawer with same links |
| **Footer** | Global | 4-column: Study / Company / Policy / Other Platforms + payment logos + socials |
| **Section Title Block** | Global | Small SVG icon + Bengali h2 heading + subtitle paragraph |
| **Toast/Notification** | Global | Inferred for enrollment, login, error states |

### Shared Components

| Component | Type | Description |
|---|---|---|
| **Course Card** | Shared | Thumbnail + Bengali/English title + BDT price + strikethrough + enrollment count + "View Details" CTA |
| **Category Tab Bar** | Shared | Horizontal pill tabs (Science/Arts/Commerce/Alim/EV) for filtering course sections |
| **Subcategory Tile** | Shared | Icon image + Bengali label, links to `/subcategories/:id` |
| **Instructor Card** | Shared | Circular avatar photo + name + institution tag |
| **Testimonial Card** | Shared | Avatar initials + name + batch label + Bengali review text |
| **Stats Counter** | Shared | Large number + label (1M+ Students, etc.) |
| **App Download Block** | Shared | Feature headline + Google Play badge |
| **Payment Methods Banner** | Shared | SSLCommerz payment logos SVG |
| **Social Community CTA** | Shared | Facebook Group / YouTube / Instagram cards with join/subscribe/follow actions |

### Page-Specific Components

| Component | Page | Description |
|---|---|---|
| **Category Type Switcher** | /categories | Main/Live/Job tab filter |
| **Free Resource Table** | /free-resources | Numbered table with file download links |
| **QZ Test Promo Block** | Homepage | External platform promotion card |
| **YouTube Playlist Grid** | Homepage | 10 video thumbnails with Bengali titles |
| **Why Choose Us Grid** | Homepage | 6-feature icon + heading + description grid |
| **Course Player** | /course-player | Video player + lesson list sidebar + progress bar |
| **Eligibility Calculator** | /eligibility-calculator | Interactive form/quiz tool |
| **Syllabus Calculator** | /syllabus-calculator | Study planner interface |
| **Student Dashboard Sidebar** | /dashboard/* | Navigation for enrolled courses, progress, certificates |

---

## OUTPUT 5 — DESIGN SYSTEM

### Color System (Inferred + Refined for New Platform)

```
PRIMARY PALETTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Brand Blue (Primary)     #1A56DB   → CTAs, active states, links
Brand Blue Dark          #1241A8   → Hover states
Brand Blue Light         #EBF2FF   → Tinted backgrounds, badges

SECONDARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Accent Orange            #F97316   → Price badges, discount labels
Accent Green             #16A34A   → Success states, enrollment counts
Accent Purple            #7C3AED   → Premium/featured course labels

NEUTRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dark Text                #0F172A   → Primary headings
Body Text                #334155   → Paragraphs
Muted Text               #64748B   → Metadata, labels
Border                   #E2E8F0   → Cards, dividers
Background               #F8FAFC   → Page background
Card Background          #FFFFFF   → Cards, modals
Dark Background          #0F172A   → Hero, footer

STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Error                    #DC2626
Warning                  #D97706
Success                  #16A34A
Info                     #0EA5E9
```

### Typography System

```
DISPLAY (Bengali + Latin mixed)
Font: Hind Siliguri (Google Fonts) — optimized for Bengali
Font: Inter — for English labels, prices, CTAs

Scale:
  display-2xl: 4rem / 64px  — Hero headlines
  display-xl:  3rem / 48px  — Section titles
  display-lg:  2.25rem      — Course titles (detail page)
  h1: 1.875rem              — Page headings
  h2: 1.5rem                — Section headings
  h3: 1.25rem               — Card titles
  h4: 1.125rem              — Instructor names
  body-lg: 1.125rem         — Feature descriptions
  body:  1rem               — General body
  body-sm: 0.875rem         — Metadata, captions
  label: 0.75rem            — Tags, badges

Weights: 400 (regular) / 500 (medium) / 600 (semibold) / 700 (bold)
```

### Spacing Scale

```
4px → 8px → 12px → 16px → 20px → 24px → 32px → 40px → 48px → 64px → 80px → 96px → 128px
```

### Border Radius

```
sm:   4px   → Tags, badges
md:   8px   → Inputs, small cards
lg:   12px  → Course cards
xl:   16px  → Feature blocks
2xl:  24px  → Hero sections
full: 9999px → Pill buttons, avatars
```

### Shadow System

```
shadow-sm:  0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.10)
shadow-md:  0 4px 6px rgba(15,23,42,.07), 0 2px 4px rgba(15,23,42,.06)
shadow-lg:  0 10px 15px rgba(15,23,42,.08), 0 4px 6px rgba(15,23,42,.05)
shadow-xl:  0 20px 25px rgba(15,23,42,.10), 0 10px 10px rgba(15,23,42,.04)
```

### Button Styles

```
Primary:    bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-dark
Secondary:  bg-white text-brand-blue border border-brand-blue px-6 py-3 rounded-lg hover:bg-blue-50
Ghost:      bg-transparent text-brand-blue px-6 py-3 rounded-lg hover:bg-blue-50
Danger:     bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700
Icon:       p-2 rounded-full hover:bg-gray-100
```

### Card Styles

```
course-card: bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300
category-card: bg-white rounded-lg border border-gray-100 p-4 hover:border-brand-blue transition-all
instructor-card: bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md
testimonial-card: bg-gray-50 rounded-xl p-6 border border-gray-100
```

---

## OUTPUT 6 — ANIMATION SYSTEM

### Current State (EdgeCourse BD)
No significant animation detected. The site is static — no scroll animations, no hero motion, no card hover animations, no transitions. This is a significant gap versus premium edtech competitors.

### Recommended Animation System for New Platform

#### Animation Library Recommendation: **Framer Motion** (primary) + **GSAP** (hero/complex)

```
PAGE-LOAD ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navbar: fade-in from top, 0.3s ease-out, delay 0
Hero headline: slide-up + fade-in, 0.6s, delay 0.1s
Hero subtext: slide-up + fade-in, 0.6s, delay 0.2s
Hero CTA buttons: fade-in + scale-up, 0.4s, delay 0.3s
Stats bar: count-up number animation on mount

SCROLL ANIMATIONS (Intersection Observer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section headings: slide-up 40px + fade-in, 0.5s ease-out
Course cards: staggered fade-up, 50ms between each card
Category tiles: pop-in with slight scale, stagger 30ms
Instructor cards: fade-up, stagger 25ms
Testimonials: fade-in, horizontal scroll snap

HOVER ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Course card: shadow-lg + y:-4px translateY, 0.2s ease
Category tile: border-color → brand-blue, 0.15s
Instructor card: scale(1.02), 0.15s ease
Button: scale(0.98) on mousedown, background darken

NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On scroll past 80px: add box-shadow + white background, 0.2s
Mobile menu: slide-down from top, backdrop blur overlay

COUNTER ANIMATION (Stats Section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Number count-up from 0 → target over 1.5s when in viewport
Use spring easing for natural deceleration

COURSE PLAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lesson item completion: checkmark appear + line-through, 0.3s
Progress bar: smooth width transition on lesson complete

MODAL / DRAWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modal: backdrop fade-in + content scale(0.95→1) + fade
Mobile drawer: slide-in from right, 0.25s ease-out

LOADING STATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skeleton: shimmer animation (gradient scan left-to-right, 1.5s loop)
Course card skeleton: rounded-xl grey blocks matching card dimensions
```

#### Framer Motion Example Pattern:
```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" }
  })
};
// Apply: <motion.div variants={cardVariants} custom={index} initial="hidden" whileInView="visible" />
```

---

## OUTPUT 7 — 3D STRATEGY

### Recommendation: Selective 3D — Hero Only

Given that EdgeCourse's primary audience is mobile-first, budget-device students in Bangladesh, heavy WebGL usage would be counterproductive. The 3D strategy must be **additive but optional, never required for usability**.

**Where 3D Adds Value:**

| Location | 3D Element | Purpose |
|---|---|---|
| Hero section | Floating 3D book / graduation cap / atom model | Visual wow factor on homepage |
| Course category visualization | 3D icon sphere per category (Science=atom, Arts=palette, Math=sigma) | Makes categories visually distinctive |
| Certificate reveal | 3D flip animation of certificate | Rewarding UX moment |
| Learning journey page | Animated 3D path/road metaphor | Motivation & progress visualization |

**Implementation Rules:**
```
Technology:    React Three Fiber (r3f) + @react-three/drei + @react-three/postprocessing
Strategy:      Lazy-load WebGL chunk — only load on desktop when element enters viewport
Fallback:      Static SVG illustration for mobile / prefers-reduced-motion / low-end devices
Performance:   Keep polygon count < 5,000 per model; use environment maps not real-time lighting
Mobile:        Disable 3D by default on viewport < 768px; show static SVG instead
Motion:        Respect prefers-reduced-motion — substitute fade for rotation
Bundle:        Code-split the r3f chunk (dynamic import) to avoid bloating main bundle
```

**Specific 3D Hero Concept:**
A slowly rotating 3D graduation cap with floating Bengali textbook shapes orbiting it. Gentle float animation. Muted, professional — not cartoonish. Dark background section. Three.js environment HDRI for realistic material sheen.

---

## OUTPUT 8 — RESPONSIVE SYSTEM

### Breakpoints

```
Mobile:         320px – 767px   (primary device for Bangladeshi students)
Tablet:         768px – 1023px
Desktop:        1024px – 1279px
Large Desktop:  1280px – 1535px
XL:             1536px+

Tailwind config:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
  2xl: 1536px
```

### Layout Behavior

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navbar | Logo + hamburger icon | Logo + 4 main links + hamburger | Full nav bar |
| Hero | Single column, text + CTA stacked | Two column text + visual | Full width with 3D element |
| Course cards grid | 1 column | 2 columns | 3 columns |
| Category tiles | 2×4 grid | 4×2 grid | 8 inline |
| Stats bar | 2×2 grid | 4 inline | 4 inline |
| Instructor grid | 2 columns | 3 columns | 5 columns |
| Footer | Single column stacked | 2 columns | 4 columns |
| Course player | Full width video + below lesson list | Sidebar visible | Side-by-side |

### Typography Scaling

```
Hero heading:    mobile: 2rem   tablet: 2.75rem   desktop: 3.5rem
Section heading: mobile: 1.5rem tablet: 1.75rem   desktop: 2rem
Card title:      mobile: 1rem   tablet: 1.0625rem desktop: 1.125rem
Body:            mobile: 0.9375rem  desktop: 1rem
```

### Navigation Behavior

- Mobile: hamburger opens full-height drawer, company links in accordion accordion
- Tablet: compressed navbar with overflow menu for secondary links
- Desktop: full horizontal navbar; "কোম্পানি" becomes a dropdown mega-menu

### Image Behavior

```
Next.js Image component with:
  - responsive sizes prop
  - priority on above-fold images
  - lazy loading for below-fold
  - WebP conversion
  - AWS S3 → Cloudflare CDN recommended
```

### Touch Interactions

- Swipe-left/right on course card carousels (no scroll bar needed)
- Bottom sheet modals instead of centered modals on mobile
- Tap target minimum 44×44px (currently insufficient on some small icon buttons)

---

## OUTPUT 9 — USER FLOWS

### Flow 1: Visitor → Course Enrollment

```
1. Lands on Homepage (organic search / social media / YouTube)
2. Sees stats + social proof bar
3. Scrolls to "Premium Picks" or "HSC Academic Courses" section
4. Finds relevant category (e.g., HSC Science)
5. Clicks tab → sees Science courses
6. Clicks "View Details" on a course card
7. Lands on Course Detail Page
8. Reads curriculum, instructor bio, testimonials
9. Clicks "Enroll Now" / "কোর্সে ভর্তি হও"
10. Redirected to Login (if not authenticated)
11. Registers with phone number → OTP verification
12. Redirected back to course checkout
13. Selects payment method (bKash / Nagad / Card via SSLCommerz)
14. Completes payment
15. Sees enrollment success screen
16. Redirected to course player
```

### Flow 2: Registered User → Daily Learning

```
1. Opens mobile app / visits site
2. Logs in (OTP / saved session)
3. Dashboard shows enrolled courses + progress
4. Clicks on active course
5. Sees lesson list (completed ✓ / current / locked)
6. Clicks next lesson
7. Video player loads
8. Watches class (offline-downloaded or streaming)
9. Marks lesson complete
10. Progress bar updates
11. If all lessons done → Certificate unlock notification
```

### Flow 3: Visitor → Free Resource → Registration

```
1. Student searches "HSC Physics suggestion 2026" on Google
2. Lands on /free-resources page
3. Downloads 2-3 free files (Google Drive links)
4. Sees banner: "১০০+ আরো ফ্রি রিসোর্স পেতে রেজিস্ট্রেশন করো"
5. Clicks register
6. Completes phone OTP registration
7. Receives more free resources
8. Receives course recommendation email/SMS
9. Converts to paid student
```

### Flow 4: Checkout → Payment

```
1. Student on Course Detail page
2. Clicks "Enroll Now"
3. Checkout page: course summary + price + coupon field
4. Applies coupon → price updates (animation)
5. Selects payment: bKash / Nagad / Rocket / Card
6. Redirected to SSLCommerz gateway
7. Completes payment
8. Returns to success page
9. Enrollment confirmed + email/SMS notification
10. Dashboard shows new course
```

### Flow 5: Admin → Course Creation

```
1. Admin logs into /admin
2. Navigates: Courses → Create New Course
3. Fills: title, Bengali title, category, subcategory, thumbnail, price, discount, enrollment limit
4. Adds sections (Chapter 1, Chapter 2, etc.)
5. Uploads lessons per section (video + PDF + notes)
6. Sets lesson type: recorded / live / downloadable
7. Publishes or saves as draft
8. Course appears on frontend category page
```

---

## OUTPUT 10 — FEATURE REQUIREMENTS

### MVP (Phase 1 — Launch)

- [ ] User registration via phone number (OTP)
- [ ] Course catalog: category → subcategory → course listing
- [ ] Course detail page with curriculum preview
- [ ] Checkout with SSLCommerz + bKash/Nagad integration
- [ ] Student dashboard: my courses, basic progress
- [ ] Video lesson player (stream + offline download toggle)
- [ ] PDF resource downloads
- [ ] Admin panel: course CRUD, enrollment management
- [ ] Course category & subcategory management
- [ ] Free resource page (downloadable materials)
- [ ] Homepage with social proof, featured courses, testimonials
- [ ] Basic SEO: meta tags, OG tags, canonical URLs
- [ ] Mobile responsive design
- [ ] Android app (Next.js PWA or React Native)

### Phase 2 — Growth

- [ ] Student testimonial collection and display system
- [ ] Coupon/discount code system
- [ ] Certificate generation on course completion (PDF, shareable)
- [ ] Instructor profile pages (public-facing)
- [ ] Blog CMS with SEO-optimized article pages
- [ ] YouTube playlist integration
- [ ] Eligibility calculator tool (interactive quiz)
- [ ] Syllabus calculator / study planner
- [ ] Student progress tracking with analytics view
- [ ] Live course / batch system (scheduled classes)
- [ ] Notification system (in-app + SMS)
- [ ] Refund management
- [ ] Course reviews and ratings
- [ ] Related courses recommendations

### Advanced (Phase 3)

- [ ] AI-powered study plan generator
- [ ] Personalized course recommendations
- [ ] Live exam/test platform (QZ Test integration or internal)
- [ ] Leaderboard for exam performance
- [ ] Community forums per course
- [ ] Affiliate / referral system
- [ ] Bulk enrollment for coaching centers
- [ ] Multi-instructor revenue sharing
- [ ] Advanced analytics dashboard (admin + instructor)
- [ ] iOS App
- [ ] 3D interactive hero / gamified learning journey
- [ ] BCS / Bank Job prep track (separate category)
- [ ] Dark mode

---

## OUTPUT 11 — TECHNICAL ARCHITECTURE

### Recommended Stack

| Layer | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR + SSG for SEO, already detected on EdgeCourse; Vercel optimized |
| **Language** | TypeScript | Type safety, better DX, scales with team |
| **Styling** | Tailwind CSS v4 | Utility-first, perfect for component libraries, PurgeCSS |
| **UI Components** | shadcn/ui | Headless, fully customizable, Radix UI primitives |
| **Database** | PostgreSQL (via Supabase) | Relational data model, RLS policies for auth, built-in auth |
| **Auth** | Supabase Auth | Phone OTP (critical for Bangladesh), email, social |
| **File Storage** | AWS S3 + CloudFront CDN | Same as EdgeCourse; proven for large video/image assets |
| **Video Delivery** | Bunny Stream (preferred) or Cloudflare Stream | DRM support, bandwidth-cheap, excellent SE Asia performance |
| **Payments** | SSLCommerz (BD) | bKash, Nagad, Rocket, cards — full Bangladesh coverage |
| **Animations** | Framer Motion | React-native animation library, excellent DX |
| **3D** | React Three Fiber + Drei | Declarative Three.js, tree-shakeable |
| **Deployment** | Vercel | Zero-config, Edge functions, automatic PR previews |
| **Email** | Resend + React Email | Modern email API, beautiful template DX |
| **SMS** | BulkSMS Bangladesh / Twilio | OTP delivery, enrollment confirmations |
| **Search** | Algolia or Meilisearch | Instant course search with Bengali query support |
| **Analytics** | Posthog (self-hosted) | Product analytics, funnel analysis, privacy-friendly |
| **Monitoring** | Sentry | Error tracking, performance monitoring |
| **CMS (Blog)** | Sanity.io or Payload CMS | Headless CMS with Bengali content support |

### Architecture Diagram

```
Client (Browser / PWA)
    │
    ├── Next.js App Router (Vercel Edge)
    │       ├── Server Components (SSR/SSG for course pages)
    │       ├── Client Components (interactive: player, dashboard)
    │       └── API Routes (webhooks, payment callbacks)
    │
    ├── Supabase (BaaS)
    │       ├── PostgreSQL database
    │       ├── Auth (Phone OTP + JWT)
    │       ├── Row-Level Security (RLS)
    │       └── Realtime subscriptions (progress updates)
    │
    ├── AWS S3 + CloudFront
    │       ├── Course thumbnails
    │       ├── Profile images
    │       └── Study materials (PDFs)
    │
    ├── Bunny Stream
    │       ├── Video encoding (auto HLS)
    │       ├── DRM protection
    │       └── Bandwidth billing (low cost for BD)
    │
    └── SSLCommerz → bKash / Nagad / Rocket / Cards
```

---

## OUTPUT 12 — DATABASE ARCHITECTURE

### Core Tables

```sql
-- USERS
users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(15) UNIQUE,
  email       VARCHAR(255) UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
)

-- PROFILES
profiles (
  id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name       VARCHAR(255),
  avatar_url      TEXT,
  class_level     VARCHAR(50),   -- 'HSC', 'SSC', 'Admission', etc.
  exam_batch      VARCHAR(20),   -- 'HSC-28', 'SSC-27', etc.
  district        VARCHAR(100),
  institution     VARCHAR(255),
  bio             TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
)

-- CATEGORIES
categories (
  id              SERIAL PRIMARY KEY,
  name_bn         VARCHAR(255) NOT NULL,   -- Bengali name
  name_en         VARCHAR(255),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  icon_url        TEXT,
  category_type   VARCHAR(20) DEFAULT 'normal', -- 'normal', 'live', 'job'
  sort_order      INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  parent_id       INTEGER REFERENCES categories(id)   -- for subcategories
)

-- COURSES
courses (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  title_bn        VARCHAR(500) NOT NULL,
  title_en        VARCHAR(500),
  description_bn  TEXT,
  description_en  TEXT,
  thumbnail_url   TEXT,
  category_id     INTEGER REFERENCES categories(id),
  instructor_id   UUID REFERENCES profiles(id),
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  discounted_price NUMERIC(10,2),
  is_free         BOOLEAN DEFAULT FALSE,
  is_featured     BOOLEAN DEFAULT FALSE,
  status          VARCHAR(20) DEFAULT 'draft',  -- 'draft', 'published', 'archived'
  total_lessons   INTEGER DEFAULT 0,
  total_duration  INTEGER DEFAULT 0,  -- seconds
  enrollment_count INTEGER DEFAULT 0,
  language        VARCHAR(20) DEFAULT 'bn',     -- 'bn', 'en', 'mixed'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
)

-- COURSE SECTIONS
course_sections (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title_bn    VARCHAR(500) NOT NULL,
  title_en    VARCHAR(500),
  sort_order  INTEGER DEFAULT 0,
  is_free     BOOLEAN DEFAULT FALSE
)

-- LESSONS
lessons (
  id              SERIAL PRIMARY KEY,
  section_id      INTEGER REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id       INTEGER REFERENCES courses(id),
  title_bn        VARCHAR(500) NOT NULL,
  title_en        VARCHAR(500),
  type            VARCHAR(20) DEFAULT 'video',  -- 'video', 'pdf', 'quiz', 'live'
  video_url       TEXT,                          -- Bunny Stream URL
  video_duration  INTEGER,                       -- seconds
  pdf_url         TEXT,
  is_free_preview BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- LESSON RESOURCES
lesson_resources (
  id          SERIAL PRIMARY KEY,
  lesson_id   INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  title       VARCHAR(255),
  file_url    TEXT NOT NULL,
  file_type   VARCHAR(20),   -- 'pdf', 'docx', 'image', 'link'
  file_size   INTEGER        -- bytes
)

-- ENROLLMENTS
enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id       INTEGER REFERENCES courses(id),
  order_id        UUID REFERENCES orders(id),
  enrolled_at     TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, course_id)
)

-- COURSE PROGRESS
course_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id       INTEGER REFERENCES lessons(id),
  completed       BOOLEAN DEFAULT FALSE,
  watch_duration  INTEGER DEFAULT 0,   -- seconds watched
  completed_at    TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
)

-- INSTRUCTORS (public-facing profiles)
instructors (
  id              UUID PRIMARY KEY REFERENCES profiles(id),
  designation     VARCHAR(255),
  institution     VARCHAR(255),
  segment         VARCHAR(255),   -- 'HSC Science', 'Medical Admission', etc.
  bio_bn          TEXT,
  bio_en          TEXT,
  expertise_tags  TEXT[],
  total_students  INTEGER DEFAULT 0,
  is_featured     BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0
)

-- REVIEWS
reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   INTEGER REFERENCES courses(id),
  user_id     UUID REFERENCES users(id),
  rating      SMALLINT CHECK (rating >= 1 AND rating <= 5),
  body_bn     TEXT,
  body_en     TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- ORDERS
orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  total_amount    NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  final_amount    NUMERIC(10,2) NOT NULL,
  coupon_id       INTEGER REFERENCES coupons(id),
  status          VARCHAR(20) DEFAULT 'pending',  -- 'pending','paid','failed','refunded'
  payment_method  VARCHAR(50),
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- ORDER ITEMS
order_items (
  id          SERIAL PRIMARY KEY,
  order_id    UUID REFERENCES orders(id),
  course_id   INTEGER REFERENCES courses(id),
  price       NUMERIC(10,2) NOT NULL
)

-- PAYMENTS
payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES orders(id),
  gateway         VARCHAR(50),   -- 'sslcommerz', 'bkash', 'nagad'
  transaction_id  VARCHAR(255),
  gateway_ref     VARCHAR(255),
  amount          NUMERIC(10,2),
  currency        VARCHAR(10) DEFAULT 'BDT',
  status          VARCHAR(20),   -- 'success', 'failed', 'cancelled'
  raw_response    JSONB,
  paid_at         TIMESTAMPTZ
)

-- CERTIFICATES
certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID REFERENCES enrollments(id),
  user_id         UUID REFERENCES users(id),
  course_id       INTEGER REFERENCES courses(id),
  certificate_url TEXT,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  is_public       BOOLEAN DEFAULT FALSE,
  public_token    VARCHAR(64) UNIQUE  -- for public share links
)

-- NOTIFICATIONS
notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  type        VARCHAR(50),   -- 'enrollment', 'lesson_added', 'payment', etc.
  title_bn    VARCHAR(255),
  body_bn     TEXT,
  link        TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- COUPONS
coupons (
  id              SERIAL PRIMARY KEY,
  code            VARCHAR(50) UNIQUE NOT NULL,
  type            VARCHAR(20),    -- 'percent', 'fixed'
  value           NUMERIC(10,2),
  max_uses        INTEGER,
  current_uses    INTEGER DEFAULT 0,
  min_order       NUMERIC(10,2),
  course_id       INTEGER REFERENCES courses(id),  -- NULL = applies to all
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- BLOG POSTS
blog_posts (
  id          SERIAL PRIMARY KEY,
  title_bn    VARCHAR(500) NOT NULL,
  title_en    VARCHAR(500),
  slug        VARCHAR(500) UNIQUE NOT NULL,
  excerpt_bn  TEXT,
  body_bn     TEXT NOT NULL,
  thumbnail   TEXT,
  author_id   UUID REFERENCES profiles(id),
  category    VARCHAR(100),
  tags        TEXT[],
  status      VARCHAR(20) DEFAULT 'draft',
  seo_title   VARCHAR(255),
  seo_desc    VARCHAR(500),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- FREE RESOURCES
free_resources (
  id          SERIAL PRIMARY KEY,
  title_bn    VARCHAR(255) NOT NULL,
  subject     VARCHAR(100),
  class_level VARCHAR(50),
  file_url    TEXT NOT NULL,
  file_type   VARCHAR(20),
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE
)

-- SETTINGS
settings (
  key         VARCHAR(255) PRIMARY KEY,
  value       JSONB,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
)
```

---

## OUTPUT 13 — ADMIN SYSTEM

### Admin Dashboard Structure

```
/admin
├── / Dashboard Overview
│       ├── Today's stats: enrollments, revenue, new users
│       ├── Weekly revenue chart
│       ├── Active courses list
│       └── Recent order feed
│
├── /courses
│       ├── List all courses (filter: status, category, instructor)
│       ├── Create / Edit / Delete course
│       ├── Manage sections and lessons
│       ├── Upload videos (Bunny Stream API)
│       ├── Attach PDFs and resources
│       └── Set pricing, discounts, visibility
│
├── /categories
│       ├── List categories + subcategories
│       ├── Create / Edit / Reorder / Delete
│       └── Set icons, thumbnails, visibility
│
├── /students
│       ├── Search by name/phone
│       ├── View enrollments, progress, orders
│       ├── Manual enrollment
│       └── Suspend / Ban account
│
├── /instructors
│       ├── List all instructors
│       ├── Assign to courses
│       ├── View revenue per instructor
│       └── Manage credentials and bio
│
├── /orders
│       ├── All orders: filter by status, date, course
│       ├── View order details
│       ├── Process refunds
│       └── Export to CSV
│
├── /payments
│       ├── Transaction log
│       ├── Gateway status (SSLCommerz)
│       └── Settlement reports
│
├── /coupons
│       ├── Create coupon (% / fixed, per-course / global)
│       ├── Set limits, expiry, minimum order
│       └── Usage stats
│
├── /reviews
│       ├── Pending moderation queue
│       ├── Approve / Reject / Feature
│       └── Flag inappropriate content
│
├── /certificates
│       ├── View issued certificates
│       ├── Manual issue/revoke
│       └── Certificate template management
│
├── /blog
│       ├── Create / Edit / Publish / Unpublish posts
│       ├── SEO fields
│       └── Category and tag management
│
├── /notifications
│       ├── Send bulk notification (by segment: course, batch, all users)
│       ├── SMS blast (via bulk SMS API)
│       └── Notification history
│
├── /free-resources
│       ├── Upload / manage downloadable files
│       └── Organize by class/subject
│
├── /analytics
│       ├── Traffic: page views, sessions
│       ├── Conversion funnel
│       ├── Revenue over time
│       ├── Top courses by enrollment
│       └── Instructor performance
│
├── /settings
│       ├── Site name, logo, favicon
│       ├── Contact info, social links
│       ├── Payment gateway configuration
│       ├── SMS/email provider keys
│       └── Feature flags
│
└── /permissions
        ├── Role management: Super Admin / Admin / Instructor / Support
        └── Module access control per role
```

---

## OUTPUT 14 — SEO ARCHITECTURE

### Current EdgeCourse BD SEO Assessment

**Strengths:**
- Full meta description per page
- OG tags: title, description, image, locale (bn_BD)
- Twitter Card: summary_large_image
- Canonical URLs set correctly
- Googlebot directives with snippet/image preview controls
- App store meta tags (Apple Web App, mobile-web-app-capable)

**Gaps:**
- No JSON-LD Course schema detected
- No BreadcrumbList schema
- No FAQ schema on course pages
- Blog content not confirmed with schema
- `meta-google-site-verification: your-google-verification-code` — placeholder still in place (bug)
- URL structure for categories uses query params (`?category_type=normal`) — not ideal for indexing

### Recommended SEO Architecture for New Platform

```
URL STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/                             → Homepage
/courses                      → All courses
/courses/hsc-science          → Category
/courses/hsc-science/physics  → Subcategory
/courses/hsc-science/physics/class-name-slug → Course detail
/blog                         → Blog index
/blog/how-to-prepare-hsc-2026 → Article
/teachers                     → Instructor directory
/teachers/instructor-name-slug → Instructor profile

SCHEMA MARKUP (JSON-LD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Homepage:       Organization, WebSite, SiteNavigationElement
Course pages:   Course, Product (with Offer), AggregateRating
Blog articles:  Article, BlogPosting, BreadcrumbList
Instructor:     Person, ProfilePage
FAQ page:       FAQPage
```

```json
// Course page schema example
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "HSC-28 Academic to Admission Course (Science)",
  "description": "...",
  "provider": { "@type": "Organization", "name": "EdgeCourse BD" },
  "offers": {
    "@type": "Offer",
    "price": "5499",
    "priceCurrency": "BDT",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "11123"
  }
}
```

**Sitemap:**
- `/sitemap.xml` — auto-generated by Next.js, includes all course, category, blog, and instructor pages
- `/robots.txt` — allow all crawlers; disallow `/admin`, `/dashboard`, `/checkout`, `/api`

**Internal Linking:**
- Course detail → related courses in same category
- Blog article → relevant course CTAs
- Category page → featured courses
- Instructor page → their courses

---

## OUTPUT 15 — PERFORMANCE STRATEGY

### Next.js Optimizations

```
IMAGE OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use next/image for ALL images (already done partially by EdgeCourse)
- sizes prop with responsive breakpoints
- priority={true} for above-fold course thumbnails and hero
- placeholder="blur" with blurDataURL for progressive loading
- WebP/AVIF format auto-conversion
- CloudFront CDN in front of S3

FONTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- next/font/google with display:'swap'
- Preload critical fonts in <head>
- Use variable fonts to reduce font requests
- Subset to Bengali + Latin characters only

CODE SPLITTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Dynamic import() for heavy components: video player, 3D hero, chart libs
- React.lazy for dashboard components
- Route-based splitting (automatic with App Router)
- 3D/WebGL chunk isolated and only loaded on interaction

SERVER RENDERING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Homepage:       ISR (60-second revalidation for course updates)
Course detail:  ISR (5-minute revalidation)
Category pages: ISR (5-minute revalidation)
Blog articles:  SSG (revalidate on publish)
Dashboard:      Client-side (fully dynamic, private)
Course player:  Client-side (user-specific data)

CACHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- CloudFront cache for static assets (1 year immutable)
- ISR for public pages
- Supabase query caching with SWR/React Query on client
- Service Worker for PWA offline support (course materials)

BUNDLE REDUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Tree-shake unused shadcn/ui components
- Import only needed lodash functions
- Analyze bundle with @next/bundle-analyzer regularly

CORE WEB VITALS TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LCP:  < 2.5s  (optimize hero image loading)
INP:  < 200ms (avoid heavy JS on main thread)
CLS:  < 0.1   (reserve space for images with aspect-ratio)
TTFB: < 800ms (Vercel Edge near BD users)

VIDEO PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- HLS adaptive bitrate streaming (Bunny Stream)
- Thumbnail preview on video scrub
- Auto quality based on bandwidth detection
- Offline download for app users (DRM-wrapped)
```

---

## OUTPUT 16 — ACCESSIBILITY

### Accessibility Requirements

```
KEYBOARD NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- All interactive elements focusable: Tab order logical
- Skip-to-main-content link at page top
- Modal traps focus; Escape closes
- Course player: keyboard shortcuts (Space=play/pause, Arrow=seek, F=fullscreen)
- Menu navigation: arrow keys for dropdown items

ARIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- aria-label on icon-only buttons (search, close, play)
- aria-expanded on accordion/dropdown toggles
- aria-live="polite" for toast notifications
- role="status" for loading states
- aria-describedby linking error messages to inputs
- aria-current="page" on active nav items

FOCUS STATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Visible focus ring on all interactive elements
- Use focus-visible (not focus) to only show ring for keyboard
- Minimum 3:1 contrast ratio for focus indicator

COLOR CONTRAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Body text on white background: minimum 4.5:1 (WCAG AA)
- Large text / headings: minimum 3:1
- Button text on brand blue: white — verify passes AA
- No information conveyed by color alone (add icons to status)

FORMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- All inputs have visible <label> (not just placeholder)
- Error messages associated via aria-describedby
- Required fields marked with aria-required="true"
- Success/error states announced to screen readers

SCREEN READERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Course card images: alt="[Course title] thumbnail"
- Instructor photos: alt="Photo of [Name]"
- Decorative images: alt="" (empty, hidden from screen readers)
- Bengali text renders correctly (Unicode, proper lang="bn" tag)

REDUCED MOTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@media (prefers-reduced-motion: reduce) {
  /* Disable all scroll animations, transitions */
  /* Substitute 3D rotation with static image */
  /* Keep only functional transitions (modal open/close) */
}

TOUCH TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Minimum 44×44px on all interactive elements
Adequate spacing between tap targets (8px minimum)

SEMANTIC HTML
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<nav>, <main>, <aside>, <section>, <article>, <header>, <footer>
Proper heading hierarchy: one <h1> per page, logical h2→h3→h4
<button> for actions, <a> for navigation
<ul>/<li> for course lists, navigation
```

---

## OUTPUT 17 — COMPETITOR COMPARISON

### Scoring Matrix (1–10)

| Criterion | EdgeCourse BD | 10 Minute School | Shikho | Coursera | Udemy |
|---|---|---|---|---|---|
| **Design** | 5 | 7 | 7 | 8 | 7 |
| **UX** | 6 | 7 | 7 | 8 | 7 |
| **Navigation** | 6 | 7 | 7 | 8 | 7 |
| **Animation** | 3 | 5 | 6 | 7 | 6 |
| **Mobile** | 7 | 8 | 8 | 7 | 8 |
| **Performance** | 6 | 6 | 7 | 7 | 7 |
| **Course UX** | 7 | 7 | 7 | 8 | 8 |
| **Conversion** | 8 | 7 | 7 | 7 | 8 |
| **Accessibility** | 4 | 5 | 5 | 8 | 7 |
| **SEO** | 7 | 7 | 7 | 9 | 9 |
| **TOTAL** | **59** | **64** | **66** | **77** | **74** |

*Note: 10 Minute School and Shikho are Bangladesh-native EdTech competitors. Coursera/Udemy are global benchmarks.*

### Best Patterns to Adopt

| Pattern | Best Example | Why It Works |
|---|---|---|
| Course discovery + filtering | Udemy | Multi-filter (topic/level/rating/duration) reduces scroll fatigue |
| Mobile course player | Shikho app | Offline-first, bottom nav, persistent resume |
| Social proof placement | EdgeCourse BD | Enrollment count directly on card — excellent friction reducer |
| Price anchoring | EdgeCourse BD | Strikethrough + discount price effective for BD market |
| Instructor credential display | EdgeCourse BD | Institution tags build trust in credential-culture market |
| Progress visualization | Coursera | Weekly goal tracker + streak system drives retention |
| Free resource funneling | EdgeCourse BD | Great lead gen concept, poor execution (table vs cards) |
| Blog for SEO | 10 Minute School | Heavy content marketing drives organic traffic |
| Animated hero | Global EdTech trend | Video/3D heroes improve time-on-page and emotional connection |
| Dashboard sidebar | Coursera | Clear section hierarchy: In Progress / Completed / Explore |

---

## OUTPUT 18 — FINAL PRODUCT BLUEPRINT

### Platform Name Concept: **EduEdge BD** (or your brand name)

### Core Identity
- Bengali-first, mobile-first, Bangladesh-focused
- Full EdTech ecosystem (courses + exams + books + tools)
- Affordable premium feel — looks international, priced locally
- Trust through credentials, results, and community
- Offline-capable, low-bandwidth optimized

### Homepage Architecture (New)

```
[STICKY NAVBAR]
Logo | Nav links (5 max) | Search (expandable) | Login | Enroll CTA

[HERO SECTION — FULL VIEWPORT]
Dark background | Tagline in Bengali | Subtext | Two CTAs
3D floating graduation cap (desktop) / Static illustration (mobile)
↳ "১০ লক্ষ শিক্ষার্থীর সেরা পছন্দ" badge

[TRUST BAR]
1M+ Students | 15k+ Lessons | 120+ Instructors | 5k+ Materials
(Animated count-up on scroll-into-view)

[COURSE CATEGORIES]
8 cards in responsive grid, icon + Bengali title + course count
Hover: brand-blue border + slight elevation

[FEATURED COURSES]
"Premium Picks" horizontal scroll
Card: thumbnail + batch label + title + price + enrollment count + CTA

[TABBED COURSE SECTIONS]
HSC Academic | Admission | SSC | Private Uni | English Version
Each tab: 3-column grid, lazy loaded

[WHY CHOOSE US]
3-column icon grid on desktop, 2-column on mobile
6 USPs with distinct icons (not stock SVGs)

[ECOSYSTEM BLOCK]
QZ Test promo | App download | QNA Books — 3-column cards

[VIDEO GUIDE SECTION]
YouTube-style grid with thumbnails — 6 featured videos

[STUDENT SUCCESS STORIES]
Auto-scrolling testimonial carousel + static grid below
Real names + batch + exam result mentioned

[INSTRUCTOR SHOWCASE]
5-column grid of top instructors with credential tags

[BLOG / CONTENT HUB PREVIEW]
3 latest articles — card format with reading time
CTA: "আরো পড়ো"

[CTA BANNER — FULL WIDTH]
"আজই শুরু করো" + primary enrollment CTA
Light blue gradient background

[FOOTER]
4-column: Study | Company | Policy | Other Platforms
Payment methods | Social links | App badge | © 2026
```

### Premium Design Principles for New Platform

1. **Generous white space** — breathe between sections
2. **Dark hero** — blue-dark gradient, creates contrast and premium feel
3. **Card elevation on hover** — subtle but present; shows interactivity
4. **Bengali headlines, English labels** — mixed bilingually where natural
5. **Brand blue (#1A56DB) + Accent orange (#F97316)** — trust + urgency
6. **Hind Siliguri for Bengali + Inter for English** — optimized pair
7. **Animated stats counter** — makes social proof feel alive
8. **Skeleton loaders** — professional loading state
9. **Micro-interactions on CTAs** — scale down on press, scale up on hover
10. **Progress visualization in dashboard** — circular progress rings, not just percentages

---

## OUTPUT 19 — BUILD PLAN

### Implementation Order (Agile Sprints)

```
SPRINT 0 — Setup (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Next.js 15 project scaffold (App Router, TypeScript)
□ Tailwind CSS v4 + shadcn/ui setup
□ Supabase project creation + schema deployment
□ Vercel project + env variables
□ ESLint + Prettier + Husky
□ Design token file (colors, typography, spacing)
□ Git repository + branch strategy

SPRINT 1 — Design System (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Typography scale (Hind Siliguri + Inter)
□ Color tokens in Tailwind config
□ Base components: Button, Input, Badge, Avatar, Card
□ Skeleton loader component
□ Toast/notification component (shadcn)
□ Icon system (Lucide React + custom SVGs)
□ Responsive grid utilities

SPRINT 2 — Global Components (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Navbar (desktop + mobile drawer)
□ Footer (4-column + payment logos)
□ SEO component (meta, OG, JSON-LD)
□ Page layout wrapper
□ Loading states (skeleton cards)

SPRINT 3 — Homepage (1.5 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Hero section (dark, tagline, CTAs)
□ Stats counter section (Framer Motion count-up)
□ Category grid
□ Course card component
□ Featured courses horizontal scroll
□ Tabbed course sections (HSC/SSC/Admission)
□ Why Choose Us section
□ Testimonial carousel
□ Instructor grid section
□ App download / ecosystem block
□ Video playlist grid

SPRINT 4 — Course System (2 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Category browser page
□ Subcategory page with course grid
□ Course detail page (curriculum, instructor, reviews, CTA)
□ Course card hover animations
□ Course search (Algolia integration)
□ Filtering system (price, type, level)

SPRINT 5 — Authentication (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Supabase Auth setup (phone OTP)
□ Login page (phone input + OTP verification)
□ Registration page (with profile setup)
□ Protected route middleware
□ Auth context provider
□ Session persistence

SPRINT 6 — Student Dashboard (1.5 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Dashboard layout (sidebar + main content)
□ My Courses grid (enrolled, with progress rings)
□ Progress tracking (lesson completion)
□ Profile edit page
□ Certificate view page
□ Order history page
□ Notifications panel

SPRINT 7 — Course Player (1.5 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Bunny Stream video player integration
□ Lesson sidebar with completion tracking
□ PDF resource viewer
□ Progress save (auto-save every 30s)
□ Previous/Next lesson navigation
□ Keyboard shortcuts

SPRINT 8 — Payments (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Checkout page (course summary, coupon, total)
□ SSLCommerz integration (bKash, Nagad, Card)
□ Payment webhook handler
□ Order creation and enrollment trigger
□ Success / failure pages
□ Email + SMS confirmation

SPRINT 9 — Admin Panel (2 weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Admin layout and sidebar navigation
□ Course CRUD (with section and lesson management)
□ Category management
□ Student management
□ Order management
□ Coupon management
□ Free resource management
□ Blog CMS
□ Analytics dashboard overview

SPRINT 10 — Animations & 3D (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Framer Motion scroll animations (all sections)
□ Card hover effects
□ Navbar scroll behavior
□ Modal / drawer transitions
□ Stats count-up animation
□ R3F hero 3D element (desktop only, lazy loaded)
□ Certificate reveal animation

SPRINT 11 — SEO & Performance (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ JSON-LD schema for all page types
□ Sitemap generation (next-sitemap)
□ robots.txt
□ Core Web Vitals audit and fixes
□ Image optimization audit
□ Bundle size analysis
□ ISR configuration for public pages

SPRINT 12 — Testing & QA (1 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Unit tests (Vitest): utilities, components
□ Integration tests (Playwright): full enrollment flow
□ Accessibility audit (axe-core)
□ Cross-browser testing (Chrome, Firefox, Safari)
□ Mobile device testing (Android-first)
□ Load testing (k6) on /courses and checkout

SPRINT 13 — Deployment (0.5 week)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Vercel production deployment
□ Custom domain + SSL
□ CloudFront CDN configuration
□ Supabase production project
□ Environment variable audit
□ Monitoring setup (Sentry + Posthog)
□ Backup strategy (Supabase daily snapshots)
□ Launch checklist review
```

**Total Estimated Timeline: ~14–16 weeks with a 3-4 person team**

---

## OUTPUT 20 — AGENT BUILD SPECIFICATION

### Master Developer Specification

---

#### 1. PAGE STRUCTURE

```
app/
├── (public)/
│   ├── page.tsx                    → Homepage
│   ├── categories/page.tsx         → Category browser
│   ├── subcategories/[id]/page.tsx → Subcategory courses
│   ├── courses/[slug]/page.tsx     → Course detail
│   ├── free-resources/page.tsx     → Free resource hub
│   ├── eligibility-calculator/     → Tool page
│   ├── syllabus-calculator/        → Tool page
│   ├── admission26/page.tsx        → Seasonal campaign
│   ├── college-guide/page.tsx      → Guide page
│   ├── teachers/page.tsx           → Instructor directory
│   ├── teachers/[slug]/page.tsx    → Instructor profile
│   ├── blog/page.tsx               → Blog listing
│   ├── blog/[slug]/page.tsx        → Article
│   ├── about/page.tsx              → About
│   ├── company/[slug]/page.tsx     → Company pages
│   └── content/[slug]/page.tsx     → Policy pages
│
├── (auth)/
│   ├── login/page.tsx              → Login (OTP)
│   └── register/page.tsx          → Registration
│
├── (protected)/
│   ├── dashboard/page.tsx          → My courses overview
│   ├── dashboard/profile/          → Edit profile
│   ├── dashboard/progress/         → Learning progress
│   ├── dashboard/certificates/     → Certificates
│   ├── dashboard/orders/           → Order history
│   ├── course-player/[id]/page.tsx → Video lesson player
│   └── checkout/[courseId]/page.tsx → Checkout flow
│
├── (admin)/
│   ├── admin/page.tsx              → Admin dashboard
│   ├── admin/courses/              → Course management
│   ├── admin/students/             → Student management
│   ├── admin/orders/               → Order management
│   └── ...
│
└── api/
    ├── webhooks/sslcommerz/route.ts
    ├── webhooks/bkash/route.ts
    └── ...
```

---

#### 2. COMPONENT STRUCTURE

```
components/
├── global/
│   ├── Navbar.tsx
│   ├── MobileDrawer.tsx
│   ├── Footer.tsx
│   └── SEO.tsx
├── ui/                              → shadcn/ui + custom
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   ├── Skeleton.tsx
│   ├── Modal.tsx
│   ├── Tabs.tsx
│   ├── Toast.tsx
│   └── Avatar.tsx
├── courses/
│   ├── CourseCard.tsx               → Main course card
│   ├── CourseGrid.tsx               → Responsive grid
│   ├── CourseTabs.tsx               → Tabbed course sections
│   ├── CourseHero.tsx               → Detail page hero
│   ├── CourseCurriculum.tsx         → Lesson accordion
│   └── CourseReviews.tsx
├── categories/
│   ├── CategoryGrid.tsx
│   ├── CategoryTile.tsx
│   └── CategoryFilter.tsx
├── home/
│   ├── HeroSection.tsx
│   ├── StatsBar.tsx                 → Animated counters
│   ├── FeaturedCourses.tsx
│   ├── WhyChooseUs.tsx
│   ├── TestimonialCarousel.tsx
│   ├── InstructorShowcase.tsx
│   ├── EcosystemBlock.tsx
│   └── VideoPlaylist.tsx
├── player/
│   ├── VideoPlayer.tsx              → Bunny Stream embed
│   ├── LessonList.tsx
│   └── ProgressTracker.tsx
├── dashboard/
│   ├── DashboardSidebar.tsx
│   ├── CourseProgressCard.tsx
│   ├── CertificateCard.tsx
│   └── OrderItem.tsx
├── checkout/
│   ├── CheckoutSummary.tsx
│   ├── CouponInput.tsx
│   └── PaymentMethodSelector.tsx
└── 3d/
    ├── HeroScene.tsx                → R3F hero component
    └── FloatingObjects.tsx
```

---

#### 3. DESIGN RULES

- Bengali headings: `font-hind-siliguri font-bold`
- English labels/prices: `font-inter font-semibold`
- Primary CTA: `bg-[#1A56DB] text-white hover:bg-[#1241A8] active:scale-[0.98]`
- Discount badge: `bg-[#F97316] text-white text-sm font-bold`
- Success state: `text-[#16A34A]`
- All cards: `rounded-xl shadow-md hover:shadow-xl transition-all duration-200`
- Section spacing: `py-16 md:py-24`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Avoid generic eyebrow labels above every heading
- Headings sentence case (not ALL CAPS)
- Max line length: 65 characters for body text

---

#### 4. ANIMATION RULES

```typescript
// Scroll reveal — use on every section component
const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Stagger children (course cards, instructor cards)
const containerVariants = {
  visible: { transition: { staggerChildren: 0.05 } }
};

// Stats counter — useEffect with requestAnimationFrame
// Respect prefers-reduced-motion — check matchMedia before animating
// 3D: dynamic import with { ssr: false } — never SSR WebGL
// Max animation duration: 600ms; most transitions < 300ms
```

---

#### 5. 3D RULES

```typescript
// components/3d/HeroScene.tsx
import dynamic from 'next/dynamic';
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <StaticHeroIllustration />
});

// Only render on lg: screens
// Keep polygon count < 5,000 per object
// Use @react-three/drei Environment for lighting (no real-time shadows)
// Gentle float animation: y oscillation ±0.3, period 4s
// Disable on prefers-reduced-motion
```

---

#### 6. RESPONSIVE RULES

```
Mobile (default):  1 column, bottom sheet modals, hamburger nav
md (768px+):       2 columns for cards, inline tabs, partial nav
lg (1024px+):      3 columns, full nav, sidebar layouts
xl (1280px+):      4–5 columns for instructor/category grids, 3D enabled

Images: always include width/height, use sizes="(max-width: 768px) 100vw, 33vw"
Course grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Category grid: grid-cols-2 md:grid-cols-4 lg:grid-cols-8
Instructor grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-5
```

---

#### 7. SECURITY REQUIREMENTS

```
AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Supabase RLS: users can only read their own enrollments, progress, orders
- JWT tokens: 1-hour expiry with refresh rotation
- Phone OTP: 6-digit, 5-minute expiry, max 3 attempts before lockout
- Admin routes: separate role check middleware beyond auth

API SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Payment webhooks: verify SSLCommerz signature on every callback
- Rate limiting: 10 OTP requests per phone per hour
- CORS: only allow from app domains
- Input validation: Zod schemas on all API inputs
- SQL: Supabase ORM with parameterized queries (no raw SQL with user input)

VIDEO SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Bunny Stream: token-signed URLs (expire after 6h)
- Never expose raw video URLs to client without auth check
- DRM: Bunny Stream DRM for premium courses

CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- CSP headers: restrict script/style sources
- No sensitive data in client-side code or localStorage
- Environment variables: never expose secret keys to browser
```

---

#### 8. DEPLOYMENT REQUIREMENTS

```
VERCEL CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Production: main branch auto-deploy
- Preview: PR branches get preview URLs
- Environment: NEXT_PUBLIC_* for client, private for server
- Edge functions: auth middleware, payment webhooks
- Regions: preferably Southeast Asia (sgp1) for latency

INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Supabase: Production project (separate from dev)
- AWS S3: ap-southeast-1 (Singapore) bucket for low latency
- CloudFront: CDN distribution in front of S3
- Bunny Stream: Edge storage + HLS encoding enabled
- Resend: Custom domain email (courses@yourdomain.com)

MONITORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Sentry: error tracking, performance monitoring
- Posthog: product analytics, feature flags
- Uptime: Better Stack or Vercel Speed Insights
- Alerts: Slack webhook for payment failures, error spikes

BACKUPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Supabase daily automatic backups (Pro plan)
- S3: versioning enabled
- Database: weekly pg_dump to separate bucket
```

---

#### 9. FEATURE CHECKLIST (MVP Launch)

```
□ Homepage with all sections
□ Course category browser
□ Course detail with curriculum preview
□ Phone OTP authentication
□ Student registration and profile
□ Checkout with bKash/Nagad/Card via SSLCommerz
□ Course enrollment and access control
□ Video lesson player (Bunny Stream)
□ PDF resource download
□ Student dashboard: my courses + progress
□ Admin: course + lesson management
□ Admin: order management
□ Free resources page
□ About page
□ Policy pages (refund, privacy, T&C)
□ SEO: meta, OG, JSON-LD schema
□ Mobile responsive (mobile-first)
□ Analytics (Posthog basic)
□ Error tracking (Sentry)
□ Sitemap + robots.txt
```

---

*Document compiled from full reverse-engineering of edgecoursebd.com (EdgeCourse / HulkenStein Bangladesh), September 2026.*  
*This blueprint is original in structure, design system, component architecture, and implementation specification.*  
*It is intended as a master specification for building a new, superior education platform inspired by — but not copying — the reference.*
