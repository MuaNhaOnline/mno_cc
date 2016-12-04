require 'rails_helper'
require 'support/factory_girl'

RSpec.describe RealEstate, type: :model do
	it 'create full' do
		re = build :re
		puts re

		login User.create({
			email: 'lebinhchieu@gmail.com',
			account: 'account',
			password: '123123',
			full_name: 'Le Binh Chieu'
		})

		expect(true).to eq(true)
	end
end