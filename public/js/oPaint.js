$(document).ready(function() {
  
  // Variables :
  var color = "#000";
  var painting = false;
  var started = false;
  var width_brush = 5;
  var oneClick=0;
  var canvas = $("#canvas");
  var cursorX, cursorY,oldX,oldY;
  var context = canvas[0].getContext('2d');
  //context.canvas.width  = window.innerWidth;
  //context.canvas.height = window.innerHeight;
  var socket = io.connect();
  var id;
  var oldPostionX=new Array();
  var oldPostionY=new Array();
  // Trait arrondi :
  context.lineJoin = 'round';
  context.lineCap = 'round';
    

    socket.on('reset', function (data)
    {
       clear_canvas();
       $("#largeur_pinceau").attr("value", 5);
       width_brush = 5;
    });
      socket.on('id', function (data)
    {
      id=data;
      
    
    });

    socket.on('newPoint', function (data)
    { 
      if(data[6]==0)
      {
         context.beginPath();
         context.arc(data[2], data[3], data[1]/2, 0, 2 * Math.PI, false);
         context.fillStyle = data[0];
         context.fill();
         
      }
      if(!data[4]){oldPostionX[data[5]]=null;}
      if(!oldPostionX[data[5]])
      {
        context.beginPath();  
        oldPostionX[data[5]]=data[2];
        oldPostionX[data[5]]=data[3];
      }
      else
      {
        context.moveTo(oldPostionX[data[5]], oldPostionY[data[5]]);
        context.lineTo(data[2], data[3]);
        context.strokeStyle = data[0];
        context.lineWidth = data[1];
        context.stroke();
        oldPostionX[data[5]]=data[2];
        oldPostionX[data[5]]=data[3];

      }

    });
  
  socket.on('oldStuff', function (data)
    {
      for(i=0;i<=data.length;i++)
      {
        if (!data[i][4])
        {
          // Je place mon curseur pour la première fois :
          context.beginPath();
          context.moveTo(data[i][2], data[i][3]);
          
        }
        // Sinon je dessine
        else
        {

          context.lineTo(data[i][2], data[i][3]);
          context.strokeStyle = data[i][0];
          context.lineWidth = data[i][1];
          context.stroke();
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
  canvas.mousedown(function(e) {
    oneClick=0;

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
      sendInfo(0);
      context.beginPath();
      context.arc(cursorX, cursorY, width_brush/2, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }
    painting = false;
    started = false;
  });
  

  // Mouvement de la souris sur le canvas :
  canvas.mousemove(function(e) {
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
      context.beginPath();
      context.moveTo(cursorX, cursorY);
      started = true;

    }
    // Sinon je dessine
    else {
      context.moveTo(oldX, oldY);
      context.lineTo(cursorX, cursorY);
      context.strokeStyle = color;
      context.lineWidth = width_brush;
      context.stroke();
    }
  }
  
  // Clear du Canvas :
  function clear_canvas() {
    context.clearRect(0,0, canvas.width(), canvas.height());
  }
  
  // Pour chaque carré de couleur :
  $("#couleurs a").each(function() {
    // Je lui attribut une couleur de fond :
    $(this).css("background", $(this).attr("data-couleur"));
    
    // Et au click :
    $(this).click(function() {
      // Je change la couleur du pinceau :
      color = $(this).attr("data-couleur");
      
      // Et les classes CSS :
      $("#couleurs a").removeAttr("class", "");
      $(this).attr("class", "actif");
      
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
  
  $("#confirm").click(function() {
    socket.emit('reset');
    $('#myModal').modal('hide');
    clear_canvas();
    $("#largeur_pinceau").attr("value", 5);
    width_brush = 5;
    });

});