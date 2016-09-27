(function ( $ ) {

	/**
	 * Holds google map object and related utility entities.
	 * @constructor
	 */
	function GMapContext(domElement, options) {
		var _map = new google.maps.Map(domElement, options);
		var _marker = new google.maps.Marker({
			position: new google.maps.LatLng(54.19335, -3.92695),
			map: _map,
			title: "Drag Me",
			draggable: options.draggable
		});
		
		return {
			map: _map,
			marker: _marker,
			circle: null,
			location: _marker.position,
			radius: options.radius,
			locationName: options.locationName,
			addressComponents: {
				street_number: null,
				street: null,
				ward: null,
				district: null,
				province: null,
				type: null
			},
			settings: options.settings,
			domContainer: domElement,
			geodecoder: new google.maps.Geocoder(),
			required: options.required
		}
	}

	// Utility functions for Google Map Manipulations
	var GmUtility = {
		/**
		 * Draw a circle over the the map. Returns circle object.
		 * Also writes new circle object in gmapContext.
		 *
		 * @param center - LatLng of the center of the circle
		 * @param radius - radius in meters
		 * @param gmapContext - context
		 * @param options
		 */
		drawCircle: function(gmapContext, center, radius, options) {
			if (gmapContext.circle != null) {
				gmapContext.circle.setMap(null);
			}
			if (radius > 0) {
				radius *= 1;
				options = $.extend({
					strokeColor: "#0000FF",
					strokeOpacity: 0.35,
					strokeWeight: 2,
					fillColor: "#0000FF",
					fillOpacity: 0.20
				}, options);
				options.map = gmapContext.map;
				options.radius = radius;
				options.center = center;
				gmapContext.circle = new google.maps.Circle(options);
				return gmapContext.circle;
			}
			return null;
		},
		/**
		 *
		 * @param gMapContext
		 * @param location
		 * @param callback
		 */
		setPosition: function(gMapContext, location, callback) {
			gMapContext.location = location;
			gMapContext.marker.setPosition(location);
			gMapContext.map.panTo(location);
			this.drawCircle(gMapContext, location, gMapContext.radius, {});
			if (gMapContext.settings.enableReverseGeocode) {
				gMapContext.geodecoder.geocode({latLng: gMapContext.location}, function(results, status){
					if (status == google.maps.GeocoderStatus.OK && results.length > 0){
						gMapContext.locationName = results[0].formatted_address;
						gMapContext.addressComponents =
							GmUtility.address_component_from_google_geocode(results[0].address_components);
					}
					if (callback) {
						callback.call(this, gMapContext);
					}
				});
			} else {
				if (callback) {
					callback.call(this, gMapContext);
				}
			}

		},
		locationFromLatLng: function(lnlg) {
			return {latitude: lnlg.lat(), longitude: lnlg.lng()}
		},
		address_component_from_google_geocode: function(address_components) {
			var result = {};

			var district_locality;
			for (var i = address_components.length-1; i>=0; i--) {

				/*
					Custom
				*/

				component = address_components[i];

				switch(component.types[0]) {
					// Số nhà
					case 'street_number':
						result.streetNumber = component.long_name.toSentenceCase();
						break;
					// Đường
					case 'route':
						result.street = component.long_name.toSentenceCase();
						break;
					// Phường
					case 'sublocality_level_1':
						result.ward = component.long_name.toSentenceCase();
						break;
					// Quận
					case 'administrative_area_level_2':
						result.district = component.long_name.toSentenceCase();
						break;
					case 'locality':
						district_locality = component.long_name.toSentenceCase();
						break;
					// Thành phố
					case 'administrative_area_level_1':
						result.province = component.long_name.toSentenceCase();

						if (result.province == 'Hồ Chí Minh') {
							result.province = 'Tp. Hồ Chí Minh';
						}
						break;
					default:
						break;
				}

				/*
					/ Custom
				*/

			}

			if (!result.district) {
				result.district = district_locality;
			}

			return result;
		}
	};

	function isPluginApplied(domObj) {
		return getContextForElement(domObj) != undefined;
	}

	function getContextForElement(domObj) {
		return $(domObj).data("locationpicker");
	}

	function updateInputValues(inputBinding, gmapContext){
		if (!inputBinding) return;

		/*
			Custom
		*/

		var address = gmapContext.addressComponents;

		if (gmapContext.required) {
			if (
				address.street && address.district && address.province
			) {
				var currentLocation = GmUtility.locationFromLatLng(gmapContext.location);
				if (inputBinding.latitudeInput) {
					inputBinding.latitudeInput.val(currentLocation.latitude).change();
				}
				if (inputBinding.longitudeInput) {
					inputBinding.longitudeInput.val(currentLocation.longitude).change();
				}
				if (inputBinding.radiusInput) {
					inputBinding.radiusInput.val(gmapContext.radius).change();
				}
				if (inputBinding.locationNameInput) {
					inputBinding.locationNameInput.val(/*(address.streetNumber ? address.streetNumber + ' ' : '') + */address.street + (address.ward ? ', ' + address.ward : '') + ', ' + address.district + ', ' + address.province).trigger('change', [ true ]);
				}
				if (inputBinding.streetNumberInput) {
					inputBinding.streetNumberInput.val(address.streetNumber).change();
				}
				if (inputBinding.streetInput) {
					inputBinding.streetInput.val(address.street).change();
				}
				if (inputBinding.wardInput) {
					inputBinding.wardInput.val(address.ward).change();
				}
				if (inputBinding.districtInput) {
					inputBinding.districtInput.val(address.district).change();
				}
				if (inputBinding.provinceInput) {
					inputBinding.provinceInput.val(address.province).change();
				}
			}
			else {
				if (inputBinding.latitudeInput) {
					inputBinding.latitudeInput.val('').change();
				}
				if (inputBinding.longitudeInput) {
					inputBinding.longitudeInput.val('').change();
				}
				if (inputBinding.radiusInput) {
					inputBinding.radiusInput.val('').change();
				}
				if (inputBinding.locationNameInput) {
					inputBinding.locationNameInput.val('').change();
				}
				if (inputBinding.streetNumberInput) {
					inputBinding.streetNumberInput.val('').change();
				}
				if (inputBinding.streetInput) {
					inputBinding.streetInput.val('').change();
				}
				if (inputBinding.wardInput) {
					inputBinding.wardInput.val('').change();
				}
				if (inputBinding.districtInput) {
					inputBinding.districtInput.val('').change();
				}
				if (inputBinding.provinceInput) {
					inputBinding.provinceInput.val('').change();
				}    
			}
		}
		else {
			if (inputBinding.locationNameInput) {
				inputBinding.locationNameInput.val('');
			}
			if (inputBinding.streetNumberInput) {
				inputBinding.streetNumberInput.val('');
			}
			if (inputBinding.streetInput) {
				inputBinding.streetInput.val('');
			}
			if (inputBinding.wardInput) {
				inputBinding.wardInput.val('');
			}
			if (inputBinding.districtInput) {
				inputBinding.districtInput.val('');
			}
			if (inputBinding.provinceInput) {
				inputBinding.provinceInput.val('');
			}
			if (inputBinding.typeInput) {
				inputBinding.typeInput.val('');
			}

			var type;
			if (gmapContext.currentTypes.indexOf('street_address') != -1 || gmapContext.currentTypes.indexOf('route') != -1) {
				type = 'street';
			}
			else if (
				gmapContext.currentTypes.indexOf('sublocality_level_1') != -1 || 
				gmapContext.currentTypes.indexOf('administrative_area_level_2') != -1 ||
				gmapContext.currentTypes.indexOf('locality') != -1){
				type = 'district';
			}
			else if (gmapContext.currentTypes.indexOf('administrative_area_level_1') != -1) {
				type = 'provine';
			}

			switch(type) {
				case 'street':
					if (!address.street || !address.district || !address.province) {
						break;
					}
					if (inputBinding.streetInput) {
						inputBinding.streetInput.val(address.street);
					}
					if (inputBinding.locationNameInput) {
						inputBinding.locationNameInput.val(address.street + ', ' + address.district + ', ' + address.province);
					}
				case 'district':
					if (!address.district || !address.province) {
						break;
					}
					if (inputBinding.districtInput) {
						inputBinding.districtInput.val(address.district).change();
					}
					if (inputBinding.locationNameInput && type == 'district') {
						inputBinding.locationNameInput.val(address.district + ', ' + address.province);
					}
				case 'province':
					if (!address.province) {
						break;
					}
					if (inputBinding.provinceInput) {
						inputBinding.provinceInput.val(address.province).change();
					}
					if (inputBinding.locationNameInput && type == 'province') {
						inputBinding.locationNameInput.val(address.province);
					}
				default:
					break;
			}

			if (inputBinding.typeInput) {
				inputBinding.typeInput.val(type);
			}
			if (inputBinding.streetNumberInput) {
				inputBinding.streetNumberInput.change();
			}
			if (inputBinding.streetInput) {
				inputBinding.streetInput.change();
			}
			if (inputBinding.wardInput) {
				inputBinding.wardInput.change();
			}
			if (inputBinding.districtInput) {
				inputBinding.districtInput.change();
			}
			if (inputBinding.provinceInput) {
				inputBinding.provinceInput.change();
			}
			if (inputBinding.typeInput) {
				inputBinding.typeInput.change();
			}
			if (inputBinding.locationNameInput) {
				if (inputBinding.locationNameInput.val()) {
					inputBinding.locationNameInput.trigger('change', [ true ]);
				}
				else {
					inputBinding.locationNameInput.change();
				}
			}
		}

		/*
			Custom
		*/
		
	}

	function setupInputListenersInput(inputBinding, gmapContext) {
		if (inputBinding) {
			if (inputBinding.radiusInput){
				inputBinding.radiusInput.on("change", function(e) {
					if (!e.originalEvent) { return }
					gmapContext.radius = $(this).val();
					gmapContext.currentTypes = [];
					GmUtility.setPosition(gmapContext, gmapContext.location, function(context){
						context.settings.onchanged.apply(gmapContext.domContainer,
							[GmUtility.locationFromLatLng(context.location), context.radius, false]);
					});
				});
			}
			if (inputBinding.locationNameInput && gmapContext.settings.enableAutocomplete) {
				var blur = false;
				inputBinding.locationNameInput.on('change', function (e, valid) {
					if (!valid) {
						inputBinding.locationNameInput.val('').trigger('change', [ true ]);

						if (inputBinding.latitudeInput) {
							inputBinding.latitudeInput.val('').change();
						}
						if (inputBinding.longitudeInput) {
							inputBinding.longitudeInput.val('').change();
						}
						if (inputBinding.radiusInput) {
							inputBinding.radiusInput.val('').change();
						}
						if (inputBinding.streetNumberInput) {
							inputBinding.streetNumberInput.val('').change();
						}
						if (inputBinding.streetInput) {
							inputBinding.streetInput.val('').change();
						}
						if (inputBinding.wardInput) {
							inputBinding.wardInput.val('').change();
						}
						if (inputBinding.districtInput) {
							inputBinding.districtInput.val('').change();
						}
						if (inputBinding.provinceInput) {
							inputBinding.provinceInput.val('').change();
						}     
					}
				});
				gmapContext.autocomplete = new google.maps.places.Autocomplete(inputBinding.locationNameInput.get(0));
				google.maps.event.addListener(gmapContext.autocomplete, 'place_changed', function() {
					blur = false;
					var place = gmapContext.autocomplete.getPlace();

					if (!place.geometry) {
						gmapContext.settings.onlocationnotfound(place.name);
						return;
					}

					gmapContext.currentTypes = place.types;
					GmUtility.setPosition(gmapContext, place.geometry.location, function(context) {
						updateInputValues(inputBinding, context);
						context.settings.onchanged.apply(gmapContext.domContainer,
							[GmUtility.locationFromLatLng(context.location), context.radius, false]);
					});
				});
				if(gmapContext.settings.enableAutocompleteBlur) {
					inputBinding.locationNameInput.on("change", function(e) {
						if (!e.originalEvent) { return }
						blur = true;
					});
					inputBinding.locationNameInput.on("blur", function(e) {
						if (!e.originalEvent) { return }
						setTimeout(function() {
							var address = $(inputBinding.locationNameInput).val();
							if (address.length > 5 && blur) {
								blur = false;
								gmapContext.geodecoder.geocode({'address': address}, function(results, status) {
									if(status == google.maps.GeocoderStatus.OK  && results && results.length) {
										gmapContext.currentTypes = [];
										GmUtility.setPosition(gmapContext, results[0].geometry.location, function(context) {
											updateInputValues(inputBinding, context);
											context.settings.onchanged.apply(gmapContext.domContainer,
												[GmUtility.locationFromLatLng(context.location), context.radius, false]);
										});
									}
								});
							}
						}, 1000);
					});
				}
			}
			if (inputBinding.latitudeInput) {
				inputBinding.latitudeInput.on("change", function(e) {
					if (!e.originalEvent) { return }
					gmapContext.currentTypes = [];
					GmUtility.setPosition(gmapContext, new google.maps.LatLng($(this).val(), gmapContext.location.lng()), function(context){
						context.settings.onchanged.apply(gmapContext.domContainer,
							[GmUtility.locationFromLatLng(context.location), context.radius, false]);
					});
				});
			}
			if (inputBinding.longitudeInput) {
				inputBinding.longitudeInput.on("change", function(e) {
					if (!e.originalEvent) { return }
					gmapContext.currentTypes = [];
					GmUtility.setPosition(gmapContext, new google.maps.LatLng(gmapContext.location.lat(), $(this).val()), function(context){
						context.settings.onchanged.apply(gmapContext.domContainer,
							[GmUtility.locationFromLatLng(context.location), context.radius, false]);
					});
				});
			}
		}
	}

	function autosize(gmapContext) {
		google.maps.event.trigger(gmapContext.map, 'resize');
		setTimeout(function() {
			gmapContext.map.setCenter(gmapContext.marker.position);
		}, 300);
	}

	function updateMap(gmapContext, $target, options) {
		var settings = $.extend({}, $.fn.locationpicker.defaults, options ),
			latNew = settings.location.latitude,
			lngNew = settings.location.longitude,
			radiusNew = settings.radius,
			latOld = gmapContext.settings.location.latitude,
			lngOld = gmapContext.settings.location.longitude,
			radiusOld = gmapContext.settings.radius;
		
		if (latNew == latOld && lngNew == lngOld && radiusNew == radiusOld)
		return;

		gmapContext.settings.location.latitude = latNew;
		gmapContext.settings.location.longitude = lngNew;
		gmapContext.radius = radiusNew;

		gmapContext.currentTypes = [];
		GmUtility.setPosition(gmapContext, new google.maps.LatLng(gmapContext.settings.location.latitude, gmapContext.settings.location.longitude), function(context){
			setupInputListenersInput(gmapContext.settings.inputBinding, gmapContext);
			context.settings.oninitialized($target);
		});
	}
	/**
	 * Initializeialization:
	 *  $("#myMap").locationpicker(options);
	 * @param options
	 * @param params
	 * @returns {*}
	 */
	$.fn.locationpicker = function( options, params ) {
		if (typeof options == 'string') { // Command provided
			var _targetDomElement = this.get(0);
			// Plug-in is not applied - nothing to do.
			if (!isPluginApplied(_targetDomElement)) return;
			var gmapContext = getContextForElement(_targetDomElement);
			switch (options) {
				case "location":
					if (params == undefined) { // Getter
						var location = GmUtility.locationFromLatLng(gmapContext.location);
						location.radius = gmapContext.radius;
						location.name = gmapContext.locationName;
						return location;
					} else { // Setter
						if (params.radius) {
							gmapContext.radius = params.radius;
						}
						gmapContext.currentTypes = [];
						GmUtility.setPosition(gmapContext, new google.maps.LatLng(params.latitude, params.longitude), function(gmapContext) {
							updateInputValues(gmapContext.settings.inputBinding, gmapContext);
						});
					}
					break;
				case "subscribe":
					/**
					 * Provides interface for subscribing for GoogleMap events.
					 * See Google API documentation for details.
					 * Parameters:
					 * - event: string, name of the event
					 * - callback: function, callback function to be invoked
					 */
					if (params == undefined) { // Getter is not available
						return null;
					} else {
						var event = params.event;
						var callback = params.callback;
						if (!event || ! callback) {
							console.error("LocationPicker: Invalid arguments for method \"subscribe\"")
							return null;
						}
						google.maps.event.addListener(gmapContext.map, event, callback);
					}
					break;
				case "map":
					/**
					 * Returns object which allows access actual google widget and marker paced on it.
					 * Structure: {
					 *  map: Instance of the google map widget
					 *  marker: marker placed on map
					 * }
					 */
					if (params == undefined) { // Getter
						var locationObj = GmUtility.locationFromLatLng(gmapContext.location);
						locationObj.formattedAddress = gmapContext.locationName;
						locationObj.addressComponents = gmapContext.addressComponents;
						return {
							map: gmapContext.map,
							marker: gmapContext.marker,
							location: locationObj
						}
					} else { // Setter is not available
						return null;
					}
				case "autosize":
					autosize(gmapContext);
					return this;
			}
			return null;
		}
		return this.each(function() {
			var $target = $(this);
			// If plug-in hasn't been applied before - initialize, otherwise - skip
			if (isPluginApplied(this)){
				updateMap(getContextForElement(this), $(this), options);
				return;  
			} 
			// Plug-in initialization is required
			// Defaults
			var settings = $.extend({}, $.fn.locationpicker.defaults, options );
			// Initialize
			var gmapContext = new GMapContext(this, {
				zoom: settings.zoom,
				center: new google.maps.LatLng(settings.location.latitude, settings.location.longitude),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				disableDoubleClickZoom: false,
				scrollwheel: false,
				streetViewControl: false,
				radius: settings.radius,
				locationName: settings.locationName,
				settings: settings,
				draggable: settings.draggable,
				required: params.required
			});
			if (settings.scrollwheel) {
				$target.on({
					'focus, click': function () {
						gmapContext.map.setOptions({'scrollwheel': true});
					},
					focusout: function () {
						gmapContext.map.setOptions({'scrollwheel': false});
					}
				}).attr('tabindex', '0').css('outline', '0');
			}

			$target.data("locationpicker", gmapContext);
			// Subscribe GMap events
			google.maps.event.addListener(gmapContext.marker, "dragend", function(event) {
				gmapContext.currentTypes = [];
				GmUtility.setPosition(gmapContext, gmapContext.marker.position, function(context){
					var currentLocation = GmUtility.locationFromLatLng(gmapContext.location);
					context.settings.onchanged.apply(gmapContext.domContainer, [currentLocation, context.radius, true]);
					updateInputValues(gmapContext.settings.inputBinding, gmapContext);
				});
			});

			if (!('location' in options)) {
				console.log(1);
				if (navigator.geolocation) {
					console.log(2);

					gmapContext.currentTypes = [];
					GmUtility.setPosition(gmapContext, new google.maps.LatLng(settings.location.latitude, settings.location.longitude), function(context){
						if (typeof params == 'undefined' || !('isNew' in params) || !params.isNew) {
							updateInputValues(settings.inputBinding, gmapContext);	
						}
						// Set  input bindings if needed
						setupInputListenersInput(settings.inputBinding, gmapContext);
						context.settings.oninitialized($target);
					});

					navigator.geolocation.getCurrentPosition(function (position) {
						GmUtility.setPosition(gmapContext, new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
						// gmapContext.currentTypes = [];
						// GmUtility.setPosition(gmapContext, new google.maps.LatLng(position.coords.latitude, position.coords.longitude), function(context){
						// 	if (typeof params == 'undefined' || !('isNew' in params) || !params.isNew) {
						// 		updateInputValues(settings.inputBinding, gmapContext);	
						// 	}
						// 	// Set  input bindings if needed
						// 	setupInputListenersInput(settings.inputBinding, gmapContext);
						// 	context.settings.oninitialized($target);
						// });
					});
				}
			}
			else {
				gmapContext.currentTypes = [];
				GmUtility.setPosition(gmapContext, new google.maps.LatLng(settings.location.latitude, settings.location.longitude), function(context){
					if (typeof params == 'undefined' || !('isNew' in params) || !params.isNew) {
						updateInputValues(settings.inputBinding, gmapContext);	
					}
					// Set  input bindings if needed
					setupInputListenersInput(settings.inputBinding, gmapContext);
					context.settings.oninitialized($target);
				});
			}
		});
	};
	$.fn.locationpicker.defaults = {
		location: {latitude: 10.771528380460218, longitude: 106.69838659487618},
		locationName: "",
		radius: 500,
		zoom: 15,
		scrollwheel: true,
		inputBinding: {
			latitudeInput: null,
			longitudeInput: null,
			radiusInput: null,
			locationNameInput: null
		},
		enableAutocomplete: false,
		enableAutocompleteBlur: false,
		enableReverseGeocode: true,
		draggable: true,
		onchanged: function(currentLocation, radius, isMarkerDropped) {},
		onlocationnotfound: function(locationName) {},
		oninitialized: function (component) {}
	}
}( jQuery ));