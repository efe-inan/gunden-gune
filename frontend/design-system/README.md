# Design System

A comprehensive, modern design system for the 21-day personal development platform. Built with React, TypeScript, and Framer Motion.

## 📋 Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Shadows](#shadows)
- [Animations](#animations)
- [Components](#components)
- [Layouts](#layouts)

---

## 🎨 Color Palette

### Primary Colors

Inspired by Khaki/Sage green tones, conveying calm and trustworthiness.

```typescript
import { colors } from './colors';

colors.primary[50]  // '#F0F3EC' - Lightest
colors.primary[100] // '#E1E7D9'
colors.primary[200] // '#C9D3B7'
colors.primary[300] // '#AFC093'
colors.primary[400] // '#96AE72'
colors.primary[500] // '#8B9A6D' - Main brand color
colors.primary[600] // '#75835C'
colors.primary[700] // '#5E6A4A'
colors.primary[800] // '#4B543C'
colors.primary[900] // '#3F4733' - Darkest
```

### Secondary Colors

Beige/Cream tones for backgrounds and subtle elements.

```typescript
colors.secondary[50]  // '#FAF9F6'
colors.secondary[100] // '#F5F1E8' - Light background
colors.secondary[200] // '#E8E4D9' - Border color
colors.secondary[500] // '#C1BD8D'
colors.secondary[900] // '#7A7E49'
```

### Accent Colors

Soft Gold/Bronze for highlights and calls-to-action.

```typescript
colors.accent[400] // '#D4A853' - Main accent
colors.accent[500] // '#C49A43'
```

### Background Colors

Off-white tones for a clean, natural look.

```typescript
colors.background[50]  // '#FCFBF9'
colors.background[100] // '#F9F8F4' - Main background
colors.background[200] // '#F4F2EA' - Hover state
colors.background[400] // '#EAE7D6' - Border
```

### Text Colors

Dark Olive for high readability and warmth.

```typescript
colors.text[50]  // '#8B8F85' - Muted
colors.text[100] // '#7A7E75' - Subtitle
colors.text[200] // '#686C64'
colors.text[300] // '#575B54' - Body
colors.text[400] // '#4A4F42' - Heading
colors.text[500] // '#3D4237' - Strong
```

### Semantic Colors

Soft, muted variations for feedback states.

```typescript
colors.success[400] // '#6B9080' - Success state
colors.warning[400] // '#D4A574' - Warning state
colors.error[400]   // '#D4846A' - Error state
```

### Usage Guidelines

- **Primary**: Use for main actions, branding elements, and important CTAs
- **Secondary**: Use for backgrounds, cards, and neutral elements
- **Accent**: Use sparingly for highlights, special features, and premium content
- **Background**: Use for page backgrounds and containers
- **Text**: Maintain 4.5:1 contrast ratio for accessibility
- **Success/Warning/Error**: Only use for state feedback, not decoration

---

## 🔤 Typography

### Font Family

```typescript
import { typography } from './typography';

typography.fontFamily.sans     // Inter, system fonts
typography.fontFamily.heading  // Inter, system fonts
typography.fontFamily.body     // Inter, system fonts
typography.fontFamily.mono     // JetBrains Mono, monospace
```

### Font Sizes

```typescript
typography.fontSize.h1    // '2.5rem', lineHeight: '1.2', fontWeight: 700
typography.fontSize.h2    // '2rem', lineHeight: '1.3', fontWeight: 600
typography.fontSize.h3    // '1.75rem', lineHeight: '1.4', fontWeight: 600
typography.fontSize.h4    // '1.5rem', lineHeight: '1.4', fontWeight: 600
typography.fontSize.h5    // '1.25rem', lineHeight: '1.5', fontWeight: 500
typography.fontSize.h6    // '1.125rem', lineHeight: '1.5', fontWeight: 500
typography.fontSize.body  // '1rem', lineHeight: '1.6', fontWeight: 400
typography.fontSize.small // '0.875rem', lineHeight: '1.5', fontWeight: 400
typography.fontSize.label // '0.875rem', lineHeight: '1.4', fontWeight: 500
typography.fontSize.caption // '0.75rem', lineHeight: '1.4', fontWeight: 400
```

### Font Weights

```typescript
typography.fontWeight.light    // 300
typography.fontWeight.normal   // 400
typography.fontWeight.medium   // 500
typography.fontWeight.semibold // 600
typography.fontWeight.bold     // 700
```

### Letter Spacing

```typescript
typography.letterSpacing.tight  // '-0.025em'
typography.letterSpacing.normal // '0'
typography.letterSpacing.wide  // '0.025em'
```

### Usage Guidelines

- **h1**: Page titles, hero sections
- **h2**: Section titles, card headers
- **h3**: Subsection titles
- **h4-h6**: Minor headings
- **Body**: Main content, paragraphs
- **Small**: Supplementary text, labels
- **Caption**: Metadata, timestamps

---

## 📐 Spacing

### Spacing Scale

Built on a 4px base unit for consistency.

```typescript
import { spacing } from './spacing';

spacing[0]   // '0'
spacing[1]   // '0.25rem'  (4px)
spacing[2]   // '0.5rem'   (8px)
spacing[3]   // '0.75rem'  (12px)
spacing[4]   // '1rem'     (16px)
spacing[6]   // '1.5rem'   (24px)
spacing[8]   // '2rem'     (32px)
spacing[12]  // '3rem'     (48px)
spacing[16]  // '4rem'     (64px)
spacing[24]  // '6rem'     (96px)
spacing[32]  // '8rem'     (128px)
spacing[48]  // '12rem'    (192px)
spacing[64]  // '16rem'    (256px)
```

### Component Spacing

```typescript
import { componentSpacing } from './spacing';

componentSpacing.section    // '4rem' - Section vertical spacing
componentSpacing.container  // '2rem' - Container padding
componentSpacing.card       // '1.5rem' - Card padding
componentSpacing.input      // '0.75rem' - Input padding
componentSpacing.button     // '0.75rem 1.5rem' - Button padding
componentSpacing.icon       // '0.5rem' - Icon padding
```

### Usage Guidelines

- Use even numbers for vertical spacing, odd for horizontal
- Maintain consistent spacing within component groups
- Use larger spacing for section breaks (48px+)
- Use smaller spacing for related elements (8-16px)

---

## 💨 Shadows

### Shadow Scale

Soft, diffused shadows for depth without harshness.

```typescript
import { shadows } from './shadows';

shadows.none   // 'none'
shadows.light  // '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
shadows.default // '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
shadows.medium // '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
shadows.large  // '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
shadows.xl     // '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
shadows['2xl'] // '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
shadows.inner  // 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
shadows.glow   // '0 0 20px rgba(139, 154, 109, 0.3)'
shadows.glowHover // '0 0 30px rgba(139, 154, 109, 0.5)'
```

### Usage Guidelines

- **light**: Subtle hover states, borders
- **default**: Cards, small containers
- **medium**: Dropdowns, modals
- **large**: Important cards, featured content
- **xl/2xl**: Modals, important overlays
- **inner**: Active states, pressed buttons
- **glow**: Special effects, highlights

---

## 🎬 Animations

### Durations

```typescript
import { animations } from './animations';

animations.durations.fast   // 150ms - Hover effects
animations.durations.normal // 300ms - Standard transitions
animations.durations.slow   // 500ms - Page transitions
```

### Easings

```typescript
animations.easings.ease      // [0.25, 0.1, 0.25, 1]
animations.easings.easeIn    // [0.42, 0, 1, 1]
animations.easings.easeOut   // [0, 0, 0.58, 1]
animations.easings.easeInOut // [0.42, 0, 0.58, 1]
animations.easings.spring    // [0.175, 0.885, 0.32, 1.275]
```

### Animation Variants

```typescript
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideUp,
  slideDown,
  staggerContainer,
  hoverScale,
  pressScale,
  accordionContent,
  modalOverlay,
  modalContent,
} from './animations';
```

### Usage Guidelines

- Use `fadeInUp` for list items and cards
- Use `staggerContainer` for animating children sequentially
- Use `hoverScale` for interactive elements
- Use `modalContent` for modal entrances
- Keep animations under 500ms for perceived performance
- Respect user's `prefers-reduced-motion` setting

---

## 🧩 Components

### Button

Primary action component with multiple variants.

```tsx
import { Button } from './components/Button';

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Loading...</Button>
<Button leftIcon={<Icon />}>With Icon</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `motion`: boolean (default: true)

---

### Input

Text input with focus animations and validation states.

```tsx
import { Input, Textarea } from './components/Input';

<Input label="Name" placeholder="Enter your name" />
<Input label="Email" type="email" error="Invalid email" />
<Input leftIcon={<Icon />} rightIcon={<Icon />} />
<Textarea label="Message" rows={4} />
```

**Props (Input):**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `onRightIconClick`: () => void
- `fullWidth`: boolean

---

### Card

Versatile card component with hover effects.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';

<Card hover variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'outlined' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean
- `clickable`: boolean
- `onClick`: () => void

---

### Progress

Linear and circular progress indicators.

```tsx
import { ProgressBar, ProgressCircle } from './components/Progress';

<ProgressBar value={75} color="success" showLabel />
<ProgressCircle value={60} size={120} />
```

**Props:**
- `value`: number (0-100)
- `max`: number
- `color`: 'primary' | 'success' | 'warning' | 'error'
- `showLabel`: boolean
- `animated`: boolean

---

### Modal

Accessible modal with overlay and animations.

```tsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './components/Modal';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <ModalTitle>Modal Title</ModalTitle>
  </ModalHeader>
  <ModalBody>
    Modal content
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean
- `closeOnOverlayClick`: boolean
- `closeOnEscape`: boolean

---

### Accordion

Collapsible content panels with smooth animations.

```tsx
import { Accordion, AccordionItem } from './components/Accordion';

<Accordion allowMultiple>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>
```

**Props:**
- `allowMultiple`: boolean
- `defaultOpen`: number[]

---

### Tabs

Tab navigation with multiple variants.

```tsx
import { Tabs, TabPanel } from './components/Tabs';

<Tabs
  tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
>
  <TabPanel value="tab1" activeTab={activeTab}>
    Content 1
  </TabPanel>
  <TabPanel value="tab2" activeTab={activeTab}>
    Content 2
  </TabPanel>
</Tabs>
```

**Props:**
- `variant`: 'underline' | 'pills' | 'segmented'
- `size`: 'sm' | 'md' | 'lg'

---

### Checkbox & Radio

Form controls with custom styling.

```tsx
import { Checkbox, RadioGroup, Radio } from './components/Checkbox';

<Checkbox
  checked={checked}
  onChange={setChecked}
  label="Accept terms"
/>

<RadioGroup name="plan" value={plan} onChange={setPlan}>
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
```

---

### Dropdown

Accessible dropdown with keyboard navigation.

```tsx
import { Dropdown } from './components/Dropdown';

<Dropdown
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Select option"
/>
```

---

### Avatar

User avatar with status indicators.

```tsx
import { Avatar, AvatarGroup } from './components/Avatar';

<Avatar name="John Doe" src="avatar.jpg" size="md" status="online" />
<AvatarGroup max={3}>
  <Avatar name="User 1" />
  <Avatar name="User 2" />
  <Avatar name="User 3" />
  <Avatar name="User 4" />
</AvatarGroup>
```

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'circle' | 'square' | 'rounded'
- `status`: 'online' | 'offline' | 'busy' | 'away'

---

### Calendar

Interactive calendar component.

```tsx
import { Calendar } from './components/Calendar';

<Calendar
  selectedDate={date}
  onDateChange={setDate}
  minDate={new Date()}
/>
```

---

### StatCard

Statistics display with trend indicators.

```tsx
import { StatCard, StatGrid, ProgressStat, MiniStat } from './components/StatCard';

<StatGrid cols={3}>
  <StatCard
    title="Total Users"
    value="1,234"
    change={{ value: 12, type: 'increase' }}
    icon={<Icon />}
  />
</StatGrid>
```

---

### Navigation

Sidebar and header navigation components.

```tsx
import { Sidebar, Header } from './components/Navigation';

<Sidebar
  items={[
    { id: 'dashboard', label: 'Dashboard', icon: <Icon /> },
    { id: 'settings', label: 'Settings', icon: <Icon /> },
  ]}
  activeItem={activeItem}
  onItemClick={setActiveItem}
/>

<Header
  title="Dashboard"
  subtitle="Welcome back, John"
  actions={<Button>Action</Button>}
  user={{ name: 'John Doe', avatar: 'avatar.jpg' }}
/>
```

---

### Form

Enhanced form components.

```tsx
import { Form, FormField, FormActions, Switch, Slider, FileUpload } from './components/Form';

<Form onSubmit={handleSubmit}>
  <FormField label="Email" required>
    <Input type="email" />
  </FormField>
  <Switch checked={enabled} onChange={setEnabled} label="Enable" />
  <Slider value={value} onChange={setValue} />
  <FileUpload onChange={setFiles} />
  <FormActions>
    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    <Button type="submit">Submit</Button>
  </FormActions>
</Form>
```

---

## 📄 Layouts

### LandingLayout

Hero section with features, testimonials, and CTA.

```tsx
import { LandingLayout, HeroSection, FeaturesGrid, CTASection } from './layouts/LandingLayout';

<LandingLayout
  hero={<HeroSection title="Welcome" subtitle="Description" primaryCta={<Button>Get Started</Button>} />}
  features={<FeaturesGrid>...</FeaturesGrid>}
  testimonials={<TestimonialsGrid>...</TestimonialsGrid>}
  cta={<CTASection title="Ready to start?" cta={<Button>Sign Up</Button>} />}
  footer={<Footer />}
/>
```

---

### AuthLayout

Centered authentication pages.

```tsx
import { AuthLayout, AuthForm, SocialAuth, SocialButton } from './layouts/AuthLayout';

<AuthLayout
  title="Sign In"
  subtitle="Welcome back"
  footer={<p>Don't have an account? <a href="#">Sign up</a></p>}
>
  <AuthForm>
    <Input label="Email" type="email" />
    <Input label="Password" type="password" />
    <Button>Sign In</Button>
  </AuthForm>
  <SocialAuth>
    <SocialButton provider="Google" icon={<Icon />} />
    <SocialButton provider="GitHub" icon={<Icon />} />
  </SocialAuth>
</AuthLayout>
```

---

### OnboardingLayout

Step-based onboarding flow with progress.

```tsx
import { OnboardingLayout, StepIndicator } from './layouts/OnboardingLayout';

<OnboardingLayout
  steps={[
    { id: 'step1', title: 'Welcome', content: <Step1 /> },
    { id: 'step2', title: 'Setup', content: <Step2 /> },
  ]}
  currentStep={currentStep}
  onNext={() => setCurrentStep(s => s + 1)}
  onPrevious={() => setCurrentStep(s => s - 1)}
  onComplete={handleComplete}
/>
```

---

### DashboardLayout

Sidebar navigation with main content area.

```tsx
import { DashboardLayout, DashboardCard, DashboardSection, Breadcrumb } from './layouts/DashboardLayout';

<DashboardLayout
  sidebarItems={[...]}
  activeItem={activeItem}
  onItemClick={setActiveItem}
  headerTitle="Dashboard"
  user={{ name: 'John Doe' }}
>
  <Breadcrumb items={[{ label: 'Home' }, { label: 'Dashboard' }]} />
  <DashboardSection title="Overview">
    <DashboardGrid>...</DashboardGrid>
  </DashboardSection>
</DashboardLayout>
```

---

### ProgramLayout

21-day program with day-by-day navigation.

```tsx
import { ProgramLayout, DayContent } from './layouts/ProgramLayout';

<ProgramLayout
  title="21-Day Journey"
  progress={progress}
  days={[
    { day: 1, title: 'Introduction', description: '...' },
    { day: 2, title: 'Mindfulness', description: '...' },
  ]}
  activeDay={activeDay}
  onDaySelect={setActiveDay}
  onCompleteDay={handleComplete}
>
  <DayContent day={currentDayContent}>
    <p>Day content here</p>
  </DayContent>
</ProgramLayout>
```

---

### BlogLayout

Blog listing and article layouts.

```tsx
import { BlogListingLayout, BlogCard, Pagination } from './layouts/BlogLayout';

<BlogListingLayout
  featured={<BlogCard variant="featured" {...featuredPost} />}
  posts={posts.map(post => <BlogCard {...post} />)}
  pagination={<Pagination currentPage={1} totalPages={10} onPageChange={setPage} />}
  sidebar={<Sidebar />}
/>
```

---

### AdminLayout

Admin panel with sidebar navigation.

```tsx
import { AdminLayout, AdminStatsCard, AdminTable, AdminToolbar } from './layouts/AdminLayout';

<AdminLayout
  sidebarItems={[...]}
  headerTitle="Admin Dashboard"
  user={{ name: 'Admin', role: 'Administrator' }}
>
  <AdminToolbar
    search={<Input placeholder="Search..." />}
    actions={<Button>New Item</Button>}
  />
  <AdminStatsCard title="Total Users" value="1,234" />
  <AdminTable columns={[...]} data={[...]} />
</AdminLayout>
```

---

## 🎯 Design Principles

### 1. Natural & Calming
- Use khaki/sage green and beige tones
- Soft shadows and rounded corners
- Generous white space

### 2. Accessible & Readable
- Minimum 4.5:1 contrast ratio for text
- Clear visual hierarchy
- Large touch targets (44px+)

### 3. Professional & Trustworthy
- Consistent spacing and sizing
- Subtle animations
- Clean typography

### 4. Therapeutic & Wellbeing
- Gentle color transitions
- Smooth micro-interactions
- Calm, soothing aesthetics

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install framer-motion

# Import components
import { Button } from './design-system/components/Button';
import { colors } from './design-system/colors';

# Use in your app
<Button variant="primary" onClick={handleClick}>
  Get Started
</Button>
```

---

## 📝 Guidelines

### Color Usage
- Primary color should be used sparingly (max 20% of UI)
- Secondary and background colors for majority of interface
- Accent color only for highlights and CTAs

### Spacing
- Maintain 8px base rhythm
- Use consistent padding: 8px (small), 16px (medium), 24px (large)
- Section spacing: 48px minimum

### Typography
- Maximum 3 font sizes per screen
- Use font weight for emphasis, not size
- Line height 1.5-1.6 for body text

### Animations
- Duration: 150ms (fast), 300ms (normal), 500ms (slow)
- Easing: ease-out for entrances, ease-in for exits
- Stagger lists with 100ms delays

---

## 🔧 Customization

All design tokens are exported and can be customized:

```typescript
// Customize colors
export const customColors = {
  ...colors,
  primary: {
    ...colors.primary,
    500: '#YOUR_COLOR',
  },
};

// Customize spacing
export const customSpacing = {
  ...spacing,
  '5': '2rem', // Add custom spacing
};
```

---

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Documentation](https://react.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🤝 Contributing

When adding new components:

1. Follow existing patterns
2. Include TypeScript types
3. Add animations with Framer Motion
4. Document props in this README
5. Test accessibility

---

## 📄 License

This design system is part of the 21-day personal development platform.

---

**Built with ❤️ for personal growth and wellbeing**