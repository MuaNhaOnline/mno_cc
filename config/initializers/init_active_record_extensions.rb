module ActiveRecordExtensions
	def page page, per, params = {}
		offset = (page.to_i - 1) * per
		limit(per).offset(offset)
	end

	def random
		order('RANDOM()')
	end

	def human_name
		I18n.t(
			name.underscore + '.' +
			'text'
		)
	end

    def human_attr attr
        I18n.t(
            name.underscore + '.' +
            'attributes.' +
            attr.to_s
        )
    end
end
module ActiveRecordExtensions2
	def human_attr attr
		I18n.t(
			self.class.name.underscore + '.' +
			'attributes.' +
			attr.to_s
		)
	end

	def human_value attr, value = nil
        value ||= method(attr).call
		I18n.t(
			self.class.name.underscore + '.' +
			'values.' +
			attr.to_s + '.' +
			value.to_s
		)
	end

	def human_err attr, err
		I18n.t(
			'error.message', 
			name: self.class.human_attr(attr),
			message: I18n.t('error.types.' + err),
		)
	end

	def add_err attr, err
		errors.add attr, human_err(attr, err)
	end
end
ActiveRecord::Base.extend ActiveRecordExtensions
ActiveRecord::Base.include ActiveRecordExtensions2