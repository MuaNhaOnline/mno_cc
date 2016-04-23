$(function () {

	// Fixed main menu
	
		_initFixedScroll(
			$('.main-menu-ctn'),
			$('main')
		);
	
	// / Fixed main menu

});

// Toggle page spinner (GLOBAL)

	function _togglePageSpinner(down) {
		if (down) {
			$('#page_spinner').slideDown();
		}
		else {
			$('#page_spinner').slideUp();
		}
	}

// / Toggle page spinner