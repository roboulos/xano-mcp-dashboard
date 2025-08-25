# Shadcn Blocks Comprehensive Catalog

## Overview
Shadcn Blocks provides 730+ pre-built components that extend shadcn/ui. These components are organized into categories and can be installed using the shadcn CLI.

## Installation Pattern
All components follow the same installation pattern:
```bash
npx shadcn add [component-id]
```

For example:
```bash
npx shadcn add hero1
npx shadcn add feature17
npx shadcn add footer2
```

## Prerequisites
Before using shadcn blocks, ensure your project has:
- Tailwind CSS configured
- shadcn/ui installed
- React (Next.js, Vite, Astro, etc.)
- A valid `components.json` file from shadcn/ui setup

## Component Categories (730 Total)

### 1. Hero Sections (147 components)
**Purpose**: Landing page hero sections with various layouts and features
- **Component IDs**: hero1 through hero147
- **Common Features**: Headlines, CTAs, images, badges, animations
- **Example Components**:
  - `hero1` - Two-column layout with badge, heading, description, buttons, and image
  - `hero7` - Free component with avatar testimonials
  - `hero10` - Split layout with gradient backgrounds
  - `hero25` - Video background support
  - `hero32` - Animated text effects

### 2. Feature Sections (239 components)
**Purpose**: Showcase product features, benefits, and capabilities
- **Component IDs**: feature1 through feature239
- **Common Features**: Icon grids, feature lists, comparison tables, cards
- **Example Components**:
  - `feature3` - Three-column feature cards
  - `feature17` - Feature grid with icons
  - `feature43` - Bento-style feature layout
  - `feature51` - Timeline-based features
  - `feature74` - Interactive feature tabs

### 3. Footer Sections (15 components)
**Purpose**: Website footer with links, social media, and company info
- **Component IDs**: footer1 through footer15
- **Common Features**: Multi-column layouts, newsletter forms, social links
- **Example Components**:
  - `footer2` - Simple footer with links
  - `footer7` - Footer with newsletter signup

### 4. Pricing Tables (32 components)
**Purpose**: Display pricing plans and tiers
- **Component IDs**: pricing1 through pricing32
- **Common Features**: Pricing cards, comparison tables, toggle monthly/yearly
- **Example Components**:
  - `pricing4` - Three-tier pricing cards

### 5. Testimonials (27 components)
**Purpose**: Customer reviews and social proof
- **Component IDs**: testimonial1 through testimonial27
- **Common Features**: Quote cards, avatar displays, carousel options
- **Example Components**:
  - `testimonial10` - Grid layout testimonials
  - `testimonial14` - Carousel testimonials

### 6. Contact Forms (12 components)
**Purpose**: Contact and inquiry forms
- **Component IDs**: contact1 through contact12
- **Common Features**: Form fields, validation, map integration
- **Example Components**:
  - `contact2` - Simple contact form
  - `contact7` - Contact with map

### 7. CTA Sections (24 components)
**Purpose**: Call-to-action sections
- **Component IDs**: cta1 through cta24
- **Common Features**: Bold headlines, action buttons, background patterns
- **Example Components**:
  - `cta4` - Centered CTA with gradient
  - `cta10` - Split layout CTA
  - `cta13` - CTA with illustration

### 8. Blog Layouts (20 components)
**Purpose**: Blog post listings and grids
- **Component IDs**: blog1 through blog20
- **Common Features**: Post cards, categories, pagination
- **Example Components**:
  - `blog6` - Three-column blog grid
  - `blog7` - Blog with sidebar
  - `blog8` - Masonry blog layout

### 9. FAQ Sections (15 components)
**Purpose**: Frequently asked questions
- **Component IDs**: faq1 through faq15
- **Common Features**: Accordion layouts, search functionality
- **Example Components**:
  - `faq1` - Simple accordion FAQ
  - `faq5` - Two-column FAQ layout

### 10. About Sections (8 components)
**Purpose**: Company/team information
- **Component IDs**: about1 through about8
- **Common Features**: Team grids, company stories, mission statements
- **Example Components**:
  - `about1` - Company story section

