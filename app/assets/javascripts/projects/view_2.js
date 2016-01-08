var projectId;

$(function () {
	initMap('map');
	_initTabContainer($('.free-style-tab-container'));

	/*
		Map
	*/

		/*
			params:
				id(*)
				params:
					zoom: 17
					center: {}
						lat: first_market || 10.771528380460218
						long: first_market || 106.69838659487618
					markers: [{}]
						lat: ...
						long: ...
		*/
		function initMap(id, params) {
			if (typeof params === 'undefined') {
				params = {}
			}

			var options = {
				scrollwheel: false
			};

			options.zoom = params.zoom || 14;

			if ('center' in params ) {
				options.center = params.center
			}
			else if ('markers' in params && params.markers.length > 0) {
				options.center = { lat: params.markers[0].latLng.lat, lng: params.markers[0].latLng.lng }
			}
			else {
				options.center = { lat: 10.771528380460218, lng: 106.69838659487618 }; 
			}

			var map = new google.maps.Map(document.getElementById(id), options);

			$(params.markers).each(function () {
				new google.maps.Marker({
					position: this.latLng,
					map: map,
					title: this.title || '...'
				});
			})

			$('#' + id).on({
				'focus, click': function () {
					map.setOptions({'scrollwheel': true});
				},
				focusout: function () {
					map.setOptions({'scrollwheel': false});
				}
			}).attr('tabindex', '0').css('outline', '0');

			return map;
		}

	/*
		/ Map
	*/

	// Ground

		(function () {

			// General

				var 
					$g = $('#g_ground'),
					$svg = $g.closest('svg'),
					$imageList = $('#ground_image_list'),
					patternImage = $('#pattern_image image')[0],
					loadImage = new Image(),
					tranX = 0,
					tranY = 0,
					scale = 1;

			// / General

			// Start new

				function startInteractImage(type, id) {
					// Get data
					$.ajax({
						url: '/' + type + 's/get_data_for_interact_view/' + id,
						dataType: 'JSON'
					}).done(function (data) {
						if (data.status == 0) {

							// Create image list

								$imageList.html('');

								$(data.result.images).each(function () {
									var $item = $('<li><a><span></span></a></li>');

									$item.data('value', this);

									$imageList.append($item);
								});

								if (data.result.images.length >= 2) {
									$imageList.show();
								}
								else {
									$imageList.hide();
								}

								$imageList.find('li').on('click', function () {
									$item = $(this);

									if ($item.hasClass('active')) {
										return;
									}

									$item.siblings('.active').removeClass('active');
									$item.addClass('active');

									showImage($item.data('value'));
								}).first().click();

							// / Create image list

							// Create info



							// / Create info

						}
						else {
							errorPopup();
						}
					}).fail(function () {
						errorPopup();
					});
				}

				startInteractImage('project', projectId);

			// / Start new

			// Show

				function showImage(value) {
					$g.html('').hide();
					loadImage.src = value.url;

					addDescription(value.descriptions);
				}

				(function () {
					loadImage.onload = function() {
						maxWidth = $svg.width();
						maxHeight = $svg.height();

						image = document.createElementNS("http://www.w3.org/2000/svg", "image");
						image.setAttribute('width', this.width);
						image.setAttribute('height', this.height);
						image.style['z-index'] = 2;
						image.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);
						$g.prepend(image);

						patternImage.setAttribute('width', this.width);
						patternImage.setAttribute('height', this.height);
						patternImage.setAttributeNS('http://www.w3.org/1999/xlink','href', this.src);

						scale = 1;
						if (this.width > maxWidth) {
							scale = parseFloat(maxWidth) / this.width;
						}
						if (this.height > maxHeight) {
							scaleHeight = parseFloat(maxHeight) / this.height;
							if (scaleHeight < scale) {
								scale = scaleHeight;
							}
						}

						tranX = maxWidth / 2.0 - this.width * scale / 2.0;
						tranY = maxHeight / 2.0 - this.height * scale / 2.0;

						updateViewBox();

						$g.show();
					}
				})();

			// / Show

			// Description

				function addDescription (descriptions) {
					$(descriptions).each(function () {
						description_data = this;

						var $polyline = $(document.createElementNS("http://www.w3.org/2000/svg", "polyline"));

						$g.append($polyline);

						$polyline.attr({
							'aria-object': 'description',
							points: description_data.points
						}).css({
							fill: 'url(#pattern_image)',
							transition: '.3s',
							'transform-origin': '50% 50%',
							cursor: 'pointer'
						});

						$polyline.on({
							mouseenter: function () {
								this.parentNode.appendChild(this); 
								setTimeout(function () {
									$polyline.css({
										transform: 'scale(1.05)'
									});
								})
							},
							mouseleave: function () {
								$polyline.css({
									transform: 'none'
								});
							},
							click: function () {
								switch (description_data.description.type) {
									case 'block':
									case 'real_estate':
										startInteractImage(description_data.description.type, description_data.description.id);
										break;
									default:
										break;
								}
							}
						})
					});
				}

			// / Description

			// Tools

				// Move, zoom

					function updateViewBox() {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
						$g.find('[aria-object="edit_point"]').attr('r', 5 / scale); }

					function updateViewBoxWithValue(tranX, tranY, scale) {
						$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
					}

				// / Move, zoom

			// / Tools

			// Buttons

				$('[aria-click="active_info_panel"]').on({
					click: function () {
						$('#info_panel_ground').addClass('active');

						setTimeout(function () {
							$document.on('click.active_info_panel', function () {
								$('#info_panel_ground').removeClass('active');
								$document.off('click.active_info_panel');
							});	
						});
					}
				})

			// / Buttons

		})();

	// / Ground
})