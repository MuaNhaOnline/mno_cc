class BlockType < ActiveRecord::Base
  serialize :options, JSON

  after_initialize :defaults

	def defaults
		self.options ||= {}
	end

  def self.get_options
    order order: 'ASC'
  end
end
