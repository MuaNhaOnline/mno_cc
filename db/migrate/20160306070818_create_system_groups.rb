class CreateSystemGroups < ActiveRecord::Migration
  def change
    create_table :system_groups do |t|
	  t.string :name
	  t.string :description
	  t.boolean :is_locked
    end

    create_table :system_groups_users, id: false do |t|
        t.belongs_to :system_group, index: true
        t.belongs_to :user, index: true
    end

    create_table :permissions_system_groups, id: false do |t|
        t.belongs_to :system_group, index: true
        t.belongs_to :permission, index: true
    end
  end
end
