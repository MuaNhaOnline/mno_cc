class QuestionsController < ApplicationController
  layout 'layout_back'

# Save

  # Handle => View
  # params: question form
  def save
    if signed?
      params[:question][:user_id] = current_user.id
    else
      params[:question][:user_id] = 0
    end

    question = Question.new

    result = question.save_with_params params[:question]

    if result[:status] != 0
      respond_to do |format|
        format.html { render '/questions/create', locals: { question_form: params[:question].permit(:title, :content, :contact_info), error: (question.errors.first[1] if question.errors.present?) } }
        format.json { render json: { status: 3 } }
      end      
    else
      respond_to do |format|
        format.html { render '/shared/alert', layout: 'layout_back', locals: { type: 'success', title: 'Thành công', content: 'Đăng câu hỏi thành công, vui lòng chờ để nhận câu trả lời.' } }
        format.json { render json: { status: 0 } }
      end      
    end
  end

# / Save

# Manager

  # View
  def manager
    @questions = Question.order is_answered: 'asc'
  end

  # Partial view
  # params: keyword, page
  def _manager_list
    per = Rails.application.config.item_per_page

    params[:page] ||= 1
    params[:page] = params[:page].to_i

    if params[:keyword].blank?
      questions = Question.all
    else
      questions = Question.search(params[:keyword])
    end

    count = questions.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'questions/manager_list', locals: { questions: questions.page(params[:page], per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
      }
    }
  end

  # Handle
  # params: answer form
  def answer
    params[:respondent_id] = current_user.id
    result = Question.answer params

    if result[:status] != 0
      render json: result
    else
      render json: { status: 0 }
    end
  end

  # Handle
  # params: id, status
  def pin
    result = Question.pin params[:id], (params[:status] == '1' ? true : false)

    if result[:status] != 0
      render json: result
    else
      render json: { status: 0 }
    end
  end

# / Manager

# Delete

  def delete
    render json: Question.delete_by_id(params[:id])
  end

# / Delete

end