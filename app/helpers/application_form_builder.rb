class ApplicationFormBuilder < ActionView::Helpers::FormBuilder
	def required_label method, content_or_options = nil, options = nil, &block
		label(method, content_or_options, options, &block) + ' <sup class="required-label"></sup>'.html_safe
	end
end