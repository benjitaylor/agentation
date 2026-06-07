Gem::Specification.new do |spec|
  spec.name = "agentation-rails"
  spec.version = "2.1.1"
  spec.authors = ["Benji Taylor"]
  spec.summary = "Visual annotation toolbar for AI coding agents in Rails"
  spec.description = "Drop-in Rails engine that adds the Agentation toolbar to your app in development. " \
                     "One line in your Gemfile, zero configuration."
  spec.homepage = "https://github.com/benjitaylor/agentation"
  spec.license = "PolyForm-Shield-1.0.0"

  spec.required_ruby_version = ">= 3.0.0"

  spec.files = Dir[
    "lib/**/*",
    "app/**/*",
    "LICENSE",
    "README.md"
  ]

  spec.require_paths = ["lib"]

  spec.add_dependency "railties", ">= 6.0"
end
