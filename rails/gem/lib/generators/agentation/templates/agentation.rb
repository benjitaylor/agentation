# Agentation — visual annotation toolbar for AI coding agents.
# https://github.com/benjitaylor/agentation
#
# The toolbar appears automatically in development with no configuration.
# Uncomment lines below to customize.
Agentation.configure do |config|
  # MCP sync server endpoint (default: "http://localhost:4747")
  # config.endpoint = "http://localhost:4747"

  # Webhook URL for annotation events
  # config.webhook_url = "https://example.com/hooks/agentation"

  # Disable copy-to-clipboard (default: enabled)
  # config.copy_to_clipboard = false

  # Force enable/disable (default: auto-detects Rails.env.development?)
  # config.enabled = true
end
