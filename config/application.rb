require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Mno
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true
    config.encoding = 'utf-8'
    # config.assets.paths << Rails.root.join('app', 'assets', 'templates')

    # Multi language
    I18n.available_locales = [:vi, :en]
    I18n.default_locale = :vi

    # Content type
    # config.middleware.use Rack::ContentLength

    # Console
    config.web_console.development_only = false

    # Timezone
    config.time_zone = 'Hanoi'
    # config.active_record.default_timezone = 'Hanoi'

    config.item_per_page = 8
    config.real_estate_item_per_page = 4
    config.mail_item_per_page = 20

    # Default form builder
    config.action_view.default_form_builder = 'ApplicationFormBuilder'

    # Solr path
    config.solr_path = "#{Rails.root}/lib/classes/solr.rb"
    
    config.exceptions_app = self.routes
  end
end
