Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1456463541347476', 'f0863b764a47618f8a59eff3df872590', scope: 'name,email', info_fields: 'name,email'
end