### 11. Login/Signup Forms (17 components total)
- **Login Forms** (7 components): login1 through login7
- **Signup Forms** (10 components): signup1 through signup10
- **Common Features**: Social login, validation, remember me options

### 12. Navigation/Navbar (9 components)
**Purpose**: Header navigation components
- **Component IDs**: navbar1 through navbar9
- **Common Features**: Responsive menus, dropdowns, search
- **Example Components**:
  - `navbar1` - Basic navigation bar

### 13. Logo Sections (10 components)
**Purpose**: Client/partner logo displays
- **Component IDs**: logos1 through logos10
- **Common Features**: Logo grids, carousels, animations
- **Example Components**:
  - `logos3` - Logo grid display

### 14. Gallery (40 components)
**Purpose**: Image and media galleries
- **Component IDs**: gallery1 through gallery40
- **Common Features**: Lightbox, filters, masonry layouts

### 15. Stats/Metrics (14 components)
**Purpose**: Display statistics and KPIs
- **Component IDs**: stats1 through stats14
- **Common Features**: Animated counters, charts, progress bars

### 16. Team Sections (10 components)
**Purpose**: Team member displays
- **Component IDs**: team1 through team10
- **Common Features**: Member cards, social links, bios

### 17. Timeline (13 components)
**Purpose**: Timeline and roadmap displays
- **Component IDs**: timeline1 through timeline13
- **Common Features**: Vertical/horizontal layouts, milestones

### 18. Services (13 components)
**Purpose**: Service offerings display
- **Component IDs**: services1 through services13
- **Common Features**: Service cards, icons, descriptions

### 19. Integration Sections (15 components)
**Purpose**: Show app integrations
- **Component IDs**: integration1 through integration15
- **Common Features**: Integration logos, connection flows

### 20. Careers (8 components)
**Purpose**: Job listings and career pages
- **Component IDs**: careers1 through careers8
- **Common Features**: Job cards, filters, application forms
- **Example Components**:
  - `careers1` - Job listing grid
  - `careers4` - Career page hero

### 21. Additional Categories

**Banner** (6 components): banner1-banner6
**Bento** (4 components): bento1-bento4
**Blog Post** (6 components): blogpost1-blogpost6
**Case Studies** (6 components): casestudies1-casestudies6
**Case Study** (3 components): casestudy1-casestudy3
**Changelog** (7 components): changelog1-changelog7
**Community** (7 components): community1-community7
**Compare** (8 components): compare1-compare8
**Component** (2 components): component1-component2
**Content** (4 components): content1-content4
**Download** (5 components): download1-download5
**List** (2 components): list1-list2
**Product** (2 components): product1-product2
**Resource** (1 component): resource1
**Resources** (4 components): resources1-resources4

## Accessing Components

### Free vs Premium
- Some components are free (e.g., hero7)
- Most components require a Pro or Premium plan
- Free components can be copied directly from the website

### Dependencies
Components often depend on shadcn/ui base components. Before using a block, install required dependencies:

```bash
# Example: If a component uses Button and Avatar
npx shadcn@latest add button avatar
```

### Component Preview
Each component can be previewed at:
```
https://www.shadcnblocks.com/block/[component-id]
```

For example:
- https://www.shadcnblocks.com/block/hero1
- https://www.shadcnblocks.com/block/feature17

## Tips for Using the Catalog

1. **Start with free components** to test the system
2. **Check dependencies** - each component page shows required shadcn/ui components
3. **Use the preview** - full-screen previews available for each component
4. **Mix and match** - components are designed to work together
5. **Customize freely** - all components use Tailwind classes for easy customization

## CLI Usage Examples

```bash
# Install a hero section
npx shadcn add hero32

# Install multiple components
npx shadcn add hero1 feature3 footer2

# Install with dependencies
npx shadcn@latest add button avatar badge
npx shadcn add hero1
```

## Notes
- Total of 730 components as of the last update
- New blocks are added monthly (50+ per month)
- All components are built with React, Tailwind CSS, and shadcn/ui
- Components are not AI-generated but professionally designed
- Lifetime access available with one-time payment plans
EOF < /dev/null