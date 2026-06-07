# agentation-rails

Drop-in Rails engine that adds the [Agentation](https://github.com/benjitaylor/agentation) annotation toolbar to your app in development. One line in your Gemfile, zero configuration.

## Installation

```ruby
# Gemfile
gem "agentation-rails", group: :development
```

```bash
bundle install
```

The toolbar appears automatically in development. Nothing to configure.

## Configuration (optional)

Generate an initializer:

```bash
rails generate agentation:install
```

Or add one manually:

```ruby
# config/environments/development.rb
Agentation.configure do |config|
  config.endpoint = "http://localhost:4747"  # MCP sync server (default)
  config.webhook_url = "https://example.com/hooks/agentation"
  config.copy_to_clipboard = false           # disable auto-copy
end
```

## JavaScript events

The toolbar dispatches `CustomEvent`s on `document` for every annotation lifecycle event. Use these with Stimulus controllers or plain JS:

```javascript
document.addEventListener("agentation:add", (e) => {
  console.log("Annotation added:", e.detail);
});

document.addEventListener("agentation:delete", (e) => {
  console.log("Annotation deleted:", e.detail);
});

document.addEventListener("agentation:update", (e) => {
  console.log("Annotation updated:", e.detail);
});

document.addEventListener("agentation:clear", (e) => {
  console.log("Annotations cleared:", e.detail);
});

document.addEventListener("agentation:copy", (e) => {
  console.log("Copied markdown:", e.detail.markdown);
});

document.addEventListener("agentation:submit", (e) => {
  console.log("Submitted:", e.detail.output, e.detail.annotations);
});

document.addEventListener("agentation:session", (e) => {
  console.log("Session created:", e.detail.sessionId);
});
```

## How it works

The gem inserts a `<script>` tag into every HTML response in development via Rack middleware. The script loads the Agentation toolbar, which lets you annotate page elements and send structured feedback to AI coding agents via the [Agentation MCP server](https://www.npmjs.com/package/agentation-mcp).

## Development

The built JS artifact is generated from the monorepo root:

```bash
pnpm build:rails
```

This bundles React + Agentation into a single IIFE at `gem/app/assets/javascripts/agentation.js`.

## License

PolyForm Shield 1.0.0
