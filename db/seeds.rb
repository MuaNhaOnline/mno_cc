#   cities = City.create [{ name: 'Chicago' }, { name: 'Copenhagen' }]
#   Mayor.create name: 'Emanuel', city: cities.first

Advantage.create name: 'Hẻm thông'
Advantage.create name: 'Có 2 mặt đường chính'
Advantage.create name: 'Có 2 mặt hẻm'
Advantage.create name: 'Có một mặt đường chính và 1 mặt hẻm'
Advantage.create name: 'Tiện làm quán cafe, nhà hàng, khách sạn'

ConstructionalLevel.create name: 'Nhà cấp 1'
ConstructionalLevel.create name: 'Nhà cấp 2'
ConstructionalLevel.create name: 'Nhà cấp 3'
ConstructionalLevel.create name: 'Nhà cấp 4'
ConstructionalLevel.create name: 'Nhà tạm'
ConstructionalLevel.create name: 'Nhà thô'

Currency.create name: 'VNĐ', options: '{"html":{"attributes":"data-value=VND"}}'
Currency.create name: 'USD', options: '{"html":{"attributes":"data-value=USD"}}'
Currency.create name: 'SJC', options: '{"html":{"attributes":"data-value=SJC"}}'

Direction.create name: 'Đông'
Direction.create name: 'Tây'
Direction.create name: 'Nam'
Direction.create name: 'Bắc'
Direction.create name: 'Tây-Bắc'
Direction.create name: 'Tây-Nam'
Direction.create name: 'Đông-Bắc'
Direction.create name: 'Đông-Nam'

Disadvantage.create name: 'Khu quy hoạch treo'
Disadvantage.create name: 'Gần chùa, nhà thờ, tang lễ'
Disadvantage.create name: 'Đường hẻm đâm thẳng vào nhà'
Disadvantage.create name: 'Gần chân cầu, trụ điện, ống cống'
Disadvantage.create name: 'Tường chung không thể xây mới'

LegalRecordType.create name: 'Sổ đỏ', options: '{"html":{"attributes":"data-hide=different-legal"}}'
LegalRecordType.create name: 'Sổ hồng', options: '{"html":{"attributes":"data-hide=different-legal"}}'
LegalRecordType.create name: 'Khác', code: '', options: '{"html":{"attributes":"data-show=different-legal"}}'

PlanningStatusType.create name: 'Ổn định', options: '{"html":{"attributes":"data-hide=different-planning"}}'
PlanningStatusType.create name: 'Một phần', options: '{"html":{"attributes":"data-hide=different-planning"}}'
PlanningStatusType.create name: 'Toàn bộ', options: '{"html":{"attributes":"data-hide=different-planning"}}'
PlanningStatusType.create name: 'Khác', code: 'Khac', options: '{"html":{"attributes":"data-show=different-planning"}}'

PropertyUtility.create name: 'Tầng hầm'
PropertyUtility.create name: 'Tầng lửng'
PropertyUtility.create name: 'Sân thượng'
PropertyUtility.create name: 'Gara ôtô'
PropertyUtility.create name: 'Thang máy'
PropertyUtility.create name: 'Hồ bơi'

Purpose.create name: 'Bán', code: 'Ban', options: '{"html":{"attributes":"data-show=sell data-hide=un-sell"}}'
Purpose.create name: 'Cho thuê', code: 'Thue', options: '{"html":{"attributes":"data-show=rent data-hide=un-rent"}}'
Purpose.create name: 'Bán hoặc cho thuê', code: 'BanThue', options: '{"html":{"attributes":"data-show=rent_sell"}}'

RealEstateType.create name: 'Đất thổ cư', code: 'DatThoCu', options: '{"group":"Dat"}'
RealEstateType.create name: 'Đất trồng', code: 'DatTrong', options: '{"group":"Dat"}'
RealEstateType.create name: 'Đất khác', code: 'DatKhac', options: '{"group":"Dat"}'
RealEstateType.create name: 'Văn phòng', code: 'VanPhong', options: '{"group":"MatBang"}'
RealEstateType.create name: 'Phòng trọ', code: 'PhongTro', options: '{"group":"MatBang"}'
RealEstateType.create name: 'Mặt bằng - Cửa hàng', code: 'MatBang_CuaHang', options: '{"group":"MatBang"}'
RealEstateType.create name: 'Nhà hàng - Khách sạn', code: 'NhaHang_KhachSan', options: '{"group":"MatBang"}'
RealEstateType.create name: 'Nhà kho - Xưởng', code: 'NhaKho_Xuong', options: '{"group":"MatBang"}'
RealEstateType.create name: 'Chung cư', code: 'ChungCu', options: '{"html":{"attributes":"data-show=apartment-building data-hide=un-apartment-building"},"group":"CanHo"}'
RealEstateType.create name: 'Căn hộ cao cấp', code: 'CanHoCaoCap', options: '{"html":{"attributes":"data-show=luxury-apartment data-hide=un-luxury-apartment"},"group":"CanHo"}'
RealEstateType.create name: 'Biệt thự', code: 'BietThu', options: '{"html":{"attributes":"data-show=villa data-hide=un-villa"},"group":"Nha"}'
RealEstateType.create name: 'Nhà phố', code: 'NhaPho', options: '{"html":{"attributes":"data-show=home-city data-hide=un-home-city"},"group":"Nha"}'

RealEstateUtility.create name: 'Tầng hầm'
RealEstateUtility.create name: 'Tầng lửng'
RealEstateUtility.create name: 'Sân thượng'
RealEstateUtility.create name: 'Gara otô'
RealEstateUtility.create name: 'Thang máy'
RealEstateUtility.create name: 'Hồ bơi'

RegionUtility.create name: 'Siêu thị'
RegionUtility.create name: 'Chợ'
RegionUtility.create name: 'Bệnh viện'
RegionUtility.create name: 'Công viên'
RegionUtility.create name: 'Khu vui chơi'
RegionUtility.create name: 'Bến xe'
RegionUtility.create name: 'Khu dân cư'
RegionUtility.create name: 'Khu kinh doanh'

StreetType.create name: 'Đường chính'
StreetType.create name: 'Đường nội bộ'

Unit.create name: 'Tổng diện tích', options: '{"group":"Ban"}'
Unit.create name: 'Mét vuông', options: '{"group":"Ban"}'
Unit.create name: 'Tháng', options: '	{"group":"Thue"}'
Unit.create name: 'Năm', options: '	{"group":"Thue"}'

Province.create name: 'Hồ Chí Minh'
District.create name: '1', province_id: 1
Ward.create name: 'Bến Nghé', province_id: 1
Street.create name: 'Lê Lợi', province_id: 1

ProjectType.create name: 'Căn hộ', code: 'CanHo'

Investor.create name: 'Chủ đầu tư A'