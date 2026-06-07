module Agentation
  module Generators
    class InstallGenerator < Rails::Generators::Base
      desc "Creates an Agentation initializer in config/initializers."
      source_root File.expand_path("templates", __dir__)

      def copy_initializer
        template "agentation.rb", "config/initializers/agentation.rb"
      end
    end
  end
end
