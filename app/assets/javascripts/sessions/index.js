// $(function () {	
// 	var 
// 		purpose = $('#purpose').val(),
// 		date_from = $('#date_from').val(),
// 		date_to = $('#date_to').val(),
// 		current_date_type = 'day';

// 	// Statistic by

// 		(function () {
// 			$('#purpose').on('change', function () {
// 				purpose = this.value;

// 				switch (purpose) {
// 					case 'year':
// 						if (current_date_type == 'year') {
// 							break;
// 						}
// 						current_date_type = 'year';
// 						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
// 							format: 'yyyy',
// 							viewMode: 'years',
// 							minViewMode: 'years'
// 						});
// 						date_from = date_to = '';
// 						break;
// 					case 'month':
// 						if (current_date_type == 'month') {
// 							break;
// 						}
// 						current_date_type = 'month';
// 						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
// 							format: 'm/yyyy',
// 							viewMode: 'months',
// 							minViewMode: 'months'
// 						});
// 						date_from = date_to = '';
// 						break;
// 					default:
// 						if (current_date_type == 'day') {
// 							break;
// 						}
// 						current_date_type = 'day';
// 						$('#date_from, #date_to').datepicker('remove').val('').datepicker({
// 							format: 'd/m/yyyy',
// 							viewMode: 'days',
// 							minViewMode: 'days'
// 						});
// 						date_from = date_to = '';
// 						break;
// 				}
				
// 				render();
// 			});

// 			$('#date_from').on('change', function () {
// 				if (date_from != this.value) {
// 					date_from = this.value;
// 					render();	
// 				}
// 			}).datepicker({
// 				format: 'd/m/yyyy',
// 				viewMode: 'days',
// 				minViewMode: 'days'
// 			});;

// 			$('#date_to').on('change', function () {
// 				if (date_to != this.value) {
// 					date_to = this.value;
// 					render();	
// 				}
// 			}).datepicker({
// 				format: 'd/m/yyyy',
// 				viewMode: 'days',
// 				minViewMode: 'days'
// 			});

// 			render();
// 		})();

// 	// / Statistic by

// 	// Render chart

// 		function render() {
// 			$.ajax({
// 				url: '/sessions/get_data',
// 				data: { purpose: purpose, date_from: date_from, date_to: date_to },
// 				dataType: 'JSON'
// 			}).done(function (d) {
// 				if (d.status == 0) {
// 					var options, data = [];

// 					data.push({
// 						type: 'stackedArea',
// 						legendText: 'Vistor',
// 						showInLegend: 'true',
// 						toolTipContent: '{label}(visitor): <strong>{y}</strong>',
// 						dataPoints: d.result.visitors.map(function (value) {
// 							return {
// 								y: value.count,
// 								label: value.label
// 							}
// 						})
// 					});
// 					data.push({
// 						type: 'stackedArea',
// 						legendText: 'Lead',
// 						showInLegend: 'true',
// 						toolTipContent: '{label}(lead): <strong>{y}</strong>',
// 						dataPoints: d.result.leads.map(function (value) {
// 							return {
// 								y: value.count,
// 								label: value.label
// 							}
// 						})
// 					});

// 					label = ''
// 					switch (purpose) {
// 						case 'time':
// 							label = 'Thống kê theo thời gian';
// 							break;
// 						case 'host':
// 							label = 'Thống kê theo nguồn';
// 							break;
// 						case 'campaign':
// 							label = 'Thống kê theo chiến dịch';
// 							break;
// 					}
// 					$('#chart_label').text(label);

// 					var chart = new CanvasJS.Chart('chart', $.extend({
// 						legend:{
// 							verticalAlign: 'bottom',
// 							horizontalAlign: 'center'
// 						},
// 						data: data
// 					}, options));

// 					chart.render();
// 				}
// 				else {
// 					errorPopup();
// 				}
// 			}).fail(function () {
// 				errorPopup();
// 			});
// 		}

