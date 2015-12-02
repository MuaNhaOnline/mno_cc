$(function () {

	    var chart = new CanvasJS.Chart('view_part', {

	      title:{
	        text: "Fruits sold in First Quarter"              
	      },
	      data: [//array of dataSeries              
	        { //dataSeries object

	         /*** Change type "column" to "bar", "area", "line" or "pie"***/
	         type: "column",
	         dataPoints: [
	         { label: "banana", y: 18 },
	         { label: "orange", y: 29 },
	         { label: "apple", y: 40 },                                    
	         { label: "mango", y: 34 },
	         { label: "grape", y: 24 }
	         ]
	       }
	       ]
	     });

	    chart.render();
	    return;
	$.ajax({
		url: '/sessions/get_data',
		data: [],
		dataType: 'JSON'
	}).done(function (data) {
		if (data.status == 0) {
		}
		else {
			errorPopup();
		}
	}).fail(function () {
		errorPopup();
	});
});