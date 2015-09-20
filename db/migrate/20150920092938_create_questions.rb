class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
    	t.text :title
    	t.text :content
    	t.integer :user_id
			t.text :email
			t.text :phone_number
			t.text :answer
			t.datetime :answered_at
			t.integer :answer_user_id    	

    	t.datetime :created_at
    end
  end
end
