//Số lượng ảnh giới hạn được upload
var imgLimit = 5;

$(function() {
	init();		
	Validation();
	init_support();
});

//initialization
function init() {	
	//Init LoaiHinhGiaoDich
	$('#LoaiHinhGiaoDich').on('change', function(e) {
		//redefine event
		e = e || window.event;

		$optionLoaiHinhGiaoDich01 = "\
			<option>Tổng diện tích</option>\
			<option>Mét vuông</option>\
		";
		$optionLoaiHinhGiaoDich02 = "\
			<option>Năm</option>\
			<option>Tháng</option>\
		";
		

		if ($('#LoaiHinhGiaoDich').find(':selected').attr('data-type') == 0) {			
			$('#DonViDienTich').html($optionLoaiHinhGiaoDich01);

			$('#groupHoSoPhapLy').show();
			$('#groupTinhTrangQuyHoach').show();
			$('#groupBangQuyHoachChiTiet').show();
		}
		if ($('#LoaiHinhGiaoDich').find(':selected').attr('data-type') == 1) {
			$('#DonViDienTich').html($optionLoaiHinhGiaoDich02);			

			$('#groupHoSoPhapLy').hide();
			$('#groupTinhTrangQuyHoach').hide();
			$('#groupBangQuyHoachChiTiet').hide();
		}
	});
	//Init GiaBanMongMuon
	$('#ThoaThuan').on('change', function(e) {
		//redefine event
		e = e || window.event;

		if (this.checked == true) {
			$('#Gia').prop('disabled', 'true');			
			$('#CoTheThuongLuong').prop('disabled', 'true');
			$('#Gia').val('');
		}
		else {
			$('#Gia').prop('disabled', null);			
			$('#CoTheThuongLuong').prop('disabled', null);
		}
	});
	
	/*Progress DonViTienTe*/
	$('#DonViTienTe').on('change', function(event) {
		$obj = $('#Gia');
		if ($(this).find('option:selected').attr('data-value') == "USD") {
			$obj.attr('data-separate', ',');
			var reg = new RegExp('[.]', "g");
			$obj.val($obj.val().replace(reg, ','));
		} else {
			$obj.attr('data-separate', '.');
			var reg = new RegExp('[,]', "g");
			$obj.val($obj.val().replace(reg, '.'));
		}
	});
		/*Numberic format*/
		function insertSeparate(str, separate) {
			if (str.length > 3) {
				return insertSeparate(str.slice(0, str.length - 3), separate) + separate + str.slice(str.length - 3);
			}
			return str;
		}
		function numbericFormat(value, separate){
			var reg = new RegExp('[' + separate + ']', "g");
			var value = value.replace(reg, '');

			return insertSeparate(value, separate);
		}
		$('#Gia').on('keyup', function(event) {	
			$obj = $(this);
			var separate = $obj.attr('data-separate');
			
			$obj.val(numbericFormat($obj.val(), separate));
		});
	//Init Hem
	$('#Hem').on('click', function(e) {
		//redefine event
		e = e || window.event;

		$('#VaoHem').prop('type', null);
		$('#VaoHem').parent().next().children('span').slideDown(400);
	});
	$('#MatTien').on('click', function(e) {
		//redefine event
		e = e || window.event;

		$('#VaoHem').prop('type', 'hidden');
		$('#VaoHem').val('');
		$('#VaoHem').parent().next().children('span').slideUp(400);
	});	
	//Init XemBanDo
	$('#XemBanDo').on('click', function(e) {
		//redefine event
		e = e || window.event;

		e.preventDefault();

		$('#BanDo').slideToggle(400);
	});	
	/* #start Init LoaiHinhBDS */	
		//List Option LoaiHinhBDS
		$optionLoaiHinhBDS01 = "\
			<option>Đất thổ cư</option>\
			<option>Trồng cây</option>\
			<option>Khác</option>\
		";
		$optionLoaiHinhBDS02 = "\
			<option data-type='0'>Nhà phố</option>\
			<option data-type='1'>Biệt thự</option>\
		";
		$optionLoaiHinhBDS03 = "\
			<option data-type='0'>Chung cư</option>\
			<option data-type='1'>Căn hộ cao cấp</option>\
		";
		$optionLoaiHinhBDS04 = "\
			<option>Văn phòng</option>\
			<option>Phòng trọ</option>\
			<option>Mặt bằng - Cửa hàng</option>\
			<option>Nhà hàng - Khách sạn</option>\
			<option>Nhà kho - Xưởng</option>\
		";

		/* List properties */
			//Đất
			var dat = ["#groupDienTichKhuonVien", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet"];
			//Nhà
			var nhapho = ["#groupDienTichXayDung", "#groupDienTichSuDung", "#groupDienTichKhuonVien", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet", "#groupSoTang", "#groupWC", "#groupPhongNgu", "#groupHuongNha", "#groupNamXayDung", "#groupChatLuongConLai", "#groupLoaiCongTrinhXayDung"];
			var bietthu = ["#groupDienTichXayDung", "#groupDienTichSuDung", "#groupDienTichKhuonVien", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet", "#groupSoTang", "#groupWC", "#groupPhongNgu", "#groupHuongNha", "#groupNamXayDung", "#groupChatLuongConLai"];
			//Căn hộ
			var chungcu = ["#groupDienTichSuDung", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet", "#groupSoTang", "#groupWC", "#groupPhongNgu", "#groupHuongNha", "#groupNamXayDung", "#groupChatLuongConLai", "#groupLoaiCongTrinhXayDung"];
			var canhocaocap = ["#groupDienTichSuDung", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet", "#groupSoTang", "#groupWC", "#groupPhongNgu", "#groupHuongNha", "#groupNamXayDung", "#groupLoaiCongTrinhXayDung"];
			//Mặt bằng
			var matbang = ["#groupDienTichXayDung", "#groupDienTichSuDung", "#groupDienTichKhuonVien", "#groupNgang", "#groupDai", "#groupHinhDang", "#groupBangQuyHoachChiTiet", "#groupSoTang", "#groupWC", "#groupPhongNgu", "#groupHuongNha", "#groupNamXayDung", "#groupChatLuongConLai", "#groupLoaiCongTrinhXayDung"];

		//Default value LoaiHinhBDS (Nhà đất)		
			$('#groupLoaiHinhBDS .sub-item > .form-group').hide();
			BatTatDoiTuong(dat, "on");

		//Set event LoaiHinh
		$('#LoaiHinh').on('change', function(e) {
			//redefine event
			e = e || window.event;			

			if ($('#LoaiHinh').find(':selected').attr('data-type') == 0) {
				$('#PhanLoai_LoaiHinhBDS').html($optionLoaiHinhBDS01);												
					//Default value
					$('#groupLoaiHinhBDS .sub-item > .form-group').hide();								
					BatTatDoiTuong(dat, "on");
			}
			if ($('#LoaiHinh').find(':selected').attr('data-type') == 1) {
				$('#PhanLoai_LoaiHinhBDS').html($optionLoaiHinhBDS02);					
					//Default value					
					$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
					BatTatDoiTuong(nhapho, "on");
				
				$('#PhanLoai_LoaiHinhBDS').on('change', function(e) {
					$dataType = parseInt($('#PhanLoai_LoaiHinhBDS').find(':selected').attr('data-type'));
					switch($dataType) {
						case 0:
							$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
							BatTatDoiTuong(nhapho, "on");
							break;
						case 1:
							$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
							BatTatDoiTuong(bietthu, "on");											
							break;
					}
				});
			}
			if ($('#LoaiHinh').find(':selected').attr('data-type') == 2) {
				$('#PhanLoai_LoaiHinhBDS').html($optionLoaiHinhBDS03);
					//Default value
					$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
					BatTatDoiTuong(chungcu, "on");

				$('#PhanLoai_LoaiHinhBDS').on('change', function(e) {
					$dataType = parseInt($('#PhanLoai_LoaiHinhBDS').find(':selected').attr('data-type'));
					switch($dataType) {
						case 0:
							$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
							BatTatDoiTuong(chungcu, "on");
							break;
						case 1:
							$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
							BatTatDoiTuong(canhocaocap, "on");
							break;
					}
				});
			}
			if ($('#LoaiHinh').find(':selected').attr('data-type') == 3) {
				$('#PhanLoai_LoaiHinhBDS').html($optionLoaiHinhBDS04);
					//Default value
					$('#groupLoaiHinhBDS .sub-item > .form-group').hide();									
					BatTatDoiTuong(matbang, "on");
			}
		});		
			//progress HinhDangNha
			$('#NoHau').on('change', function(event) {			
				$obj = $(this);
				if ($obj.find('option:selected').attr('data-value') == 2) {
					$('#Do_NoTopHau').hide();
					$('#Do_NoTopHau').parent().next().slideUp('fast');
				}
				else {
					$('#Do_NoTopHau').show();
					$('#Do_NoTopHau').parent().next().slideDown('fast');
				}
			});
	/* #end Init LoaiHinhBDS */
	//Init HoSoPhapLy
	$('#LoaiHoSoPhapLy').on('change', function() {			
		if ($(this).find(':selected').attr('data-type') == 2) {
			$('#groupLoaiHoSoPhapLy_Khac').show();
		} else {
			$('#groupLoaiHoSoPhapLy_Khac').hide();
		}
	});
	//Init TinhTrangQuyHoach
	$('#LoaiTinhTrangQuyHoach').on('change', function() {			
		if ($(this).find(':selected').attr('data-type') == 3) {
			$('#groupLoaiTinhTrangQuyHoach_Khac').show();
		} else {
			$('#groupLoaiTinhTrangQuyHoach_Khac').hide();
		}
	});
	//Init NamXayDung
	initNamXayDung();
	//Init btnThemAnh
	$iCounter = 2;
	$('#btnThemAnh').on('click', function(e) {
		//redefine event
		e = e || window.event;

		e.preventDefault();

		$iCounter++;
		if($iCounter <= imgLimit) {
			$themHinhAnh = "\
			<div class=\"col-sm-7 col-xs-12\">\
				<input type=\"file\" class=\"form-control\" id=\"HinhAnh\">\
			</div>\
			";
			$(this).parents('#groupThemHinhAnh').prepend($themHinhAnh);
		}	
	});
	//Init Mở rộng		
	$('#groupHoSoPhapLy').hide();
	$('#groupTinhTrangQuyHoach').hide();
	$('#groupTienNghiKhac').hide();
	$('#groupTienIchKhuVuc').hide();
	$('#groupDanhGiaCacDacDiemKhac').hide();
	$('#groupHinhAnh').hide();

	$('#btnDienTiepThongTin').on('click', function(e) {
		//redefine event
		e = e || window.event;
		
		e.preventDefault();
		$(this).remove();
		$('.free-supporter').remove();

		if ($('#LoaiHinhGiaoDich').find(':selected').attr('data-type') == 1) {
			$('#groupHoSoPhapLy').hide();
			$('#groupTinhTrangQuyHoach').hide();
		} else {
			$('#groupHoSoPhapLy').show();
			$('#groupTinhTrangQuyHoach').show();
		}		
		$('#groupLoaiHinhBDS').show();				
		$('#groupTienNghiKhac').show();
		$('#groupTienIchKhuVuc').show();
		$('#groupDanhGiaCacDacDiemKhac').show();
		$('#groupHinhAnh').show();
	});
	
	/*prevent key non-number*/
	$('.only-number').on('keypress', function(event) {		
		event = event || window.event;

		if (event.keyCode < 48 || event.keyCode > 57) {
			event.preventDefault();		
		}					
	});
}

//Validation
function Validation() {
	$('#DangTin').submit(function(e) {
		//redefine event
		e = e || window.event;

		//Variable valid
		var isValid = true;		

		$('.required:visible').each(function(index, el) {
			el = $(el);
			if (el.val() == "") {				
				//$(this).css('border-color', 'red');				
				el.addClass('is-error');
				isValid = false;				
			}
			else {
				//$obj.css('border-color', '#ccc');				
				el.removeClass('is-error');
			}
			el.on('focusin', function() {				
				//$obj.css('border-color', '#ccc');				
				el.removeClass('is-error');
			});				
		});
		if (!isValid) {
			$('html, body').animate(
				{ scrollTop: $('.is-error').offset().top - 100 }
			);
			$('.is-error')[0].focus();
			e.preventDefault();
		}
	});	
}

/* Init Năm xây dựng*/
function initNamXayDung () {
	$year = "";	
	$tempDate = new Date();
	$nowYear = $tempDate.getYear() + 1900;
	for (var i = $nowYear; i >= $nowYear - 20; i--) {
		$year += "<option value=" + i + ">" + i + "</option>";
	}	
	$year += "<option value=\"tren20nam\">>20 năm</option>" ;
	$year += "<option value=\"tren50nam\">>50 năm</option>" ;
	$('#NamXayDung').html($year);
}

/* Support-button */
function init_support() {
	$('.support-button').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */		
		var dataType = $(this).attr('data-value');
		show_supporter(dataType);
	});
}

function show_supporter(object) {
	//get object	
	var obj = $(object);	
	//toggle supporter
	obj.slideToggle('fast');
	//Click out supporter to slideUp
	$('body').click(function(event) {
		/* Act on the event */
		if (!$(event.target).closest($('.support-button')).length) {
			$(obj).slideUp('fast');
		}
	});
}

/* function */
function BatTatDoiTuong(obj, state) {
	if (state == "on") {
		$.each(obj, function(index, val) {				
			$(val).show();
		});		
	} else {
		$.each(obj, function(index, val) {				
			$(val).hide();
		});
	}		
	if ($("#LoaiHinhGiaoDich").find(':selected').attr('data-type') == 0) {
		$('#groupBangQuyHoachChiTiet').show();
	} else {
		$('#groupBangQuyHoachChiTiet').hide();
	}
}