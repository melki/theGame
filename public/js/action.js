$(document).ready(function() {
  
  // Variables :
  var color = "#000";
  var painting = false;
  var started = false;
  var width_brush = 5;
  var oneClick=0;
  var canvas0 = $("#canvas0");
  var canvas1 = $("#canvas1");
  var canvas2 = $("#canvas2");
  var cursorX, cursorY,oldX,oldY;
  var context = new Array();
  context[0] = canvas0[0].getContext('2d');
  context[1] = canvas1[0].getContext('2d');
  context[2] = canvas2[0].getContext('2d');
  //context[0].canvas.width  = window.innerWidth;
  //context[0].canvas.height = window.innerHeight;
  var socket = io.connect();
  var id;
  var oldPostionX=new Array();
  var oldPostionY=new Array();
  // Trait arrondi :
  context[0].lineJoin = 'round';
  context[0].lineCap = 'round';
    

    socket.on('reset', function (data)
    {
       clear_canvas();
       $("#largeur_pinceau").attr("value", 5);
       width_brush = 5;
    });
      
      socket.on('id', function (data)
    {
      id=data-1;
      if(data>3)
      {
        window.location='/error';
      }
    
    });

      socket.on('clients', function (data)
    {
      $('#project').text("n° "+(id+1)+"/"+data );
      
    
    });

    socket.on('newPoint', function (data)
    { 
      if(data[6]===0)
      {
         context[0].beginPath();
         context[0].arc(data[2], data[3], data[1]/2, 0, 2 * Math.PI, false);
         context[0].fillStyle = data[0];
         context[0].fill();
         
      }
      if(!data[4]){oldPostionX[data[5]]=null;}
      if(!oldPostionX[data[5]])
      {
        context[0].beginPath();  
        oldPostionX[data[5]]=data[2];
        oldPostionX[data[5]]=data[3];
      }
      else
      {
        context[0].moveTo(oldPostionX[data[5]], oldPostionY[data[5]]);
        context[0].lineTo(data[2], data[3]);
        context[0].strokeStyle = data[0];
        context[0].lineWidth = data[1];
        context[0].stroke();
        oldPostionX[data[5]]=data[2];
        oldPostionX[data[5]]=data[3];

      }

    });
  
  socket.on('oldStuff', function (data)
    {
      for(i=0;i<=data.length;i++)
      {
    if(data[i][6]===0)
      {
         context[0].beginPath();
         context[0].arc(data[i][2], data[i][3], data[i][1]/2, 0, 2 * Math.PI, false);
         context[0].fillStyle = data[i][0];
         context[0].fill();
         
      }
      if(!data[i][4]){oldPostionX[data[i][5]]=null;}
      if(!oldPostionX[data[i][5]])
      {
        context[0].beginPath();  
        oldPostionX[data[i][5]]=data[i][2];
        oldPostionX[data[i][5]]=data[i][3];
      }
      else
      {
        context[0].moveTo(oldPostionX[data[i][5]], oldPostionY[data[i][5]]);
        context[0].lineTo(data[i][2], data[i][3]);
        context[0].strokeStyle = data[i][0];
        context[0].lineWidth = data[i][1];
        context[0].stroke();
        oldPostionX[data[i][5]]=data[i][2];
        oldPostionX[data[i][5]]=data[i][3];

      }

      }   
    });



  function sendInfo(point)
  {
      var data = new Array();
      data[0]=color;
      data[1]=width_brush;
      data[2]=cursorX;
      data[3]=cursorY;
      data[4]=started;
      data[5]=id;
      data[6]=point;
      
      socket.emit('infoPoint',data);
      
  }

  // Click souris enfoncé sur le canvas, je dessine :
  canvas2.mousedown(function(e) {
    oneClick=0;
    context[0].closePath();
    painting = true;
    var targ;
    if (!e)
        e = window.event;
    if (e.target)
        targ = e.target;
    else if (e.srcElement)
        targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
    // Coordonnées de la souris :
    oldX=cursorX; 
    oldY=cursorY; 
    cursorX = (e.pageX -  $(targ).offset().left);
    cursorY = (e.pageY -  $(targ).offset().top);

  });
  
  // Relachement du Click sur tout le document, j'arrête de dessiner :
  $(this).mouseup(function() {
     if(painting===true && oneClick===0)
     {
      context[id].closePath();
      sendInfo(0);
      context[id].beginPath();
      context[id].arc(cursorX, cursorY, width_brush/2, 0, 2 * Math.PI, false);
      context[id].fillStyle = color;
      context[id].fill();
      context[id].closePath();
     
    }
    painting = false;
    started = false;
  });
  

  // Mouvement de la souris sur le canvas :
  canvas2.mousemove(function(e) {
    // Si je suis en train de dessiner (click souris enfoncé) :
    if (painting) {
      // Set Coordonnées de la souris :
       var targ;
    if (!e)
        e = window.event;
    if (e.target)
        targ = e.target;
    else if (e.srcElement)
        targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
       
       oldX=cursorX; 
       oldY=cursorY; 

      cursorX = (e.pageX -  $(targ).offset().left) - 1;
      cursorY = (e.pageY -  $(targ).offset().top) - 1;
      // Dessine une ligne :
      context[id].closePath();
      drawLine();
    }
  });
  
  // Fonction qui dessine une ligne :
  function drawLine() {
      oneClick=1;    
     sendInfo(1);
    // Si c'est le début, j'initialise
    if (!started) {
      // Je place mon curseur pour la première fois :
      context[id].beginPath();
      context[id].moveTo(cursorX, cursorY);
      started = true;

    }
    // Sinon je dessine
    else {
      context[id].beginPath();
      context[id].moveTo(oldX, oldY);
      context[id].lineTo(cursorX, cursorY);
      context[id].strokeStyle = color;
      context[id].lineWidth = width_brush;
      context[id].stroke();
    }
  }
  
  // Clear du Canvas :
  function clear_canvas() {
    for (var i = 0; i < 3; i++) {
      
    context[i].clearRect(0,0, canvas2.width(), canvas2.height());
    };
  }
  
  // Pour chaque carré de couleur :
  $("#couleurs a").each(function() {
    // Je lui attribut une couleur de fond :
    $(this).css("background", $(this).attr("data-couleur"));
    
    // Et au click :
    $(this).click(function() {
      // Je change la couleur du pinceau :
      color = $(this).attr("data-couleur");
      $('#dropColor').css("background-color", color);
      // Et les classes CSS :
      $("#couleurs a").removeAttr("class", "");
      $(this).attr("class", "actif");
      $("#couleurs").hide(); 
      return false;
    });
  });
  
  // Largeur du pinceau :
  $("#largeurs_pinceau input").change(function() {
    if (!isNaN($(this).val())) {
      width_brush = $(this).val();
     
    }
  });
  
  // Bouton Reset :
  $("#reset").click(function() {
    $('#myModal').modal('show');
  });
  $("#dropColor").click(function() {
    $('#couleurs').show();
  });

  
  $("#confirm").click(function() {
    socket.emit('reset');
    $('#myModal').modal('hide');
    clear_canvas();
    $("#largeur_pinceau").attr("value", 5);
    width_brush = 5;
    });

});