$(function () {	
	var 
		purpose = $('#purpose').val(),
		date_from = $('#date_from').val(),
		date_to = $('#date_to').val(),
		current_date_type = 'day';

	// Statistic by

		(function () {
			$('#purpose').on('change', function () {
				purpose = this.value;

				switch (purpose) {
					case 'year':
						if (current_date_type == 'year') {
							break;
						}
						current_date_type = 'year';
						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
							format: 'yyyy',
							viewMode: 'years',
							minViewMode: 'years'
						});
						date_from = date_to = '';
						break;
					case 'month':
						if (current_date_type == 'month') {
							break;
						}
						current_date_type = 'month';
						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
							format: 'm/yyyy',
							viewMode: 'months',
							minViewMode: 'months'
						});
						date_from = date_to = '';
						break;
					default:
						if (current_date_type == 'day') {
							break;
						}
						current_date_type = 'day';
						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
							format: 'd/m/yyyy',
							viewMode: 'days',
							minViewMode: 'days'
						});
						date_from = date_to = '';
						break;
				}
				
				render();
			});

			$('#date_from').on('change', function () {
				if (date_from != this.value) {
					date_from = this.value;
					render();	
				}
			}).datepicker({
				format: 'd/m/yyyy',
				viewMode: 'days',
				minViewMode: 'days'
			});;

			$('#date_to').on('change', function () {
				if (date_to != this.value) {
					date_to = this.value;
					render();	
				}
			}).datepicker({
				format: 'd/m/yyyy',
				viewMode: 'days',
				minViewMode: 'days'
			});

			render();
		})();

	// / Statistic by

	// Render chart

		function render() {
			$.ajax({
				url: '/sessions/get_data',
				data: { purpose: purpose, date_from: date_from, date_to: date_to },
				dataType: 'JSON'
			}).done(function (d) {
				if (d.status == 0) {
					var options, data = [];

					data.push({
						type: 'stackedArea',
						legendText: 'Vistor',
						showInLegend: 'true',
						toolTipContent: '{label}(visitor): <strong>{y}</strong>',
						dataPoints: d.result.visitors.map(function (value) {
							return {
								y: value.count,
								label: value.label
							}
						})
					});
					data.push({
						type: 'stackedArea',
						legendText: 'Lead',
						showInLegend: 'true',
						toolTipContent: '{label}(lead): <strong>{y}</strong>',
						dataPoints: d.result.leads.map(function (value) {
							return {
								y: value.count,
								label: value.label
							}
						})
					});

					label = ''
					switch (purpose) {
						case 'time':
							label = 'Thống kê theo thời gian';
							break;
						case 'host':
							label = 'Thống kê theo nguồn';
							break;
						case 'campaign':
							label = 'Thống kê theo chiến dịch';
							break;
					}
					$('#chart_label').text(label);

					var chart = new CanvasJS.Chart('chart', $.extend({
						legend:{
							verticalAlign: 'bottom',
							horizontalAlign: 'center'
						},
						data: data
					}, options));

					chart.render();
				}
				else {
					errorPopup();
				}
			}).fail(function () {
				errorPopup();
			});
		}

	// / Render chart
});