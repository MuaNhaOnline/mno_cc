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
	{ name: 'level_1', options: '{"default":""}' },
	{ name: 'level_2' },
	{ name: 'level_3' },
	{ name: 'level_4' },
	{ name: 'temporary' },
	{ name: 'empty' }
]

Currency.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE currencies_id_seq RESTART WITH 1')
Currency.create [
	{ name: 'VNĐ', options: '{"html":{"attributes":"data-value=VND"},"default":""}' },
	{ name: 'USD', options: '{"html":{"attributes":"data-value=USD"}}' },
	{ name: 'SJC', options: '{"html":{"attributes":"data-value=SJC"}}' }
]

Direction.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE directions_id_seq RESTART WITH 1')
Direction.create [
	{ name: 'east', options: '{"default":"default"}' },
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
	{ name: 'red', options: '{"html":{"attributes":"data-off=custom-legal-record-type"}, "default":""}' },
	{ name: 'pink', options: '{"html":{"attributes":"data-off=custom-legal-record-type"}}' },
	{ name: 'other', code: 'Custom', options: '{"html":{"attributes":"data-on=custom-legal-record-type"}}' }
]

PlanningStatusType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE planning_status_types_id_seq RESTART WITH 1')
PlanningStatusType.create [
	{ name: 'stable', options: '{"html":{"attributes":"data-off=custom-planning-status-type"},"default":""}' },
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
	{ name: 'sell_rent', code: 'sell_rent', options: '{"html":{"attributes":"data-on=\"sell rent\""},"default":""}' }
]

RealEstateType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE real_estate_types_id_seq RESTART WITH 1')
RealEstateType.create [
	{ name: 'residential_land', options: '{"group":"land","default":""}' },
	{ name: 'vacant_land', options: '{"group":"land"}' },
	{ name: 'other_land', options: '{"group":"land"}' },
	{ name: 'office', options: '{"group":"space","default":""}' },
	{ name: 'motel', options: '{"group":"space"}' },
	{ name: 'store', options: '{"group":"space"}' },
	{ name: 'restaurant_hotel', options: '{"group":"space"}' },
	{ name: 'storage_workshop', options: '{"group":"space"}' },
	{ name: 'building_apartment', options: '{"html":{"attributes":"data-on=building-apartment data-off=un-building-apartment"},"group":"apartment","default":""}' },
	{ name: 'luxury_apartment', options: '{"html":{"attributes":"data-on=luxury-apartment data-off=un-luxury-apartment"},"group":"apartment"}' },
	{ name: 'villa', options: '{"html":{"attributes":"data-on=villa data-off=un-villa"},"group":"house"}' },
	{ name: 'town_house', options: '{"html":{"attributes":"data-on=town-house data-off=un-town-house"},"group":"house"}' }
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
	{ name: 'area', options: '{"group":"sell","default":""}' },
	{ name: 'square_meter', options: '{"group":"sell"}' },
	{ name: 'month', options: '{"group":"rent","default":""}' },
	{ name: 'year', options: '{"group":"rent"}' }
]

Province.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE provinces_id_seq RESTART WITH 1')
Province.create [
	{ name: 'Hồ Chí Minh', options: '{"default":""}' }
]

District.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE districts_id_seq RESTART WITH 1')
District.create [
	{ name: '1', province_id: 1, options: '{"default":""}' }
]

Ward.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE wards_id_seq RESTART WITH 1')
Ward.create [
	{ name: 'Bến Nghé', province_id: 1, options: '{"default":""}' }
]

Street.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE streets_id_seq RESTART WITH 1')
Street.create [
	{ name: 'Lê Lợi', province_id: 1, options: '{"default":""}' }
]

ProjectType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE project_types_id_seq RESTART WITH 1')
ProjectType.create [
	{ name: 'Căn hộ', code: 'CanHo', options: '{"default":""}' }
]

Investor.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE investors_id_seq RESTART WITH 1')
Investor.create [
	{ name: 'Chủ đầu tư A', options: '{"default":""}' }
]