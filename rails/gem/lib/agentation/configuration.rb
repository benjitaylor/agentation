module Agentation
  class Configuration
    attr_accessor :endpoint, :session_id, :webhook_url, :enabled, :copy_to_clipboard

    def initialize
      @endpoint = "http://localhost:4747"
      @session_id = nil
      @webhook_url = nil
      @enabled = nil # auto-detect based on Rails.env
      @copy_to_clipboard = nil # nil = use JS default (true)
    end

    def enabled?
      if @enabled.nil?
        defined?(Rails) && Rails.env.development?
      else
        @enabled
      end
    end
  end

  class << self
    def configuration
      @configuration ||= Configuration.new
    end

    def configure
      yield(configuration)
    end

    def reset_configuration!
      @configuration = Configuration.new
    end
  end
end
