require "erb"

module Agentation
  ASSET_PATH = "/__agentation__/agentation.js"

  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      # Serve the JS file directly when requested
      return serve_js(env) if env["PATH_INFO"] == ASSET_PATH

      status, headers, response = @app.call(env)

      return [status, headers, response] unless inject?(status, headers)

      # Skip streaming responses — we can't buffer those
      return [status, headers, response] if streaming?(headers, response)

      body = +""
      response.each { |part| body << part }
      response.close if response.respond_to?(:close)

      body = body.sub(%r{</head>}i, "#{head_tag}\n</head>")

      config_tag = body_tag
      body = body.sub(%r{</body>}i, "#{config_tag}\n</body>") if config_tag

      headers.delete("Content-Length")

      [status, headers, [body]]
    end

    private

    def serve_js(_env)
      [
        200,
        {
          "Content-Type" => "application/javascript",
          "Content-Length" => agentation_js.bytesize.to_s,
          "Cache-Control" => "no-store"
        },
        [agentation_js]
      ]
    end

    def inject?(status, headers)
      return false unless Agentation.configuration.enabled?
      return false unless status == 200

      content_type = headers["Content-Type"]
      content_type&.include?("text/html")
    end

    def streaming?(_headers, response)
      response.respond_to?(:stream) || !response.respond_to?(:each)
    end

    def head_tag
      @head_tag ||= %(<script src="#{ASSET_PATH}" defer></script>)
    end

    # Recomputed each request so config changes via console/reloader take effect
    def body_tag
      config = Agentation.configuration
      attrs = []
      attrs << data_attr("endpoint", config.endpoint)
      attrs << data_attr("session-id", config.session_id)
      attrs << data_attr("webhook-url", config.webhook_url)
      attrs << data_attr("copy-to-clipboard", config.copy_to_clipboard) unless config.copy_to_clipboard.nil?
      attrs.compact!

      return nil if attrs.empty?

      %(<div id="agentation-config" style="display:none"#{attrs.join}></div>)
    end

    def data_attr(name, value)
      return nil unless value

      %( data-#{name}="#{ERB::Util.html_escape(value)}")
    end

    def agentation_js
      @agentation_js ||= File.read(
        File.expand_path("../../app/assets/javascripts/agentation.js", __dir__)
      )
    end
  end
end
