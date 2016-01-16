var _t = {
	form: {
		error_title: 'Lỗi',
		error_content: 'Có lỗi xảy ra',
		success_title: 'Thành công',
		confirm_title: 'Xác nhận',
		info_title: 'Thông tin',
		delete_confirm: 'Bạn có chắc muốn xóa?',
		yes: 'Có',
		no: 'Không',
		close: 'Đóng',
		label_image_upload: 'Kéo hoặc chọn hình để thêm vào',
		search_no_result: 'Không tìm thấy kết quả phù hợp',
		keyword_for_search: 'Nhập từ khóa để tìm kiếm',
		keyword_for_search_or_new: 'Nhập từ khóa để tìm kiếm hoặc thêm mới',
		add_new: 'Thêm mới',
		crop_title: 'Điều chỉnh kích thước ảnh',
		crop: 'Cắt',
		crop_tooltip: 'Cắt',
		uncrop: 'Không cắt',
		uncrop_tooltip: 'Không cắt',
		delete: 'Xóa',
		delete_tooltip: 'Xóa',
		cancel: 'Bỏ qua',
		cancel_tooltip: 'Bỏ qua',
		finish: 'Hoàn thành',
		validate: {
			'email_required': 'Email không thể bỏ trống'
		}
	},
	user: {
		validate: {
			'user[account]_required': 'Không thể bỏ trống',
			'user[account]_unique': 'Đã được sử dụng',
			'user[old_password]_required': 'Không thể bỏ trống',
			'user[password]_required': 'Không thể bỏ trống',
			'repeat_password_required': 'Không thể bỏ trống',
			'repeat_password_same': 'Không thể bỏ trống',
			'user[email]_invalid': 'Không hợp lệ',
			'user[email]_required': 'Không thể bỏ trống',
			'user[email]_unique': 'Đã được sử dụng',
			'user[full_name]_required': 'Không thể bỏ trống'
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
			appraised_status: 'Đã thẩm định',
			not_appraised_status: 'Chờ thẩm định',
			pending_status: 'Chờ duyệt',
			success_status: 'Đã xác nhận',
			show_status: 'Hiển thị',
			hide_status: 'Ẩn',
			favorite_status: 'Yêu thích'
		},
		validate: {
			'location_required': 'Không thể bỏ trống',
			'real_estate_type': 'Không thể bỏ trống',
			'real_estate[purpose_id]_required': 'Không thể bỏ trống',
			'real_estate[street_type]_required': 'Không thể bỏ trống',
			'real_estate[is_alley]_required': 'Không thể bỏ trống',
			'real_estate[alley_width]_required': 'Không thể bỏ trống',
			'real_estate_type_group_required': 'Không thể bỏ trống',
			'real_estate[real_estate_type_id]_required': 'Không thể bỏ trống',
			'real_estate[building_name]_required': 'Không thể bỏ trống',
			'real_estate[constructional_area]_required': 'Không thể bỏ trống',
			'real_estate[using_area]_required': 'Không thể bỏ trống',
			'real_estate[campus_area]_required': 'Không thể bỏ trống',
			'real_estate[width_x]_required': 'Không thể bỏ trống',
			'real_estate[width_y]_required': 'Không thể bỏ trống',
			'real_estate[shape]_required': 'Không thể bỏ trống',
			'real_estate[shape_width]_required': 'Không thể bỏ trống',
			'real_estate[shape_width]_width': 'Không hợp lệ',
			'real_estate[floor_number]_required': 'Không thể bỏ trống',
			'real_estate[restroom_number]_required': 'Không thể bỏ trống',
			'real_estate[bedroom_number]_required': 'Không thể bỏ trống',
			'real_estate[build_year]_required': 'Không thể bỏ trống',
			'real_estate[constructional_quality]_required': 'Không thể bỏ trống',
			'real_estate[title]_required': 'Không thể bỏ trống',
			'real_estate[description]_required': 'Không thể bỏ trống',
			'real_estate[legal_record_type_id]_required': 'Không thể bỏ trống',
			'real_estate[custom_legal_record_type]_required': 'Không thể bỏ trống',
			'real_estate[planning_status_type_id]_required': 'Không thể bỏ trống',
			'real_estate[custom_planning_status_type]_required': 'Không thể bỏ trống',
			'real_estate[image_ids]_required': 'Không thể bỏ trống',
			'real_estate[user_full_name]_required': 'Không thể bỏ trống',
			'real_estate[user_email]_required': 'Không thể bỏ trống',
			'real_estate[user_email]_invalid': 'Không hợp lệ'
		},
		view: {
			create: {
				success_content: 'Tin đăng thành công. Bạn có muốn bổ sung thông tin chi tiết không?',
				save_draft_success_content: 'Lưu tạm thành công',
				'continue': 'Bổ sung',
				view: 'Xem kết quả'
			},
			my: {
				hide: 'Ẩn',
				show: 'Hiển thị',
				'continue': 'Tiếp tục',
				edit: 'Sửa',
				delete_confirm: 'Bạn có chắc muốn xóa tin này?'
			},
			my_favorite: {
				unfavorite_confirm: 'Bạn có chắc muốn bỏ yêu thích tin này?'
			},
			manager: {
				hide: 'Ẩn',
				show: 'Hiển thị',
				delete_confirm: 'Bạn có chắc muốn xóa tin này?',
				favorite: 'Yêu thích',
				unfavorite: 'Bỏ yêu thích'
			},
			pending: {
				delete_confirm: 'Bạn có chắc muốn xóa tin này?'
			},
			appraise: {
        appraisal_company_placeholder: 'Tên công ty thẩm định...'
			}
		}
	},
	appraisal_company: {
		validate: {
			'ac[name]_required': 'Tên công ty không thể bỏ trống',
			'ac[representative_id_ac]_required': 'Thành viên đại diện không thể bỏ trống'
		},
		view: {
			manager: {
				delete_confirm: 'Bạn có chắc muốn xóa công ty này?'
			},
			appraise: {
        sell_price: 'Giá bán',
        rent_price: 'Giá cho thuê'
			}
		}
	},
	mail_box: {
		validate: {
			'mail[to_id_ac]_required': 'Người nhận không thể bỏ trống',
			'mail[subject]_required': 'Chủ đề không thể bỏ trống',
		},
		view: {
			inbox: {
				select_for_remove: 'Hãy chọn thư mà bạn muốn xóa'
			}
		}
	},
	question: {
		validate: {
			'question[title]_required': 'Không thể bỏ trống',
			'question[content]_required': 'Không thể bỏ trống',
			'question[contact_info]_required': 'Không thể bỏ trống'
		}
	},
	project: {
		attribute: {
			draft_status: 'Nháp',
			appraised_status: 'Đã thẩm định',
			not_appraised_status: 'Chờ thẩm định',
			pending_status: 'Chờ duyệt',
			success_status: 'Đã xác nhận',
			show_status: 'Hiển thị',
			hide_status: 'Ẩn',
			favorite_status: 'Yêu thích'
		},
		validate: {
			'location_required': 'Không thể bỏ trống',
			'project[project_name]_required': 'Không thể bỏ trống',
			'project[campus_area]_required': 'Không thể bỏ trống',
			'project[using_ratio]_required': 'Không thể bỏ trống',
			'project[date_display_type]_required': 'Không thể bỏ trống',
			'project[estimate_finishing_date]_greater_start': 'Phải sau ngày khởi công',
			'project[finished_base_date]_greater_start': 'Phải sau ngày khởi công',
			'project[transfer_date]_greater_finish': 'Phải sau ngày hoàn thành móng',
			'project[docs_issue_date]_greater_finish': 'Phải sau ngày hoàn thành móng',
			'project[title]_required': 'Không thể bỏ trống',
			'project[description]_required': 'Không thể bỏ trống',
			'project[image_ids][_fu]_required': 'Không thể bỏ trống'
		},
		view: {
			create: {
				save_draft_success_content: 'Lưu tạm thành công',
			},
			my: {
				hide: 'Ẩn',
				show: 'Hiển thị',
				'continue': 'Tiếp tục',
				edit: 'Sửa',
				delete_confirm: 'Bạn có chắc muốn xóa tin này?'
			},
			my_favorite: {
				unfavorite_confirm: 'Bạn có chắc muốn bỏ yêu thích tin này?'
			},
			pending: {
				delete_confirm: 'Bạn có chắc muốn xóa tin này?'
			},
			manager: {
				hide: 'Ẩn',
				show: 'Hiển thị',
				delete_confirm: 'Bạn có chắc muốn xóa tin này?',
				favorite: 'Yêu thích',
				unfavorite: 'Bỏ yêu thích'
			},
		}
	},
	investor: {
		view: {
			manager: {
				delete_confirm: 'Bạn có chắc muốn xóa nhà đầu tư này?'
			}
		}
	}
};