// 	// / Render chart
// });

$(function () {
	_initTabContainer($('.free-style-tab-container'));

	var $campaignTabContent = $('.free-style-tab-container > .tab-content-list > .tab-content[aria-name="campaign"]'),
		$termTabContent = $('.free-style-tab-container > .tab-content-list > .tab-content[aria-name="term"]'),
		$contentTabContent = $('.free-style-tab-container > .tab-list [aria-name="content"]'),
		$campaignTabButton = $('.free-style-tab-container > .tab-list [aria-name="campaign"]'),
		$termTabButton = $('.free-style-tab-container > .tab-list [aria-name="term"]'),
		$contentTabButton = $('.free-style-tab-container > .tab-list [aria-name="content"]'),
		reloadCampaignFunction,
		reloadTermFunction,
		reloadContentFunction;

	getAllCampaign();

	// Data

		$campaignTabContent.find('[aria-object="date_type"]').on('change', function () {
			reloadCampaignFunction();
		});
		$termTabContent.find('[aria-object="date_type"]').on('change', function () {
			reloadTermFunction();
		});
		$contentTabContent.find('[aria-object="date_type"]').on('change', function () {
			reloadContentFunction();
		});

		function getDataPoint(dateType, value) {
			switch (dateType) {
				case 'day':
					date = value.date.split('/');
					return {
						y: value.count,
						// x: new Date(date[0], date[1], date[2]),
						label: date[2] + '/' + date[1] + '/' + date[0]
					}
					break;
				case 'month':
					date = value.date.split('/');
					return {
						y: value.count,
						// x: new Date(date[0], date[1], 0),
						label: date[1] + '/' + date[0]
					}
					break;
				case 'quarter':
					date = value.date.split('/');
					return {
						y: value.count,
						// x: new Date(date[0], date[1][1] * 3, 1),
						label: date[1] + '/' + date[0]
					}
					break;
				case 'year':
					return {
						y: value.count,
						// x: new Date(value.date, 1, 1),
						label: value.date
					}
					break;
			}
		}

	// / Data

	// Campaign

		function getAllCampaign() {
			reloadCampaignFunction = function () {
				$.ajax({
					url: '/sessions/get_data',
					method: 'GET',
					data: { get: 'campaign', date_type: $campaignTabContent.find('[aria-object="date_type"]').val() },
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						displayCampaign(data.result);
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});	
			}

			reloadCampaignFunction();
		}

		function displayCampaign(data) {

			$termTabButton.hide();
			$contentTabButton.hide();

			// Create chart

				var options, chartData = [];

				$.each(data['chart'], function (campaign, value) {
					chartData.push({
						type: 'line',
						showInLegend: true,
						legendText: campaign,
						toolTipContent: '{x}: <strong>{y}</strong>',
						markerType: 'none',
						dataPoints: value.map(function (v) {
							return getDataPoint(data['date_type'], v);
						})
					});
				});

				$('#campaign_chart').css('height', '150px');

				var chart = new CanvasJS.Chart('campaign_chart', $.extend({
					legend: {
						cursor: "pointer",
						itemclick: function (e) {
							if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
								e.dataSeries.visible = false;
							} else {
								e.dataSeries.visible = true;
							}

							e.chart.render();
						},
						fontSize: 13
					},
					axisX: {
						labelFontSize: 13
					},
					axisY: {
						labelFontSize: 13
					},
					data: chartData
				}, options));

				chart.render();

			// / Create chart

			// Create table

				html = '';

				$.each(data['table'], function (campaign, count) {
					html += 
					'<tr>' +
						'<td><a class="text-normal-color" aria-click="view">' + campaign + '</a></td>' +
						'<td>' + count + '</td>' +
					'</tr>';
				});

				$('#campaign_table').html(html).find('[aria-click="view"]').on('click', function () {
					$termTabButton.show().find('[aria-click="change_tab"]').text(this.innerText).click();
					$contentTabButton.hide();

					getTermByCampaign(this.innerText);
				});

			// / Create table

		}

	// / Campaign

	// Term

		function getTermByCampaign(campaign) {
			reloadTermFunction = function () {
				$.ajax({
					url: '/sessions/get_data',
					method: 'GET',
					data: { get: 'term', by: campaign, date_type: $termTabContent.find('[aria-object="date_type"]').val() },
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						displayTerm(data.result);
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}

			reloadTermFunction();
		}

		function displayTerm(data) {

			$contentTabButton.hide();

			// Create chart

				var options, chartData = [];

				$.each(data['chart'], function (term, value) {
					chartData.push({
						type: 'line',
						showInLegend: true,
						legendText: term,
						toolTipContent: '{x}: <strong>{y}</strong>',
						markerType: 'none',
						dataPoints: value.map(function (v) {
							return getDataPoint(data['date_type'], v);
						})
					});
				});

				$('#term_chart').css('height', '150px');

				var chart = new CanvasJS.Chart('term_chart', $.extend({
					legend: {
						cursor: "pointer",
						itemclick: function (e) {
							if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
								e.dataSeries.visible = false;
							} else {
								e.dataSeries.visible = true;
							}

							e.chart.render();
						},
						fontSize: 13
					},
					axisX: {
						labelFontSize: 13,
						valueFormatString: ""
					},
					axisY: {
						labelFontSize: 13
					},
					data: chartData
				}, options));

				chart.render();

			// / Create chart

			// Create table

				html = '';

				$.each(data['table'], function (term, count) {
					html += 
					'<tr>' +
						'<td><a class="text-normal-color" aria-click="view">' + term + '</a></td>' +
						'<td>' + count + '</td>' +
					'</tr>';
				});

				$('#term_table').html(html).find('[aria-click="view"]').on('click', function () {
					$contentTabButton.show().find('[aria-click="change_tab"]').text(this.innerText).click();

					getContentByTerm(this.innerText);
				});

			// / Create table

		}

	// / Term

	// Content

		function getContentByTerm(term) {
			reloadContentFunction = function () {
				$.ajax({
					url: '/sessions/get_data',
					method: 'GET',
					data: { get: 'content', by: term, date_type: $contentTabContent.find('[aria-object="date_type"]').val() },
					dataType: 'JSON'
				}).done(function (data) {
					if (data.status == 0) {
						displayContent(data.result);
					}
					else {
						errorPopup();
					}
				}).fail(function () {
					errorPopup();
				});
			}

			reloadContentFunction();
		}

		function displayContent(data) {

			// Create chart

				var options, chartData = [];

				$.each(data['chart'], function (content, value) {
					chartData.push({
						type: 'line',
						showInLegend: true,
						legendText: content,
						toolTipContent: '{x}: <strong>{y}</strong>',
						markerType: 'none',
						dataPoints: value.map(function (v) {
							return getDataPoint(data['date_type'], v);
						})
					});
				});

				$('#content_chart').css('height', '150px');

				var chart = new CanvasJS.Chart('content_chart', $.extend({
					legend: {
						cursor: "pointer",
						itemclick: function (e) {
							if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
								e.dataSeries.visible = false;
							} else {
								e.dataSeries.visible = true;
							}

							e.chart.render();
						},
						fontSize: 13
					},
					axisX: {
						labelFontSize: 13,
						valueFormatString: ""
					},
					axisY: {
						labelFontSize: 13
					},
					data: chartData
				}, options));

				chart.render();

			// / Create chart

			// Create table

				html = '';

				$.each(data['table'], function (content, count) {
					html += 
					'<tr>' +
						'<td>' + content + '</td>' +
						'<td>' + count + '</td>' +
					'</tr>';
				});

				$('#content_table').html(html);

			// / Create table

		}

	// / Content
});