module ApplicationHelper
	def render_svg file_name, params = {}
		begin
			file = File.read(Rails.root.join('app', 'assets', 'svg_templates', file_name + '.svg'))
		rescue 
			return
		end
		
		content = Nokogiri::HTML::DocumentFragment.parse file
		svg = content.at_css 'svg'
		if params[:class].present?
			svg['class'] = params[:class]
		end
		content.to_html.html_safe
	end

	def file_download_image file
		ext = file[:url].split('?').first().split('.').last()
		if ['jpg','jpeg','png','gif','bmp'].include? ext
			img_src = file[:url]
		else
			img_src = "/assets/file_extensions/#{ext}.png"
		end
		"<a href='#{file[:url]}' download><img src='#{img_src}' onerror='this.src=\"/assets/file_extensions/file.png\"' /><span>#{file[:description] || ''}</span></a>".html_safe
	end

	def display_decimal number
		if number % 1 == 0
			number.to_i
		else
			number
		end
	end

	def self.display_decimal number
		if number % 1 == 0
			number.to_i
		else
			number
		end
	end

	def self.zoho_get_content_by_val array, val
		array.each do |element|
			return element['__content__'] if element['val'] == val
		end

		nil
	end

	def self.format_i string
		begin
			string.remove(/\D/)
		rescue
			0
		end
	end

	def self.format_f string
		begin
			string.remove(/[^(0-9).]/)
		rescue
			0
		end
	end

	def self.numeric? string
		Float(string) != nil rescue false
	end

	def self.id_format id, code, length = 6
		"\##{code}#{id.to_s.rjust(6, '0')}"
	end

	def self.isValidEmail email
		email =~ /^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i
	end

	def self.md5_encode string
		require 'digest/md5'
		Digest::MD5.hexdigest(string)
	end

	def self.encode_plain_text string
		if string.present? && string[0..2] != '<p>'
			('<p>' + string.gsub(/\r\n/, '</p><p>') + '</p>').gsub('<p></p>', '')
		else
			string
		end
	end

	def self.decode_plain_text string
		if string.present? && string[0..2] == '<p>'
			string[3...(string.length - 4)].gsub('</p><p>', "\r\n")
		else
			string
		end
	end

	# Read money

		def self.read_money number
			@number
			@is_prev_block_empty = true
			
			# Read number
			def self.read_number position
				p = position % 3

				if p == 0 && !@is_prev_block_empty && @number[position + 1, @number.length - 1].to_i == 0
					case @number[position]
						when '1'
							return ['mốt ']
						when '2'
							return ['hai ']
						when '3'
							return ['ba ']
						when '4'
							return ['tư ']
						when '5'
							return ['rưỡi ']
						when '6'
							return ['sáu ']
						when '7'
							return ['bảy ']
						when '8'
							return ['tám ']
						when '9'
							return ['chín ']
					end
				end

				case @number[position]
					when '0'
						if p == 1 && @number[position + 1] != '0' && @number[0, position - 1].to_i != 0
							return 'lẻ '
						end
					when '1'
						case p
							when 0
								return 'một trăm '
							when 1
								return 'mười '
							else
								if @number[position - 1].to_i > 1
									return 'mốt '
								else
									return 'một '
								end
						end
					when '2'
						case p
							when 0
								return 'hai trăm '
							when 1
								return 'hai mươi '
							else
								return 'hai '
						end
					when '3'
						case p
							when 0
								return 'ba trăm '
							when 1
								return 'ba mươi '
							else
								return 'ba '
						end
					when '4'
						case p
							when 0
								return 'bốn trăm '
							when 1
								return 'bốn mươi '
							else
								return 'bốn '
						end
					when '5'
						case p
							when 0
								return 'năm trăm '
							when 1
								return 'năm mươi '
							else
								if @number[position - 1] == 0
									return 'năm '
								else
									return 'lăm '
								end
						end
					when '6'
						case p
							when 0
								return 'sáu trăm '
							when 1
								return 'sáu mươi '
							else
								return 'sáu '
						end
					when '7'
						case p
							when 0
								return 'bảy trăm '
							when 1
								return 'bảy mươi '
							else
								return 'bảy '
						end
					when '8'
						case p
							when 0
								return 'tám trăm '
							when 1
								return 'tám mươi '
							else
								return 'tám '
						end
					when '9'
						case p
							when 0
								return 'chín trăm '
							when 1
								return 'chín mươi '
							else
								return 'chín '
						end
				end

				return ''
			end

			def self.read_block block
				text = ''
				position = block * 3

				noNumBefore = true
				(position...(position + 3)).each do |p|
					# t = read_number p
					# if t.class == Array
					#   return t
					# else
					#   text += t
					# end
					if !(@number[p] == '0' && noNumBefore)
						text += @number[p]
						noNumBefore = false
					end
				end

				if text != ''
					text += ' '
				end
				text
			end

			# Get array number (string)
			@number = number.to_i.to_s

			if @number.length % 3 != 0
				@number = @number.rjust((@number.length / 3 + 1) * 3, '0')
			end

			read_unit = ['nghìn ', 'triệu ', 'tỷ ']

			text = ''
			block_count = @number.length / 3

			(0...block_count).each do |block|
				reverse_index = block_count - block - 1

				t = read_block block

				if t.class == Array
					text += t[0]

					if block_count - block > 3
						d = reverse_index / 3;
						(0...d).each do
							text += 'tỷ ';
						end
					end

					break
				end

				if t != ''
					@is_prev_block_empty = false

					text += t
					if block != block_count - 1
						text += read_unit[(reverse_index - 1) % 3]
					end
				else
					if reverse_index > 0 && reverse_index % 3 == 0
						@is_prev_block_empty = false
						text += 'tỷ '
					else
						@is_prev_block_empty = true
					end
				end
			end

			if text != ''
				text[text.length - 1] = ''
			end

			text
		end

	# / Read money

	def get_value_by_width_type values
		case current_width_type 
		when 'xs'
			values[0]
		when 'sm'
			values[1]
		when 'md'
			values[2]
		when 'lg'
			values[3]
		end 
	end

	def plain_content content
		content.gsub(/\n/, '<br />').html_safe
	end

	# Remove sign in text

		def self.de_unicode text

			text
				.gsub(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/, 'a')
				.gsub(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/, 'A')
				.gsub(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/, 'e')
				.gsub(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/, 'E')
				.gsub(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ớ|ờ|ợ|ở|ỡ/, 'o')
				.gsub(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ớ|Ờ|Ợ|Ở|Ỡ/, 'O')
				.gsub(/ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ự|ử|ữ/, 'u')
				.gsub(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ứ|Ừ|Ự|Ử|Ữ/, 'U')
				.gsub(/í|ì|ị|ỉ|ĩ/, 'i')
				.gsub(/Í|Ì|Ị|Ỉ|Ĩ/, 'I')
				.gsub('đ', 'd')
				.gsub('Đ', 'D')
				.gsub(/ý|ỳ|ỵ|ỷ|ỹ/, 'y')
				.gsub(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/, 'Y')

		end

	# / Remove sign in text

	# Slug

		def self.to_slug text
			text
				.downcase
				.gsub(/\W/, '-')
				.gsub(/-{2,}/, '-')
		end

	# /Slug

end