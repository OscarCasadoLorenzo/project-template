# UI Primitives

This directory contains primitive UI components based on [shadcn/ui](https://ui.shadcn.com/), a collection of re-usable components built with Radix UI and Tailwind CSS. These components provide the foundational building blocks for the Project Template application interface.

## Available Primitives

### Layout & Structure

- **Accordion** (`accordion.tsx`) - Collapsible content panels with expand/collapse functionality for organizing information hierarchically
- **Aspect Ratio** (`aspect-ratio.tsx`) - Maintains consistent width-to-height ratios for responsive media containers
- **Card** (`card.tsx`) - Container component with header, content, footer, and action sections for displaying grouped information
- **Collapsible** (`collapsible.tsx`) - Toggle visibility of content sections with smooth transitions
- **Resizable** (`resizable.tsx`) - Draggable panels with resize handles for adjustable layouts
- **Scroll Area** (`scroll-area.tsx`) - Custom scrollable containers with styled scrollbars
- **Separator** (`separator.tsx`) - Visual divider lines (horizontal or vertical) between content sections
- **Sidebar** (`sidebar.tsx`) - Collapsible navigation sidebar with mobile support and keyboard shortcuts
- **Tabs** (`tabs.tsx`) - Tabbed interface for organizing content into separate views

### Navigation

- **Breadcrumb** (`breadcrumb.tsx`) - Hierarchical navigation trail showing the user's location
- **Navigation Menu** (`navigation-menu.tsx`) - Accessible dropdown navigation with nested menu support
- **Menubar** (`menubar.tsx`) - Horizontal menu bar with dropdown submenus
- **Pagination** (`pagination.tsx`) - Page navigation controls with previous/next and numbered pages

### Forms & Input

- **Button** (`button.tsx`) - Interactive buttons with multiple variants and sizes
- **Calendar** (`calendar.tsx`) - Date picker with month/year navigation and date selection
- **Checkbox** (`checkbox.tsx`) - Toggle checkbox input with checked/unchecked states
- **Form** (`form.tsx`) - Form context provider with field validation and error handling
- **Input** (`input.tsx`) - Text input field with focus states and validation styles
- **Input OTP** (`input-otp.tsx`) - One-time password input with separate character slots
- **Label** (`label.tsx`) - Accessible form field labels with proper associations
- **Radio Group** (`radio-group.tsx`) - Mutually exclusive radio button selections
- **Select** (`select.tsx`) - Dropdown selection menu with search and grouping capabilities
- **Slider** (`slider.tsx`) - Range slider for numeric value selection
- **Switch** (`switch.tsx`) - Toggle switch for binary on/off states
- **Textarea** (`textarea.tsx`) - Multi-line text input with auto-resizing
- **Toggle** (`toggle.tsx`) - Button that maintains pressed/unpressed state
- **Toggle Group** (`toggle-group.tsx`) - Group of related toggle buttons (single or multiple selection)

### Feedback & Overlays

- **Alert** (`alert.tsx`) - Contextual messages with variants for different severity levels
- **Alert Dialog** (`alert-dialog.tsx`) - Modal dialog for important confirmations or warnings
- **Dialog** (`dialog.tsx`) - General-purpose modal overlay for focused interactions
- **Drawer** (`drawer.tsx`) - Slide-in panel from screen edges for additional content
- **Hover Card** (`hover-card.tsx`) - Floating card that appears on hover with additional information
- **Popover** (`popover.tsx`) - Floating content container anchored to trigger elements
- **Sheet** (`sheet.tsx`) - Side panel overlay for forms, settings, or secondary content
- **Toast** (configured via toast utilities) - Temporary notification messages
- **Tooltip** (`tooltip.tsx`) - Small contextual hints that appear on hover

### Display & Data

- **Avatar** (`avatar.tsx`) - User profile image with fallback initials or icon
- **Badge** (`badge.tsx`) - Small labels for status, counts, or categorization
- **Chart** (`chart.tsx`) - Recharts integration for data visualization with theming support
- **Progress** (`progress.tsx`) - Visual indicator for task completion or loading states
- **Skeleton** (`skeleton.tsx`) - Loading placeholder that mimics content structure
- **Table** (`table.tsx`) - Structured data grid with headers, rows, and cells

### Interactive

- **Carousel** (`carousel.tsx`) - Image/content slider with navigation controls
- **Command** (`command.tsx`) - Command palette for keyboard-driven actions and search
- **Context Menu** (`context-menu.tsx`) - Right-click menu with nested options and shortcuts
- **Dropdown Menu** (`dropdown-menu.tsx`) - Click-triggered menu with items, checkboxes, and radio groups

---

All components follow the project's design system with consistent styling, accessibility features, and responsive behavior.
