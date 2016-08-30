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
		when 'editor'
			options['data-input-type'] = 'editor'

			text_area(method, options)
		when 'email'
			email_field(method, options)
		when 'password'
			password_field(method, options)
		when 'date'
			date_field(method, options)
		when 'textarea'
			text_area(method, options)
		when 'phone'
			options['data-constraint'] ||= ''
			options['data-constraint'] << ' integer'

			text_field(method, options)
		when 'number'
			number_field(method, options)
		when 'select'
			select(method, params[:select_options_list] || [], params[:select_options] || {}, options)
		when 'money'
			options['data-constraint'] ||= ''
			options['data-constraint'] << ' integer'
			options['data-input-type'] = 'money'
			options['value'] = ApplicationHelper.display_decimal(self.object.send(method)) if self.object.send(method).present?

			params[:after] ||= ''
			read_ctn = '<div class="small text-right" data-object="money_text"></div>'
			params[:after] = read_ctn + params[:after]

			text_field(method, options)
		when 'area'
			options['data-constraint'] ||= ''
			options['data-constraint'] << ' real'
			options['value'] = ApplicationHelper.display_decimal(self.object.send(method)) if self.object.send(method).present?
			
			text_field(method, options)
		when 'autocomplete'
			if options[:multiple].present? && options[:multiple]
				options[:multiple] 			=	false
				options['data-multiple']	= 	true
				options[:value] 			= 	nil
				options['data-input-type'] 	= 	'autocomplete'
				options['data-name']		=	"#{self.object_name}[#{method}][]"
				options[:name]				= 	nil

				object_method = method.to_s.gsub '_id', ''
				if params[:text_method].present? && self.object.send(object_method).present?
					options['data-value'] = self.object.send(object_method).map do |object|
						{
							value:	object.id,
							text:	params[:text_method].call(object)
						}
					end.to_json
				end

				hidden_field(method, value: '', multiple: true) +
				('<section class="tags-ctn"></section>' +
				'<section class="autocomplete-input-ctn">' +
					text_field(method, options) +
					'<section class="list"></section>' +
				'</section>').html_safe
			else

			end
		when 'tags'
			options['data-input-type'] = 'tags'
			options[:multiple] = true

			tags = self.object.send(method) || []
			if tags.present?
				tags = tags.map { |tag| tag.text }
			end

			select(method, tags, {}, options)
		when 'image'
			options['class'] = 'file-upload'
			options['data-types'] = 'image'

			# Amount
			if params[:amount].present?
				options['data-amount'] = params[:amount]
			end

			# Default
			images = self.object.send(method)

			if images.present?
				if images.is_a? Paperclip::Attachment
					values = { 'id': self.object.id, 'url': images.url }
				else
					# values = []
					# images.each do |image|
					# 	values << { 'id'=> image.id, 'url'=> image..url }
					# end
				end
				options['data-init-value'] = values.to_json
			end

			file_field(method, options)
		when 'hidden'
			params[:wrapper] = false

			hidden_field(method, options)
		else
			return
		end

		# Group
		if params[:input_group].present?
			group = '<div class="input-group">'
			# Left
			if params[:input_group][:left].present?
				group += '<div class="input-group-addon">' + params[:input_group][:left] + '</div>'
			end
			# Input
			group += input_html
			if params[:input_group][:right].present?
				group += '<div class="input-group-addon">' + params[:input_group][:right] + '</div>'				
			end
			# Right
			group += '</div>'

			input_html = group.html_safe
		end

		# Before
		if params[:before].present?
			input_html = params[:before].html_safe + input_html
		end

		# After
		if params[:after].present?
			input_html += params[:after].html_safe
		end

		# Label
		label_html = ''
		if params[:label] != false
			if params[:label_for]
				label_html = label(method, params[:label], for: params[:label_for])
			else
				label_html = label(method, params[:label])
			end
		end

		# Wrapper
		wrapper_html = ':html:'
		if params[:wrapper] != false
			wrapper_html = '<div class="' + params[:wrapper][:class] + '" ' + params[:wrapper][:attributes] + '>:html:</div>'
		end

		wrapper_html.gsub(':html:',
			label_html +
			input_html
		).html_safe
	end
end