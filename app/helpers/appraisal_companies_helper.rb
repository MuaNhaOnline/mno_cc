module AppraisalCompaniesHelper
	def appraisal_company_avatar ac, params = {}
		"<img class=\"img-rounded #{params[:style_class]}\" src=\"#{ac.avatar_image.nil? ? '/assets/appraisal_companies/default.png' : '/images/' + ac.avatar_image_id.to_s}\" alt=\"#{ac.name}\">".html_safe
	end
end
