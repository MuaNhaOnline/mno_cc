class CreateReRegistrationsReTypes < ActiveRecord::Migration
  def change
    create_table :re_registrations_re_types do |t|
    	t.belongs_to :re_registration
    	t.belongs_to :real_estate_type
    end
  end
end
