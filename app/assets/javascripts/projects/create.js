$(document).ready(function() {
	//init DatePicker
	$('.date').datepicker({
		format: 'dd/mm/yyyy',
		locate: 'vi'
	});

	//init Expand
	initExpand();
	//init ImageUpload
	initImageUpload();	
});

/* #start initExpand */
function initExpand() {
	$('.expand').on('click', function(e) {
		e.preventDefault();
		
		expandObject = $(this).data('target');
		
		$(expandObject).slideToggle();

		if ($(this).attr('id') == "btn_continue_composing") {
			$(this).parent().hide();
		}
	});
}
/* #end initExpand */

/* #start Image upload */
function initImageUpload() {
    $('.image-upload input[type="file"]').on('change', function() {
        //Check file exist
        if (this.files.length == 0) {
            return;
        }

        //Get container
        $fileUploadContainer = $(this).parents('.image-upload');
        //Get & reset progress bar
        var progressBar = $fileUploadContainer.children('u')[0];
        progressBar.style.width = '0%';

        //Collect data
        var data = new FormData();
        data.append('file', this.files[0]);
        data.append('type', 'real_estate');

        //post request
        $.ajax({
            url: '/images/upload',
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            dataType: 'JSON',
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if(xhr.upload){ //Check if upload property exists
                    xhr.upload.addEventListener('progress', function(e) {
                        if(e.lengthComputable){
                            progressBar.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
                        }
                    }, false); //For handling the progress of the upload
                }
                return xhr;
            }
        }).done(function(data) {
            if (data.status == 1) {
                $fileUploadContainer.addClass('has-file');
                $fileUploadContainer.find('img').attr('src', data.result.path);
                $fileUploadContainer.children('input[type="hidden"]').val(data.result.id);
            }
            else {
                alert('Thêm file thất bại')
            }
        }).fail(function() {
            alert('Thêm file thất bại')
        }).always(function() {
            progressBar.style.width = '0%';
        });
    });

    $('.image-upload i').on('click', function() {
        if (!confirm('Bạn có chắc muốn xóa hình này?')) {
            return;
        }

        //Get container
        $fileUploadContainer = $(this).parents('.image-upload');

        $fileUploadContainer.removeClass('has-file');
        $fileUploadContainer.children('input[type="hidden"]').val('');
    });
}
/* #end Image upload */