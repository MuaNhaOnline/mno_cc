class ApplicationFormBuilder < ActionView::Helpers::FormBuilder
	def require_tooltip_html
		@require_tooltip_html ||= "<small>(#{I18n.t('global.text.require')})</small>"
	end

	def label method, content_or_options = nil, options = nil, &block
		options ||= {}

		if options.has_key? :class
		end

		super method, content_or_options, options, &block
	end

	def required_label method, content_or_options = nil, options = nil, &block
		if (content_or_options.is_a? String)
			content_or_options = (content_or_options + ' <sup class="required-label"></sup>').html_safe
		end
		label(method, content_or_options, options, &block)
	end

	def field type, method, options = {}, params = {}
		# Options

			options[:class] ||= 'form-control'
            options[:'data-constraint'] ||= ''

		# / Options

		# Params

			# Wrapper

				if params[:wrapper] != false
					params[:wrapper] = {} unless params[:wrapper].is_a? Hash

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
				end
			
			# / Wrapper

			# Label
				
				params[:label] ||= false

			# / Label

			# Required field

				if params[:require]
					options[:'data-constraint'] << ' required'
				end
			
				if 	(
						options[:'data-constraint'].present? &&
						options[:'data-constraint'].split(' ').include?('required') &&
						!['radio', 'checkbox'].include?(type)
					)
					if options[:title].present?
						options[:title] += '<br>' + require_tooltip_html
					else
						options[:title] = require_tooltip_html
					end
					options[:'data-html'] = 'true'
				end
			
			# / Required field

            # Constraint
            
                if params[:constraints].present?
                    params[:constraints].each do |key, value|
                        options[:'data-constraint'] << ' ' + key.to_s
                        case key
                        when :range
                            options[:'data-minvalue'] = value[:min] if value[:min]
                            options[:'data-maxvalue'] = value[:max] if value[:max]
                        end
                    end
                end
            
            # / Constraint

			# Input toggle
			
				if params[:input_toggle]
					options[:class] += ' input-toggle'
					if params[:input_toggle].is_a? Hash
						options[:'data-on'] = params[:input_toggle][:on]
						options[:'data-off'] = params[:input_toggle][:off]
					end
				end
			
			# / Input toggle

		# / Params

		# Input
		input_html = case type
		when 'text'
			text_field(method, options)
		when 'editor'
			options[:'data-input-type'] = 'editor'

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
			options[:'data-constraint'] ||= ''
			options[:'data-constraint'] << ' integer'

			text_field(method, options)
		when 'number'
			number_field(method, options)
		when 'select'
			select(method, params[:select_options_list] || [], params[:select_options] || {}, options)
		when 'money'
			options[:'data-constraint'] ||= ''
			options[:'data-constraint'] << ' integer'
			options[:'data-input-type'] = 'money'
			options[:'value'] = ApplicationHelper.display_decimal(self.object.send(method)) if self.object.send(method).present?

			if !params.has_key?(:read_money) || params[:read_money]
				params[:after] ||= ''
				read_ctn = '<div class="small text-right" data-object="money_text"></div>'
				params[:after] = read_ctn + params[:after]
			end

			text_field(method, options)
		when 'area', 'real'
			options[:'data-constraint'] ||= ''
			options[:'data-constraint'] << ' real'
			options['value'] = ApplicationHelper.display_decimal(self.object.send(method)) if self.object.send(method).present?
			
			text_field(method, options)
		when 'integer'
			options[:'data-constraint'] ||= ''
			options[:'data-constraint'] << ' integer'
			
			text_field(method, options)
		when 'autocomplete'
			if options[:multiple].present? && options[:multiple]
				options[:multiple] 			=	false
				options[:'data-multiple']	= 	true
				options[:value] 			= 	nil
				options[:'data-input-type'] = 	'autocomplete'
				options[:'data-name']		=	"#{self.object_name}[#{method}][]"
				options[:name]				= 	nil

				object_method = method.to_s.gsub '_id', ''
				if params[:text_method].present? && self.object.send(object_method).present?
					options[:'data-value'] = self.object.send(object_method).map do |object|
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
			options[:'data-input-type'] = 'tags'
			options[:multiple] = true

			tags = self.object.send(method) || []
			if tags.present?
				tags = tags.map { |tag| tag.text }
			end

			select(method, tags, {}, options)
		when 'image'
			options[:class] = 'file-upload'
			options[:'data-types'] = 'image'
			options.delete :title

			if params[:has].is_a? Array
				options[:'data-has_description'] = '' if params[:has].include? :description
				options[:'data-has_avatar'] = '' if params[:has].include? :avatar
				options[:'data-has_order'] = '' if params[:has].include? :order
			end

			# Amount
			if params[:amount].present?
				options[:'data-amount'] = params[:amount]
			end
            # Ratio
            if params[:ratio].present?
                options[:'data-ratio'] = params[:ratio]
            end

			# Default
			images = self.object.send(method)

			if images.present?
				if images.is_a? Paperclip::Attachment
					values = { 'id': self.object.id, 'url': images.url }
				else
					values = []
					images.each do |item|
						values << { 'id'=> item.id, 'url'=> item.image.url }
					end
				end
				options[:'data-init-value'] = values.to_json
			end

			file_field(method, options)
		when 'hidden'
			params[:wrapper] = false

			hidden_field(method, options)
		when 'checkbox'
			options[:class] = (options[:class].split(' ') - ['form-control']).join(' ')

			input = check_box(method, options, options[:value])

			if params[:label].present?
				input += params[:label]
			end

			input =
				'<div class="checkbox">' +
					'<label>' +
						input +
					'</label>' +
				'</div>'.html_safe

			params[:label] = false

			input
		when 'radio'
			options[:class] = (options[:class].split(' ') - ['form-control']).join(' ')

			input = radio_button(method, options[:value], options)

			if params[:label].present?
				input += params[:label]
			end

			input =
				'<div class="radio">' +
					'<label>' +
						input +
					'</label>' +
				'</div>'.html_safe

			params[:label] = false

			input
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
			input_html = "<div>#{params[:before]}</div>".html_safe + input_html
		end

		# After
		if params[:after].present?
			input_html += "<div>#{params[:after]}</div>".html_safe
		end

		# Label
		label_html = ''
		if params[:label] != false
			label_method =
				options[:'data-constraint'].present? && options[:'data-constraint'].split(' ').include?('required') ?
					method(:required_label) :
					method(:label)

			if params[:label_for]
				label_html = label_method.call(method, params[:label], for: params[:label_for])
			else
				label_html = label_method.call(method, params[:label])
			end
		end

		# Wrapper
		if params[:wrapper]
			wrapper_html = '<div class="' + params[:wrapper][:class] + '" ' + params[:wrapper][:attributes] + '>:html:</div>'
		else
			wrapper_html = ':html:'
		end

		wrapper_html.gsub(':html:',
			label_html +
			input_html
		).html_safe
	end

	def checkbox_radio_list type, method, list, params = {}

		# Params

			# Wrapper

				if params[:wrapper] != false
					params[:wrapper] = {} unless params[:wrapper].is_a? Hash

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
				end
			
			# / Wrapper

			# Label
				
				params[:label] ||= false

			# / Label

		# / Params

		# Inputs
		input_html = ''
		list.each_with_index do |item, index|
			input_html	<<	field(
								type,
								method,
								item[0].merge(multiple: type == 'checkbox', include_hidden: false),
								item[1].merge(wrapper: false, require: index == 0 && params[:require])
							)
		end
		input_html = input_html.html_safe

		# Label
		label_html = ''
		if params[:label]
			label_method =
				params[:require] ?
					method(:required_label) :
					method(:label)

			if params[:required]
				label_html = label_method.call(method, params[:label], for: nil)
			else
				label_html = label_method.call(method, params[:label], for: nil)
			end
		end

		# Wrapper
		if params[:wrapper]
			wrapper_html = '<div class="' + params[:wrapper][:class] + '" ' + params[:wrapper][:attributes] + '>:html:</div>'
		else
			wrapper_html = ':html:'
		end

		wrapper_html.gsub(':html:',
			label_html +
			input_html
		).html_safe
	end
end