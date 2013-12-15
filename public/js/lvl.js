var socket = io.connect();
$(document).ready(function() {

	 $("#save").click(function() {
       
        socket.emit('modificationLvl', $("#content").val())

       
    });


});