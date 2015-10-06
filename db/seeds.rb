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
	{ name: 'non', options: '{"default":"default"}' },
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
	{ name: 'office', code: '|space|', options: '{"group":"space","html":{"attributes":"data-on=office"}}' },
	{ name: 'motel', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'store', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'restaurant_hotel', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'storage_workshop', code: '|space|', options: '{"group":"space","html":{"attributes":"data-off=office"}}' },
	{ name: 'high_apartment', code: '|apartment|', options: '{"group":"apartment"}' },
	{ name: 'medium_apartment', code: '|apartment|', options: '{"group":"apartment"}' },
	{ name: 'low_apartment', code: '|apartment|', options: '{"group":"apartment"}' },
	{ name: 'villa', code: '|house|villa|', options: '{"html":{"attributes":"data-on=villa data-off=un-villa"},"group":"house"}' },
	{ name: 'town_house', code: '|house|town_house|', options: '{"html":{"attributes":"data-on=town-house data-off=un-town-house"},"group":"house"}' }
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
	{ name: 'square_meter', options: '{"group":"rent"}' },
	{ name: 'month', options: '{"group":"rent","default":""}' },
	{ name: 'year', options: '{"group":"rent"}' },
	{ name: 'square_meter', options: '{"group":"project"}' },
	{ name: 'per', options: '{"group":"project","default":""}' }
]

ProjectType.delete_all
ActiveRecord::Base.connection.execute('ALTER SEQUENCE project_types_id_seq RESTART WITH 1')
ProjectType.create [
	{ name: 'apartment', options: '{"default":""}' },
	{ name: 'office' },
	{ name: 'complex' }
]