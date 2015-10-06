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
});

/*
	Facebook
*/

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function me() {
  FB.api('/me', function(response) {
    console.log(response);
    console.log('http://graph.facebook.com/' + '')
  });
  // FB.api('/me/permissions', function(response) {
  //   console.log(response);
  // });
}

function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1456463541347476',
    xfbml      : true,
    version    : 'v2.4'
  });

  // FB.getLoginStatus(function(response) {
  //   statusChangeCallback(response);
  // });
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