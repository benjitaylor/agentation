# Agentation Website

Demo site and documentation at agentation.dev.

## Safe but Important

- Changes here don't affect npm package consumers
- But this is the public face of the project - keep it clean, attractive, and accurate
- Content should be clear and helpful for potential users
- Iterate freely, but maintain quality

## Structure

- `src/app/` - Next.js app router pages
- Pages: features, FAQ, colophon, installation, etc.

## Development

```bash
pnpm dev                                    # From root (starts both)
pnpm --filter feedback-tool-example dev     # Website only
```

Deployed automatically via Vercel on push to main.

## Note

If something breaks in the demos, it might indicate a bug in the package itself. Use this as a testing ground for the library.
