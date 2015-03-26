class CreateLegalRecordTypes < ActiveRecord::Migration
  def change
    create_table :legal_record_types do |t|
      t.text :name
      t.text :code
      t.text :options
      t.integer :index

      t.timestamps null: false
    end
  end
end
