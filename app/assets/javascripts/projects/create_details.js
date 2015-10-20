$(function () {
	initOpenButton();
	initPaint();

	/*
		Focus buttons
	*/

		function initOpenButton() {
			$('#a').on('click', function () {
				$('.create-details-container').addClass('open');
			});
		}

	/*
		/ Focus buttons
	*/

	/*
		Paint
	*/

		function initPaint() {
			var img = new Image();
			img.onload = function() {

 				var 
 					$svg = $('#svg'),
 					$g = $('#g'),
 					tranX = 0,
 					tranY = 0,
 					scale = 1;

				$('#image').attr({
					'width': this.width,
					'height': this.height,
					'x': $svg.width() / 2 - this.width / 2,
					'y': $svg.height() / 2 - this.height / 2,
					'xlink:href': this.src
				});

				// $g.css('transition', 'transform .05s');
				$svg.on({
					mousewheel: function (e) {
						isUp = e.originalEvent.wheelDelta < 0;

						if (isUp) {
							if (scale < 0.5) {
								return;
							}
							scale -= 0.1;
						}
						else {
							if (scale > 2) {
								return;
							}
							scale += 0.1;
						}

						tranX = (-e.clientX - tranX) * (scale - 1);
						tranY = (-e.clientY - tranY) * (scale - 1);

						updateViewBox();
					},
					mousedown: function (e) {
						var
							x = e.offsetX,
							y = e.offsetY,
							movedX = 0,
							movedY = 0;

						$body.on({
							'mouseup mouseout': function () {
								$body.off('mouseup mouseout mousemove').css('cursor', 'default');

								tranX += movedX;
								tranY += movedY;
							},
							mousemove: function (e) {
								movedX = e.offsetX - x;
								movedY = e.offsetY - y;

								updateViewBoxWithValue(
									tranX + movedX, 
									tranY + movedY, 
									scale);
							}
						}).css('cursor', 'move');
					}
				})

				function updateViewBox() {
	 				$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
				}

				function updateViewBoxWithValue(tranX, tranY, scale) {
	 				$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scale +')');
				}

			}
			img.src = '/assets/a.jpg';
		}

	/*
		/ Paint
	*/
})