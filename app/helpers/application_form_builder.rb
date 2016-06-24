class ApplicationFormBuilder < ActionView::Helpers::FormBuilder
	def label method, content_or_options = nil, options = nil, &block
		options ||= {}

		if options.has_key? :class
			options[:class] = 'control-label'
		end

		super method, content_or_options, options, &block
	end

	def required_label method, content_or_options = nil, options = nil, &block
		label(method, content_or_options, options, &block) + ' <sup class="required-label"></sup>'.html_safe
	end

	def field type, method, options = {}, params = {}
		# Options

			# id attribute
			if options[:id].blank?
				options[:id] = nil
			end			

			# class attribute
			if options[:class].blank?
				options[:class] = 'form-control'
			end

		# Params

			# Wrapper

				params[:wrapper] ||= {}

				# class
				params[:wrapper][:class] ||= 'form-group'

				# attribute
				params[:wrapper][:attributes] ||= ''
				if params[:wrapper][:attributes].is_a?(Hash)
					params[:wrapper][:attributes] =
						params[:wrapper][:attributes].map do |key, value|
							"#{key}=\"#{value}\""
						end.join(' ')
				elsif !params[:wrapper][:attributes].is_a?(String)
					params[:wrapper][:attributes] = ''
				end
			
			# / Wrapper

			# Label
			
				params[:label] ||= false
			
			# / Label

		# / Params

		# Input
		input_html = case type
		when 'text'
			text_field(method, options)
		when 'email'
			email_field(method, options)
		when 'password'
			password_field(method, options)
		when 'date'
			date_field(method, options)
		when 'textarea'
			text_area(method, options)
		when 'number'
			number_field(method, options)
		when 'select'
			select(method, params[:select_options_list] || [], params[:select_options] || {}, options)
		when 'money'
			options['data-constraint'] ||= ''
			options['data-constraint'] << ' integer'

			text_field(method, options)
		when 'area'
			options['data-constraint'] ||= ''
			options['data-constraint'] << ' real'
			
			text_field(method, options)
		when 'autocomplete'
			if options[:multiple].present? && options[:multiple]
				options[:multiple] 			=	false
				options['data-multiple']	= 	true
				options[:value] 			= 	nil
				options['data-input-type'] 	= 	'autocomplete'
				options['data-name']		=	"#{self.object_name}[#{method}][]"
				options[:name]				= 	nil

				'<section class="tags-ctn">' +
				'</section>' +
				'<section class="autocomplete-input-ctn">' +
					text_field(method, options) +
					'<section class="list"></section>' +
				'</section>'
			else

			end
		when 'hidden'
			params[:wrapper] = false

			hidden_field(method, options)
		else
			return
		end

		# Wrapper
		wrapper_html = ':html:'
		if params[:wrapper] != false
			wrapper_html = '<div class="' + params[:wrapper][:class] + '" ' + params[:wrapper][:attributes] + '>:html:</div>'
		end

		# Label
		label_html = ''
		if params[:label] != false
			label_html = label(method, params[:label])
		end

		# before
		if params[:before].present?
			input_html = params[:before] + input_html
		end

		# After
		if params[:after].present?
			input_html += params[:after]
		end

		wrapper_html.gsub(':html:',
			label_html +
			input_html.html_safe
		).html_safe
	end
end