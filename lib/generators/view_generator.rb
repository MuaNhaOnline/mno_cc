class ViewGenerator < Rails::Generators::Base
	argument :view_name, :type => :string

	def create_view_file
		create_file "app/views/#{view_name}.html.erb",
"<% content_for :stylesheets do %>
	<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/#{view_name}.css\">
<% end %>

<% content_for :scripts do %>
	<script type=\"text/javascript\" src=\"/assets/#{view_name}.js\"></script>
<% end %>

<%
=begin
	params: 
=end

	@title = '';
%>"
		create_file "app/assets/javascripts/#{view_name}.js"
		create_file "app/assets/stylesheets/#{view_name}.css"
	end
end