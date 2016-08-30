$(function () {
	$('.blogs .primary-item .title').dotdotdot({
		watch: 'window',
		height: 38
	});
	$('.blogs .primary-item .content').dotdotdot({
		watch: 'window',
		height: 60,
		after: 'a'
	});

	$('.blogs .item .title').dotdotdot({
		watch: 'window',
		height: 34
	});
});