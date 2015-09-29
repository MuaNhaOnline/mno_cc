module ApplicationHelper
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
    @number = number.to_s

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
      text = text.capitalize
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

end