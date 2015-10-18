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
 					scaleX = 1,
 					scaleY = 1;

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
							if (scaleX != 0 && scaleY != 0) {
								scaleX -= 0.1;
								scaleY -= 0.1;	
							}
						}
						else {
							scaleX += 0.1;
							scaleY += 0.1;
						}

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
									scaleX, scaleY);
							}
						}).css('cursor', 'move');
					}
				})

				function updateViewBox() {
	 				$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scaleX + ', ' + scaleY +')');
				}

				function updateViewBoxWithValue(tranX, tranY, scaleX, scaleY) {
	 				$g.css('transform', 'translate(' + tranX + 'px,' + tranY + 'px) scale(' + scaleX + ', ' + scaleY +')');
				}

			}
			img.src = '/assets/a.jpg';
		}

	/*
		/ Paint
	*/
})