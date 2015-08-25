$(function () {
	var 
		$list = $('#mails_list');

	initRead();

	/*
		Read
	*/

	function initRead() {
		$list.children().on('click', function (e) {
			if (!$(e.target).is('[type="checkbox"]')) {
				window.location = '/mail_boxes/read/' + $(this).data('value');
			}
		});
	}

	/*
		/ Read
	*/
});