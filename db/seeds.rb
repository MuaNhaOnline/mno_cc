#   cities = City.create [{ name: 'Chicago' }, { name: 'Copenhagen' }]
#   Mayor.create name: 'Emanuel', city: cities.first

Advantage.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE advantages_id_seq RESTART WITH 1')
Advantage.create [
	{ name: 'n_1' },
	{ name: 'n_2' },
	{ name: 'n_3' },
	{ name: 'n_4' },
	{ name: 'n_5' }
]

ConstructionalLevel.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE constructional_levels_id_seq RESTART WITH 1')
ConstructionalLevel.create [
	{ name: 'level_1' },
	{ name: 'level_2' },
	{ name: 'level_3' },
	{ name: 'level_4' },
	{ name: 'temporary' },
	{ name: 'empty' }
]

Currency.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE currencies_id_seq RESTART WITH 1')
Currency.create [
	{ name: 'VNĐ', code: 'VND', options: '{"html":{"attributes":"data-value=VND"},"default":""}' },
	{ name: 'USD', code: 'USD', options: '{"html":{"attributes":"data-value=USD"}}' },
	{ name: 'SJC', code: 'SJC', options: '{"html":{"attributes":"data-value=SJC"}}' }
]

Direction.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE directions_id_seq RESTART WITH 1')
Direction.create [
	{ 
		name: 'non', 
		options: {
			default: ''
		} 
	},
	{ name: 'east' },
	{ name: 'west' },
	{ name: 'south' },
	{ name: 'north' },
	{ name: 'north_west' },
	{ name: 'south_west' },
	{ name: 'north_east' },
	{ name: 'south_east' }
]

Disadvantage.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE disadvantages_id_seq RESTART WITH 1')
Disadvantage.create [
	{ name: 'n_1' },
	{ name: 'n_2' },
	{ name: 'n_3' },
	{ name: 'n_4' },
	{ name: 'n_5' }
]

LegalRecordType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE legal_record_types_id_seq RESTART WITH 1')
LegalRecordType.create [
	{ name: 'red', options: '{"html":{"attributes":"data-off=custom-legal-record-type"}}' },
	{ name: 'pink', options: '{"html":{"attributes":"data-off=custom-legal-record-type"}}' },
	{ name: 'other', code: 'Custom', options: '{"html":{"attributes":"data-on=custom-legal-record-type"}}' }
]

PlanningStatusType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE planning_status_types_id_seq RESTART WITH 1')
PlanningStatusType.create [
	{ name: 'stable', options: '{"html":{"attributes":"data-off=custom-planning-status-type"}}' },
	{ name: 'part', options: '{"html":{"attributes":"data-off=custom-planning-status-type"}}' },
	{ name: 'full', options: '{"html":{"attributes":"data-off=custom-planning-status-type"}}' },
	{ name: 'other', code: 'Custom', options: '{"html":{"attributes":"data-on=custom-planning-status-type"}}' }
]

PropertyUtility.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE property_utilities_id_seq RESTART WITH 1')
PropertyUtility.create [
	{ name: 'n_1' },
	{ name: 'n_2' },
	{ name: 'n_3' },
	{ name: 'n_4' },
	{ name: 'n_5' },
	{ name: 'n_6' }
]

Purpose.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE purposes_id_seq RESTART WITH 1')
Purpose.create [
	{ name: 'sell', code: 'sell', options: '{"html":{"attributes":"data-on=sell data-off=un-sell"}}' },
	{ name: 'rent', code: 'rent', options: '{"html":{"attributes":"data-on=rent data-off=un-rent"}}' },
	{ name: 'sell_rent', code: 'sell_rent', options: '{"html":{"attributes":"data-on=\"sell rent\""}}' }
]

RealEstateType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE real_estate_types_id_seq RESTART WITH 1')
RealEstateType.create [
	{ name: 'residential_land', code: '|land|', options: '{"group":"land"}' },
	{ name: 'vacant_land', code: '|land|', options: '{"group":"land"}' },
	{ name: 'other_land', code: '|land|', options: '{"group":"land"}' },
	{ name: 'office', code: '|space|complex_apartment|', options: '{"group":"space","html":{"attributes":"data-on=office"}}' },
	{ name: 'motel', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'store', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'restaurant_hotel', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'storage_workshop', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'high_apartment', code: '|apartment|complex_apartment|', options: '{"group":"apartment"}' },
	{ name: 'medium_apartment', code: '|apartment|complex_apartment|', options: '{"group":"apartment"}' },
	{ name: 'low_apartment', code: '|apartment|complex_apartment|', options: '{"group":"apartment"}' },
	{ name: 'villa', code: '|house|villa|', options: '{"html":{"attributes":"data-on=villa data-off=un-villa"},"group":"house"}' },
	{ name: 'town_house', code: '|house|town_house|', options: '{"html":{"attributes":"data-on=town-house data-off=un-town-house"},"group":"house"}' },
	{ name: 'social_home', code: '|apartment|social_home|', options: '{"group":"apartment"}' },
	{ name: 'penthouse', code: '|apartment|complex_apartment|', options: '{"group":"apartment"}' },
	{ name: 'duplex', code: '|apartment|complex_apartment|', options: '{"group":"apartment"}' }
]

