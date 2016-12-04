FactoryGirl.define do
	factory :province do
		name 	'Hồ Chí Minh'
	end
	factory :district do
		name 	'Quận 10'
	end
	factory :ward do
		name 	'Phường 15'
	end
	factory :street do
		name 	'Cách Mạng Tháng 8'
	end
    sequence :email do |n|
        "person#{n}@example.com"
    end
    sequence :account do |n|
        "account#{n}"
    end
end