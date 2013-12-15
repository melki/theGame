var socket = io.connect();
$(document).ready(function() {

	 $(".modifiable").click(function() {
     	var content = $(this).html()
     	$(this).html('<input type="text" value="'+content+'"/>');
    });

	 $(".save").click(function() {
     	var i = $(this).parents("tr").attr("id");
     	alert(i);
    });


});