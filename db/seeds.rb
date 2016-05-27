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
	{ name: 'level_4', code: '|level_4|' },
	{ name: 'temporary', code: '|temporary|' },
	{ name: 'empty' }
]

Currency.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE currencies_id_seq RESTART WITH 1')
Currency.create [
	{
		name: 'VNĐ',
		code: 'VND',
		options: {
			html: {
				attributes: 'data-value="VND"'
			},
			default: true
		}
	},
	{
		name: 'USD',
		code: 'USD',
		options: {
			html: {
				attributes: 'data-value="USD"'
			}
		}
	},
	{
		name: 'SJC',
		code: 'SJC',
		options: {
			html: {
				attributes: 'data-value="SJC"'
			}
		}
	}
]

Direction.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE directions_id_seq RESTART WITH 1')
Direction.create [
	{ 
		name: 'non', 
		options: {
			default: true
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
	{ name: 'red' },
	{ name: 'pink' }
]

PlanningStatusType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE planning_status_types_id_seq RESTART WITH 1')
PlanningStatusType.create [
	{ name: 'stable' },
	{ name: 'part' },
	{ name: 'full' }
]

PropertyUtility.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE property_utilities_id_seq RESTART WITH 1')
PropertyUtility.create [
	{ name: 'n_1' },
	{ name: 'n_2' },
	{ name: 'n_3' },
	{ name: 'n_4' },
	{ name: 'n_5' },
	{ name: 'n_6', code: '|pool|' }
]

Purpose.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE purposes_id_seq RESTART WITH 1')
Purpose.create [
	{
		name: 'sell',
		code: 'sell',
		options: {
			html: {
				attributes: 'data-on="sell" data-off="un-sell"'
			}
		}
	},
	{
		name: 'rent',
		code: 'rent',
		options: {
			html: {
				attributes: 'data-on="rent" data-off="un-rent"'
			}
		}
	},
	{
		name: 'sell_rent',
		code: 'sell_rent',
		options: {
			html: {
				attributes: 'data-on="sell rent"'
			}
		}
	},
	{
		name: 'transfer',
		code: 'transfer',
		options: {
			html: {
				attributes: 'data-on="rent" data-off="un-rent"'
			}
		}
	}
]

RealEstateType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE real_estate_types_id_seq RESTART WITH 1')
RealEstateType.create [
	{ 
		id: 9, 
		name: 'high_apartment', 
		code: '|high_apartment|apartment|complex_apartment|', 
		options: {
			group: 'apartment',
			html: {
				attributes: 'data-on="apartment" data-off="un-apartment"'
			}
		},
		order: 1
	},
	{ 
		id: 10, 
		name: 'medium_apartment', 
		code: '|medium_apartment|apartment|complex_apartment|', 
		options: {
			group: 'apartment',
			html: {
				attributes: 'data-on="apartment" data-off="un-apartment"'
			}
		},
		order: 2
	},
	{ 
		id: 11,
		name: 'low_apartment',
		code: '|low_apartment|apartment|complex_apartment|',
		options: {
			group: 'apartment',
			html: {
				attributes: 'data-on="apartment" data-off="un-apartment"'
			}
		},
		order: 3
	},
	{ 
		id: 14, 
		name: 'social_home', 
		code: '|social_home|', 
		options: {
			group: 'apartment'
		},
		order: 4
	},
	{
		id: 1,
		name: 'residential_land',
		code: '|land|residential_land|',
		options: {
			group: 'land'			
		},
		order: 5
	},
	{
		id: 2, 
		name: 'vacant_land', 
		code: '|land|vacant_land|', 
		options: {
			group: 'land'			
		},
		order: 6
	},
	{ 
		id: 3, 
		name: 'other_land', 
		code: '|land|', 
		options: {
			group: 'land'
		},
		order: 7
	},
	{ 
		id: 15, 
		name: 'forest_land', 
		code: '|land|forest_land|', 
		options: {
			group: 'land'
		},
		order: 8
	},
	{ 
		id: 16, 
		name: 'productive_land', 
		code: '|land|productive_land|', 
		options: {
			group: 'land'
		},
		order: 9
	},
	{ 
		id: 17, 
		name: 'project_land', 
		code: '|land|project_land|', 
		options: {
			group: 'land'
		},
		order: 10
	},
	{ 
		id: 13, 
		name: 'town_house', 
		code: '|house|town_house|', 
		options: {
			group: 'house',
			html: {
				attributes: 'data-on="town-house" data-off="un-town-house"'
			}
		},
		order: 11
	},
	{
		id: 12, 
		name: 'villa', 
		code: '|house|villa|', 
		options: {
			group: 'house',
			html: {
				attributes: 'data-on="villa" data-off="un-villa"'
			}
		},
		order: 12
	},
	{ 
		id: 4, 
		name: 'office', 
		code: '|space|complex_apartment|office|', 
		options: {
			group: 'space',
			html: {
				attributes: 'data-on="office" data-off="un-office"'
			}
		},
		order: 13
	},
	{ 
		id: 5, 
		name: 'motel', 
		code: '|space|motel|', 
		options: {
			group: 'space',
			html: {
				attributes: 'data-off="office"'
			}
		},
		order: 14
	},
	{ 
		id: 6, 
		name: 'store', 
		code: '|space|store|', 
		options: {
			group: 'space',
			html: {
				attributes: 'data-off="office"'
			}
		},
		order: 15
	},
	{ 
		id: 7, 
		name: 'restaurant_hotel', 
		code: '|space|restaurant_hotel|', 
		options: {
			group: 'space',
			html: {
				attributes: 'data-off="office"'
			}
		},
		order: 16
	},
	{ 
		id: 8, 
		name: 'storage_workshop', 
		code: '|space|storage_workshop|', 
		options: {
			group: 'space',
			html: {
				attributes: 'data-off="office"'
			}
		},
		order: 17
	}
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
	{
		id: 1,
		name: 'area',
		code: 'per',
		options: {
			group: 'sell',
			default: true
		},
		order: 1
	},
	{ 
		id: 2,
		name: 'square_meter',
		code: 'square_meter',
		options: {
			group: 'sell'
		},
		order: 2
	},
	{ 
		id: 3,
		name: 'square_meter_per_month',
		code: 'square_meter_per_month',
		options: {
			group: 'rent'
		},
		order: 3
	},
	{ 
		id: 9,
		name: 'square_meter_per_year',
		code: 'square_meter_per_year',
		options: {
			group: 'rent'
		},
		order: 4
	},
	{
		id: 4,
		name: 'month',
		code: 'month',
		options: {
			group: 'rent',
			default: true
		},
		order: 5
	},
	{
		id: 5,
		name: 'year',
		code: 'year',
		options: {
			group: 'rent'
		},
		order: 6
	},
	{
		id: 6,
		name: 'square_meter',
		code: 'square_meter',
		options: {
			group: 'project'
		},
		order: 7
	},
	{
		id: 7,
		name: 'per',
		code: 'per',
		options: {
			group: 'project'
		},
		order: 8
	},
	{
		id: 8,
		name: 'platform',
		code: 'per',
		options: {
			group: 'project',
			default: true
		},
		order: 9
	}
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
					attributes: 'data-on="block_apartment" data-off="un-block_apartment"'
				}
			}
		},
		{ 
			id: 5, 
			name: 'complex_apartment', 
			order: 2,
			options: {
				html: {
					attributes: 'data-on="block_complex_apartment" data-off="un-block_complex_apartment"'
				}
			}
		},
		{ 
			id: 6, 
			name: 'adjacent_house', 
			order: 3,
			options: {
				html: {
					attributes: 'data-on="block_adjacent_house" data-off="un-block_adjacent_house"'
				}
			}
		},
		{
			id: 2, 
			name: 'office', 
			order: 4,
			options: {
				html: {
					attributes: 'data-on="block_office" data-off="un-block_office"'
				}
			}
		},
		{
			id: 4, 
			name: 'land', 
			order: 5,
			options: {
				html: {
					attributes: 'data-on="block_land" data-off="un-block_land"'
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

Permission.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE permissions_id_seq RESTART WITH 1')
Permission.create [
	# 5

		# {
		# 	id: 1,
		# 	scope: '',
		# 	name: '',
		# 	description: '',
		# 	value: '',
		# 	parent_permission_id: '',
		# 	order: 1
		# },

	# System group
	
		{
			id: 1,
			scope: 'sys_general',
			name: 'Quản lý nhóm quyền',
			description: 'Quyền phân quyền cho các thành viên trong hệ thống',
			order: 1
		},
		{
			id: 2,
			scope: 'sys_re',
			name: 'Quản lý bất động sản',
			description: 'Quyền quản lý các bất động sản trong hệ thống',
			order: 2
		},
		{
			id: 3,
			scope: 'sys_pj',
			name: 'Quản lý dự án, chủ đầu tư',
			description: 'Quyền quản lý các dự án trong dự án, thông tin chủ đầu tư',
			order: 3
		},
		{
			id: 4,
			scope: 'sys_general',
			name: 'Quản lý yêu cầu',
			description: 'Quản lý các lời yêu cầu của người dùng',
			order: 4
		}

	# / System group
]