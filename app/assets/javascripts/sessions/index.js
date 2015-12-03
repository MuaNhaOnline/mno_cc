$(function () {	
	purpose = $('#purpose').val();

	// Statistic by

		(function () {
			$('#purpose').on('change', function () {
				purpose = this.value;
				render();
			});

			render();
		})();

	// / Statistic by

	// Render chart

		function render() {
			$.ajax({
				url: '/sessions/get_data',
				data: { purpose: purpose },
				dataType: 'JSON'
			}).done(function (d) {
				if (d.status == 0) {
				 	var options, data = [];

					switch (purpose) {
						case 'time':
							options = {
				        axisY: {
				        	includeZero: false
				        }
							}
							data.push({
								type: 'line',
								markerSize: 5,
								toolTipContent: "{x}: <strong>{y}</strong>",
								dataPoints: d.result.map(function (value) {
									return {
										x: new Date(value.label),
										y: value.count,
									}
								})
							});
							break;
						default:
							data.push({
								type: 'pie',
								toolTipContent: "{label}: <strong>{y}</strong>",
								dataPoints: d.result.map(function (value) {
									return {
										y: value.count,
										label: value.label,
										legendText: value.label
									}
								})
							});
							break;
					}

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

					var chart = new CanvasJS.Chart("chart", $.extend({
						animationEnabled: true,
						legend:{
							verticalAlign: "bottom",
							horizontalAlign: "center"
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