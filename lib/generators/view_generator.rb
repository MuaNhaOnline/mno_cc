class ViewGenerator < Rails::Generators::Base
	argument :view_name, :type => :string

	def create_view_file
		create_file "app/views/#{view_name}.html.erb",
"<% content_for :stylesheets do %>
	<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/#{view_name}.css\">
<% end %>

<% content_for :javascripts do %>
	<script type=\"text/javascript\" src=\"/assets/#{view_name}.js\"></script>
<% end %>

<%
=begin
	params: 
=end

	@_title = ''
	@_description = ''
	@_main_navigator = {
		background: '',
		list: [
			{
				url: '',
				text: ''
			}
		]
	}
	@_main_class = ''
%>"
		create_file "app/assets/javascripts/#{view_name}.js"
		create_file "app/assets/stylesheets/#{view_name}.css"
	end
end