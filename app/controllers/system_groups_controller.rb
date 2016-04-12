class SystemGroupsController < ApplicationController
	layout 'layout_back'

	# Manage

		# View
		def manage
			@groups = SystemGroup.where(is_locked: false)
		end

		# Partial view
		# params: id
		def _create_form
			group = params[:id].present? ? SystemGroup.find(params[:id]) : SystemGroup.new

			render json: {
				status: 0,
				result: render_to_string(partial: 'create_form', locals: { group: group })
			}
		end

		def save
			group = params[:group][:id].present? ? SystemGroup.find(params[:group][:id]) : SystemGroup.new

			result = group.save_with_params params[:group]

			return render json: result if result[:status] != 0

			render json: {
				status: 0,
				result: render_to_string(partial: 'group_items', locals: { groups: [group] })
			}
		end

		def delete
			result = SystemGroup.delete_by_id params[:id]

			render json: result
		end

		# Get data
		# params: id(*)
		def get_data_for_manage
			group = SystemGroup.find(params[:id])

			render json: {
				status: 0,
				result: {
					users: render_to_string(partial: 'user_items', locals: { users: group.users }),
					permissions: group.permission_ids
				}
			}
		end

		# Partial view
		# params: id(*), user_id(*)
		def _user_info_for_manage
			group = SystemGroup.find params[:id]
			user = User.find params[:user_id]

			infos = []
			controls = []

			if group.users.where(id: user.id).exists?
				infos << {
					label: 'Tình trạng',
					text: 'Đang trong nhóm'
				}
				controls << '<button class="btn btn-warning" aria-click="remove">Loại khỏi nhóm</button>'.html_safe
			else
				controls << '<button class="btn btn-primary" aria-click="add">Thêm vào nhóm</button>'.html_safe
			end

			render json: {
				status: 0,
				result: render_to_string(partial: '/users/info_popup', locals: { user: user, infos: infos, controls: controls })
			}
		end

		# Handle
		# params: id(*), user_id(*), is_add(*)
		def add_or_remove_user
			group = SystemGroup.find params[:id]
			user = User.find params[:user_id]

			if params[:is_add] == '1'
				result = group.add_user user

				return render json: result if result[:status] != 0

				render json: {
					status: 0,
					result: render_to_string(partial: 'user_items', locals: { users: [user] })
				}
			else
				result = group.remove_user user

				render json: result
			end
		end

		# Handle
		# params: id(*), permission_ids[]
		def save_permissions
			group = SystemGroup.find params[:id]

			result = group.save_permissions params[:permission_ids]

			render json: result
		end
	
	# / Manage
end
