FactoryGirl.define do
	factory :real_estate_image do
		image File.new(File.join(Rails.root, 'spec', 'factories', 'images', 'real_estate', 'image_1.png'))
		is_avatar false
	end

	factory :real_estate do
		is_full false
		purpose_id 1
		currency_id 1
		province
		district
		street
		lat 32.463426
		lng 103.886719
		real_estate_type_id 9
		campus_area 200
		title 'Căn hộ cao quận 10'
		description 'Mô tả căn hộ cao cấp quận 10'
		after :build do |re|
			re.images << build(:real_estate_image, is_avatar: true)
			re.images += build_list(:real_estate_image, 2)
		end

		is_draft false
		is_pending false
	end
end