RegionUtility.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE region_utilities_id_seq RESTART WITH 1')
RegionUtility.create [
	{ name: 'n_1' },
	{ name: 'n_2' },
	{ name: 'n_3' },
	{ name: 'n_4' },
	{ name: 'n_5' },
	{ name: 'n_6' },
	{ name: 'n_7' },
	{ name: 'n_8' }
]

Unit.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE units_id_seq RESTART WITH 1')
Unit.create [
	{ name: 'area', code: 'per', options: '{"group":"sell","default":""}' },
	{ name: 'square_meter', code: 'square_meter', options: '{"group":"sell"}' },
	{ name: 'square_meter', code: 'square_meter', options: '{"group":"rent"}' },
	{ name: 'month', code: 'month', options: '{"group":"rent","default":""}' },
	{ name: 'year', code: 'year', options: '{"group":"rent"}' },
	{ name: 'square_meter', code: 'square_meter', options: '{"group":"project"}' },
	{ name: 'per', code: 'per', options: '{"group":"project"}' },
	{ name: 'platform', code: 'per', options: '{"group":"project","default":""}' }
]

ProjectType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE project_types_id_seq RESTART WITH 1')
ProjectType.create [
	# id: 16 (11, 12, 13)

	# Level 1
	
		{ 
			id: 1,
			name: 'apartment',
			order: 1,
			options: {
				default: '',
				html: {
					attributes: 'data-on="apartment" data-off="un-apartment"'
				}
			}
		},
		{ 
			id: 5, 
			name: 'complex_apartment', 
			order: 2,
			options: {
				html: {
					attributes: 'data-off="un-complex_apartment"'
				}
			}
		},
		{ 
			id: 6, 
			name: 'adjacent_house', 
			order: 3,
			options: {
				html: {
					attributes: 'data-on="adjacent_house" data-off="un-adjacent_house"'
				}
			}
		},
		{ 
			id: 2, 
			name: 'office', 
			order: 4,
			options: {
				html: {
					attributes: 'data-off="un-office"'
				}
			}
		},
		{ 
			id: 4, 
			name: 'land', 
			order: 5, 
			options: {
				html: {
					attributes: 'data-off="un-land"'
				}
			}
		},
		{ 
			id: 3, 
			name: 'complex', 
			order: 6,
			options: {
				html: {
					attributes: 'data-off="un-complex"'
				}
			}
		},

	# / Level 1

	# Level 2

		# Apartment

			{
				id: 7,
				name: 'low_apartment',
				order: 1,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 8,
				name: 'medium_apartment',
				order: 2,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 9,
				name: 'high_apartment',
				order: 3,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 10,
				name: 'social_home',
				order: 4,
				options: {
					parent: 'apartment'
				}
			},

		# / Apartment

		# Adjacent house

			{
				id: 14,
				name: 'adjacent_town_house',
				order: 1,
				options: {
					parent: 'adjacent_house'
				}
			},
			{
				id: 15,
				name: 'adjacent_villa',
				order: 2,
				options: {
					parent: 'adjacent_house'
				}
			}

		# / Adjacent house

	# / Level 2

]

BlockType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE block_types_id_seq RESTART WITH 1')
BlockType.create [
	# id: 15 (11,12,13)

	# Level 1
	
		{ 
			id: 1,
			name: 'apartment',
			order: 1,
			options: {
				default: '',
				html: {
					attributes: 'data-on="apartment" data-off="un-apartment"'
				}
			}
		},
		{ 
			id: 5, 
			name: 'complex_apartment', 
			order: 2,
			options: {
				html: {
					attributes: 'data-on="complex_apartment" data-off="un-complex_apartment"'
				}
			}
		},
		{ 
			id: 6, 
			name: 'adjacent_house', 
			order: 3,
			options: {
				html: {
					attributes: 'data-on="adjacent_house" data-off="un-adjacent_house"'
				}
			}
		},
		{ 
			id: 2, 
			name: 'office', 
			order: 4,
			options: {
				html: {
					attributes: 'data-on="office" data-off="un-office"'
				}
			}
		},
		{ 
			id: 4, 
			name: 'land', 
			order: 5,
			options: {
				html: {
					attributes: 'data-off="un-land"'
				}
			}
		},

	# / Level 1

	# Level 2

		# Apartment

			{
				id: 7,
				name: 'low_apartment',
				order: 1,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 8,
				name: 'medium_apartment',
				order: 2,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 9,
				name: 'high_apartment',
				order: 3,
				options: {
					parent: 'apartment'
				}
			},
			{
				id: 10,
				name: 'social_home',
				order: 4,
				options: {
					parent: 'apartment'
				}
			},

		# / Apartment

		# Adjacent house

			{
				id: 14,
				name: 'adjacent_villa',
				order: 1,
				options: {
					parent: 'adjacent_house'
				}
			},
			{
				id: 3,
				name: 'adjacent_town_house',
				order: 2,
				options: {
					parent: 'adjacent_house'
				}
			}

		# / Adjacent house

	# / Level 2

]