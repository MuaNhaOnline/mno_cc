var _t = {
	form: {
		error_title: 'Lỗi',
		error_content: 'Có lỗi xảy ra',
		success_title: 'Thành công',
		confirm_title: 'Xác nhận',
		yes: 'Có',
		no: 'Không',
		label_image_upload: 'Đăng hình ảnh tại đây',
		search_no_result: 'Không tìm thấy kết quả phù hợp'
	},
	user: {
		validate: {
			'user[account]_required': 'Tên tài khoản không thể bỏ trống',
			'user[account]_unique': 'Tên tài khoản đã được sử dụng',
			'user[password]_required': 'Mật khẩu không thể bỏ trống',
			'repeat_password_required': 'Mật khẩu xác nhận không thể bỏ trống',
			'repeat_password_same': 'Mật khẩu không trùng khớp',
			'user[email]_required': 'Email không thể bỏ trống',
			'user[email]_unique': 'Email đã được sử dụng',
			'user[full_name]_required': 'Họ và tên không thể bỏ trống',
			'user[birthday]_required': 'Ngày sinh không thể bỏ trống'
		},
		view: {
			manager: {
				callout_empty_show_list: 'Chưa có người dùng thuộc nhóm, bạn có thể chuyển sang <b>chế độ thêm</b> để thêm người dùng',
				callout_search_to_add: 'Sử dụng chức năng <b>tìm kiếm</b> để tìm người dùng mà bạn muốn thêm'
			}
		}
	},
	real_estate: {
		attribute: {
			draft_status: 'Nháp',
			pending_status: 'Chờ duyệt',
			show_status: 'Hiển thị',
			hide_status: 'Ẩn'
		},
		validate: {
			'real_estate[alley_width]_required': 'Độ rộng của hẻm không thể bỏ trống',
			'real_estate[constructional_area]_required': 'Diện tích xây dựng không thể bỏ trống',
			'real_estate[using_area]_required': 'Diện tích sử dụng không thể bỏ trống',
			'real_estate[campus_area]_required': 'Diện tích khuôn viên không thể bỏ trống',
			'real_estate[width_x]_required': 'Chiều ngang không thể bỏ trống',
			'real_estate[width_y]_required': 'Chiều dài không thể bỏ trống',
			'real_estate[shape_width]_required': 'Mặt hậu không thể bỏ trống',
			'real_estate[shape_width]_width': 'Kích thước mặt hậu không hợp lệ',
			'real_estate[floor_number]_required': 'Tầng không thể bỏ trống',
			'real_estate[constructional_quality]_required': 'Chất lượng xây dựng còn lại không thể bỏ trống',
			'real_estate[title]_required': 'Tiêu đề không thể bỏ trống',
			'real_estate[description]_required': 'Mô tả không thể bỏ trống',
			'real_estate[custom_legal_record_type]_required': 'Giấy tờ khác không thể bỏ trống',
			'real_estate[custom_planning_status_type]_required': 'Tình trạng khác không thể bỏ trống',
			'real_estate[image_ids]_required': 'Hình ảnh không thể bỏ trống'
		},
		create: {
			success_content: 'Tin đăng thành công. Đăng hình ảnh và nhận xét về bất động sản của bạn tại đây',
			save_draft_success_content: 'Lưu tạm thành công',
			'continue': 'Bổ sung',
			view: 'Xem kết quả'
		},
		manager: {
			hide: 'Ẩn',
			show: 'Hiển thị',
			'continue': 'Tiếp tục',
			edit: 'Sửa',
			delete_confirm: 'Bạn có chắc muốn xóa tin này?'
		}
	}
};