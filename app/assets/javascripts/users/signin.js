$(function () {
	var $form = $('#signin_form');

	initForm($form, {
		object: 'user',
		submit: function () {
			$form.find('.callout-danger').remove();

			toggleLoadStatus(true);
			$.ajax({
				url: '/signin',
				method: 'POST',
				data: $form.serialize(),
				dataType: 'JSON'
			}).always(function () {
				toggleLoadStatus(false);
			}).done(function (data) {
				if (data.status == 0) {
          window.location = '/';
				}
				else if (data.status == 5) {
					if (data.result.status == 3) {
						window.location = '/users/active_callout/' + data.result.result + '?status=unactive';
						return;
					}

          popupPrompt({
            title: _t.form.error_title,
            content: data.result.result,
            type: 'danger',
            onEscape: function () {
            	$form.find('#password').val('').focus();
		          if (data.result.status == 1) {
		        		// Account wrong
            		$form.find('#account').select();
		          }
            }
          });
				}
				else {
          popupPrompt({
            title: _t.form.error_title,
            type: 'danger',
            content: _t.form.error_content
          });
				}
			}).fail(function () {
        popupPrompt({
          title: _t.form.error_title,
          type: 'danger',
          content: _t.form.error_content
        })
			});
		}
	});
  initFacebook();

  /*
    Facebook
  */

    function initFacebook() {
      $('[aria-click="facebook_login"]').on('click', function () {
        request();
      });
    }
    
    function request() {
      FB.login(function (response) {
        if (response.status == 'connected') {
          FB.api('/me/permissions', function(response) {
            var valid = true;
            $(response.data).each(function () {
              if (this.status != 'granted') {
                valid = false;
                return false;
              }
            });
            if (valid) {
              window.location = '/auth/facebook/callback';
            }
          }); 
        }
      }, {
        scope: 'public_profile,email',
        auth_type: 'rerequest'
      });
    }

  /*
    / Facebook
  */

});

/*
	Facebook
*/

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1456463541347476',
    xfbml      : true,
    cookie     : true,
    version    : 'v2.4'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

/*
	/ Facebook
*/