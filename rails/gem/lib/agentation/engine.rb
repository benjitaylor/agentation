module Agentation
  class Engine < ::Rails::Engine
    initializer "agentation.middleware" do |app|
      # Insert at the bottom of the stack (closest to the app) so we see the
      # raw response before other body-modifying middleware (Bullet, ETag, etc.)
      app.middleware.use Agentation::Middleware
    end
  end
end
