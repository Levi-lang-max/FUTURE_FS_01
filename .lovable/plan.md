## Portfolio Website for Abrham Belay

An elegant, modern single-page portfolio with smooth scrolling between sections, refined typography, generous whitespace, and a soft neutral palette with subtle accent color.

### Sections

**1. Hero**
- Name: Abrham Belay
- Title: Full Stack Web Development Intern
- Tagline: Aspiring Software Developer & Problem Solver
- Subtle CTA buttons: "View Projects" and "Get in Touch"
- Soft background gradient / decorative element

**2. About Me**
- Bio: Grade 11 student from Ethiopia, passionate about technology, web development, and innovation. Building websites, solving real-world problems, learning modern technologies.
- Skills displayed as elegant chips: HTML, CSS, JavaScript, Flask, GitHub
- Brief note on current focus (hands-on projects and internships)

**3. Projects** (card grid)
1. Personal Portfolio Website — responsive site built with HTML, CSS, JavaScript
2. School Portal Website — Firebase-based school portal with login
3. EcoMars Human Habitat Initiative — Vulcan City, futuristic Mars orbit concept
4. Space Junk Cleaner Project — GFSSM competition entry on orbital debris cleaning

Each card: title, short description, tech/tags. (No live links since none provided — easy to add later.)

**4. Contact**
- Form fields: Name, Email, Message
- On submit: saves to database AND sends email notification to abresh45belay@gmail.com
- Also sends a confirmation email to the visitor
- Displays email contact: abresh45belay@gmail.com
- Toast feedback on success/error

### Design

- Style: Elegant & modern — serif display headings (e.g., Playfair/Fraunces feel) paired with clean sans-serif body
- Light theme, soft off-white background, deep ink text, single warm accent color
- Smooth scroll, subtle fade-in on section enter, hover lift on project cards
- Sticky minimal top nav with section links
- Fully responsive (mobile-first)

### SEO & Polish

- Per-page meta: title "Abrham Belay — Full Stack Web Development Intern", description, Open Graph + Twitter card tags
- Semantic HTML, proper heading hierarchy
- Favicon

### Backend (Lovable Cloud)

- `contact_messages` table (name, email, message, created_at) with RLS — public insert allowed, reads restricted
- Server function for submission: validates input (zod), inserts to DB, queues notification email to owner + confirmation email to sender
- Lovable Emails for sending (will prompt to set up sender domain on first run)

### Technical Notes

- TanStack Start with file-based routes; single `/` route with anchored sections
- shadcn/ui components (Button, Input, Textarea, Card, Toast)
- Input validation with zod (length limits, email format)

### Easy to Extend Later

- Add profile photo (drop into hero)
- Add project links/images
- Add social links (GitHub, LinkedIn)
