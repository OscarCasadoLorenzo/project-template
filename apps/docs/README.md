# Project Template Documentation

This is the documentation site for Project Template, built with [Nextra](https://nextra.site/).

## Features

- 📝 MDX support for rich content
- 🎨 Beautiful documentation theme
- 🔍 Full-text search
- 🌙 Dark mode
- 📱 Mobile responsive
- ⚡ Fast static site generation

## Development

```bash
# Install dependencies (from root)
npm install

# Start dev server
npm run dev --filter=@project-template/docs

# Or from this directory
npm run dev
```

Visit [http://localhost:3002](http://localhost:3002)

## Building

```bash
# Build for production
npm run build --filter=@project-template/docs

# Or from this directory
npm run build
```

Output will be in the `out/` directory.

## Project Structure

```
apps/docs/
├── pages/              # MDX content files
│   ├── index.mdx      # Homepage
│   ├── _meta.json     # Navigation config
│   ├── frontend/      # Frontend docs
│   ├── backend/       # Backend docs
│   ├── packages/      # Package docs
│   └── ...
├── components/        # Custom components
├── public/            # Static assets
├── theme.config.tsx   # Nextra theme configuration
└── next.config.mjs    # Next.js configuration
```

## Adding Documentation

### Create New Page

1. Create MDX file in appropriate directory:

```mdx
---
title: My New Page
description: Page description
---

# My New Page

Content goes here...
```

2. Add to `_meta.json`:

```json
{
  "my-new-page": "My New Page"
}
```

### Organizing Content

Use folders to create hierarchical navigation:

```
pages/
├── section/
│   ├── _meta.json
│   ├── overview.mdx
│   └── advanced.mdx
```

## Markdown Lint

Run markdown linting:

```bash
npm run lint:md
```

## Deployment

The docs are automatically deployed to Netlify when merged to main.

### Manual Deployment

```bash
# Build static export
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

## Configuration

### Theme

Edit `theme.config.tsx` to customize:

- Logo
- Navigation
- Footer
- Search
- Social links

### Next.js

Edit `next.config.mjs` for:

- Base path
- Output settings
- Image optimization

## Resources

- [Nextra Documentation](https://nextra.site/)
- [MDX Documentation](https://mdxjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
