# Gradient Implementation Guide

## Quick Start

### Option 1: Using Tailwind Classes (Recommended)

Update your `Layout.tsx` component:

```tsx
// Replace the current background with:
<div className="min-h-screen bg-gradient-warm">
  {/* Your content */}
</div>
```

### Option 2: Using CSS Classes

```tsx
<div className="min-h-screen gradient-warm-neutral">
  {/* Your content */}
</div>
```

### Option 3: Dark Mode Support

```tsx
<div className="min-h-screen bg-gradient-warm dark:bg-gradient-warm-dark">
  {/* Your content */}
</div>
```

---

## Recommended Gradient for Niyukti

**Use: Gradient 2 - Warm Neutral**

Why:
- Education platforms benefit from warm, approachable aesthetics
- Reduces eye strain during long admin sessions
- Creates a welcoming environment for educators

---

## Complete Layout Example

```tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Briefcase, Building2, UserCircle } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCandidate = user?.role === 'candidate';
  const isInstitution = user?.role === 'institution';

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Navigation - Updated for light background */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Navigation content */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## Card Styling for Light Backgrounds

Update your card components:

```tsx
// Light mode cards
<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
  {/* Card content */}
</div>

// With hover effect
<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl hover:border-gray-300 transition-all duration-200">
  {/* Card content */}
</div>
```

---

## Text Colors for Light Backgrounds

```tsx
// Headings
<h1 className="text-gray-900">Title</h1>
<h2 className="text-gray-800">Subtitle</h2>

// Body text
<p className="text-gray-700">Body text</p>
<p className="text-gray-600">Secondary text</p>

// Links
<a className="text-primary-600 hover:text-primary-700">Link</a>
```

---

## Switching Between Gradients

### In Development
Change the gradient class in `Layout.tsx`:
- `bg-gradient-slate` - Professional, cool
- `bg-gradient-warm` - Warm, approachable (recommended)
- `bg-gradient-cool` - Clean, modern

### With User Preference
```tsx
const [gradient, setGradient] = useState('warm');

<div className={`min-h-screen bg-gradient-${gradient}`}>
  {/* Content */}
</div>
```

---

## Testing Checklist

- [ ] Cards have sufficient contrast on gradient
- [ ] Text is readable (both headings and body)
- [ ] Navigation is clearly visible
- [ ] Buttons maintain visibility
- [ ] Forms are easy to read
- [ ] Dark mode variant works (if implemented)
- [ ] Works on mobile devices
- [ ] No eye strain after 30+ minutes of use

