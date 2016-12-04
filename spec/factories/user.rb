require 'digest/md5'

FactoryGirl.define do
	factory :user, class: User do
		account
		email		
		password	Digest::MD5.hexdigest('nothing')
		full_name	'Normal User'
		is_admin	false
	end

	factory :admin, class: User do
		account
		email		
		password	Digest::MD5.hexdigest('nothing')
		full_name	'Super Admin'
		is_admin	true
	end
end