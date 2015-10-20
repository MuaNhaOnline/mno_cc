class ProjectAttachment < ActiveRecord::Base

  after_create :save_attachment
  before_destroy :delete_attachment

  private
  def save_attachment
    if @attachment.present?
      File.open(path, 'w') {|f| f.write(@attachment) }
    end
  end

  private
  def delete_attachment
    File.delete path if File.exists? path
  end

	def path
    @path ||= "app/assets/file_uploads/project_attachments/#{id}_#{name}"
  end

  def url
  	@url ||= "/assets/project_attachments/#{id}_#{name}"
  end

  def initialize attributes = nil
  	if attributes.has_key? :attachment
	  	@attachment = attributes[:attachment]

	  	attributes.delete :attachment
	  	attributes[:name] = TemporaryFile.get_file_name_by_file @attachment
      attributes[:extension] = File.extname(attributes[:name])
      attributes[:extension][0] = ''
	  end

  	super
  end
end
