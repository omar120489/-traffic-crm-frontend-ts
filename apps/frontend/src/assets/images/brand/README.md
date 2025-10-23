# RIO Travels Branding Assets

## Logo Placement

Place the **`rio-travels.png`** logo file in this directory.

The Logo component (`src/ui-component/Logo.jsx`) will import it from here to display in the application header.

## Current Assets

- **`rio-travels.png`**: Main logo (required)
  - Used in: Header, navigation drawer
  - Recommended size: At least 400x150px for best quality
  - Format: PNG with transparency preferred

## Usage

The logo is automatically imported by the `Logo` component:

```jsx
import rioLogo from '@/assets/images/brand/rio-travels.png';
```

No additional configuration needed - the build system will handle optimization.
