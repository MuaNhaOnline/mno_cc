class QuestionsAddIsAnsweredIsPinnedRenameAnswerUser < ActiveRecord::Migration
  def change
  	add_column :questions, :is_answered, :boolean, default: false
  	add_column :questions, :is_pinned, :boolean, default: false
  	rename_column :questions, :answer_user_id, :respondent_id
  end
end
