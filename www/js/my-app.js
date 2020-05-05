  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Joyride',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/about/',
        url: 'about.html',
      },
      {
        path: '/mapa/',
        url: 'mapa prueba.html',
      },
      
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var correo, clave;

//variables para local
var storage = window.localStorage;
var usuario = { "email": "", "clave": "" };
var usuarioLocal, claveLocal;
var consultaLocal;
// variables para firebase
var nombreFavorito="";
//variables para gps

var latUsuario, lonUsuario;

//variables para mapas
var query="  ";
var service;
var platform;
var map;
var queryBusqueda = " ";
var indice = 0;
var container;
var container2;
var marcador;
var marcador1;
var marcador2;
var marcador3;
var marcador4;
var marcador5;
var marcador6;
var marcador7;
var marcador8;
var marcador9;
var marcador10;
var marcador11;
var marcador12;
var l=0;
var n=0;
//variables para ruta
var routeLine, startMarker, endMarker;
var ruta=0;
//variables para interaccion con mapa
var m=0;
var n=0;
var marcadorFavorito = new H.map.Icon("https://image.flaticon.com/icons/svg/727/727584.svg", {size: {w: 50, h: 50}});
var e=0;//variable bandera dynamicSheet Favorito
var ubicacionUsuario;
var coord;
var dynamicSheet;
var coordenadas;
var label;
var locationId;
var d=0;//variable bandera dynamicSheet Favorito
var f=0;//variable bandera creacion de marcador de favorito
var marker2;//variable marcador favorito
var container4;//variable grupo marcador favorito
var marker;
var u=0;
var g=0;
//variables para tracking/calculo distancia
var lat2;
var lon2;
//variables para alarmas
var a=0; //variable bandera marcador alarma
var marcadorAlarma = new H.map.Icon("https://image.flaticon.com/icons/svg/727/727606.svg", {size: {w: 50, h: 50}});
var coordsAlarma;
var markerAlarma;
var fab=0;
var distanciaParaMostrar;
var unidad;
var distancia; //variable que se define al hacer un longpress en pantalla
var alarma = 0; //variable para activar y desactivar alarma
var distanciaAlarma=0;//variable que deberia definirse desde el picker
var metrosOkilometros;
var latAlarma1;
var lonAlarma1;
var distanciaAlarmaParaMostrar;
var metrosOkilometrosParaMostrar;
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
   
    

    console.log("Device is ready!");
    //para que funcione hay que darle al ENTER del teclado!
    $$("#busqueda").change(function(){
      if ($$("#busqueda").val()!=""){
        guardarQuery();
        console.log("tomó el change");
      };
    })

    geolocalizacion();
    setInterval(recalculaPosicion,3000);
    consultarLocalStorage();
    
    


    var iniciarDatos = 1;
    if ( iniciarDatos == 1 ) {
        fnIniciarDatos();
    }
    
    $$("#user").on('click', fnConsultarFavorito);
    $$(".guardarBd").on('click', guardar);
    $$("#consultarBd").on('click', consultar);
    $$(".Ubicame").on('click', function(){
      console.log(distanciaAlarma);
      ubicame();
    }); 
    $$('.cerrarPicker').on('click', function(){
      pickerDescribe.close();
    })

    var panel = app.panel.create({
          el: '.panel-registro',
          swipeOnlyClose: true,
          on: {
                opened: function () {
                  console.log('Panel opened')
                }
              }
    });

 
    //$$('#enviarRegistro').on('click', crearRegistro());
    $$('#enviarRegistro').on('click', crearRegistro);
    


            


    //$$('#enviarLogin').on('click', Loguearse()); // VA SIN LOS ()
    $$('#enviarLogin').on('click', Loguearse);

    

   
    //$$("#google").on('click', loginConGoogle()); // VA SIN LOS ()
    $$("#google").on('click', loginConGoogle);

   

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);

    db = firebase.firestore();
    refUsuarios = db.collection("USUARIOS");
    refTiposUsuarios= db.collection("TIPOS_USUARIOS");
    refFavoritos=db.collection("LUGARES_FAVORITOS");




});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    
    
     $$('.guardarBd').on('click', guardar);


}); // AGREGADO



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
   // geolocalizacion();
   
    
    





    
})


/** FUNCIONES PROPIAS **/
    function guardar() {
      console.log("hello World");
      console.log(correo);
      
      var data = {
          nombre: "pedro",
          apellido: clave,
          web: "web.com",
          telefono: "1234",
          fnac: "01/01/1999",
          tipo: "VIS"
        }
        refUsuarios.doc(correo).set(data);
      
    }
    function consultar(){
      var apellido="";
      var consulta = db.collection("USUARIOS").doc(correo);
        consulta.get().then(function(doc){
          if (doc.exists) {
            console.log("document data: ", doc.data().apellido);
            apellido= doc.data().apellido;
            console.log("apellido: "+ apellido);
          } else {
            //doc.data() will be undefined un this case
            console.log("no such document");
          }
        }).catch(function(error){
          console.log("error getting document:",error);
        });
      
    };
    function fnGuardarFavorito(n) {
      console.log("hello World");
      console.log(correo);
      console.log(n);
      var data = {
          user: correo,
          id: locationId,
          label: label,
          coordenadas: coordenadas,
          nombre: n,
        }
        refFavoritos.add(data);
      
    }
     function fnConsultarFavorito(){

      $$("#listaFavoritos").empty();
      refFavoritos.where("user","==",correo).get()
        .then(function(querySnapshot){
          querySnapshot.forEach(function(doc){
            console.log("data: "+doc.data().nombre);
            
            console.log("data: "+doc.data().label);
            
            console.log("data: "+doc.data().coordenadas);
            
            console.log("data: "+doc.data().id);
            console.log(doc.id);

            
            
            $$("#listaFavoritos").append('<div class="list accordion-list '+doc.id+'">'+
                                            '<ul>'+
                                              '<li class="accordion-item"><a href="#" class="item-content item-link">'+
                                                '<div class="item-inner">'+
                                                  '<div class="item-title">'+doc.data().nombre+'</div>'+
                                                '</div></a>'+
                                                '<div class="accordion-item-content">'+
                                                  '<div class="block">'+
                                                    '<div class="list links-list">'+
                                                      '<ul class="listaFavoritos">'+
                                                        '<li class="unFavorito" id="'+doc.data().coordenadas+'" value="'+doc.data().nombre+'"><a href="#">Abrir</a></li>'+
                                                        '<li class="eliminarFavorito" id="'+doc.id+'"><a href="#">Eliminar</a></li>' +
                                                      '</ul>'+
                                                    '</div>'+
                                                  '</div>'+
                                                '</div>'+
                                              '</li>'+
                                            '</ul>'+
                                          '</div>');

            $$(".unFavorito").on('click',function(){
                  console.log("hiciste click en un favorito");
                  abrirFavorito(this.id);
                  obtieneNombreFavorito(this.value);
                  //app.popover.close(".popoverResultados",true);   
            });
            $$(".eliminarFavorito").on('click', function(){
              eliminarFavorito(this.id);
              $$("."+this.id).remove();
            })
          })
        })
    };
    function eliminarFavorito(docId){
      refFavoritos.doc(docId).delete();
    }
    //ESTE ES EL CONTENIDO QUE HAY QUE PONER EN EN APPEND PARA PODER BORRAR LOS FAVORITOS
    function paraLaburarElAppend(){
                                '<div class="list accordion-list '+doc.id+'">'+
                                  '<ul>'+
                                    '<li class="accordion-item"><a href="#" class="item-content item-link">'+
                                      '<div class="item-inner">'+
                                        '<div class="item-title">favorito 1</div>'+
                                      '</div></a>'+
                                      '<div class="accordion-item-content">'+
                                        '<div class="block">'+
                                          '<div class="list links-list">'+
                                            '<ul class="listaFavoritos">'+
                                              '<li class="unFavorito" id="'+doc.data().coordenadas+'" value="'+doc.data().nombre+'"><a href="#">Abrir</a></li>'+
                                              '<li class="eliminarFavorito" id="'+doc.id+'"><a href="#">Eliminar</a></li>' +
                                            '</ul>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'+
                                '</div>'


                                '<li class="unFavorito" id="'+doc.data().coordenadas+'" value="'+doc.data().nombre+'"><a href="#">'+doc.data().nombre+'</a></li>'
    }
    function obtieneNombreFavorito(nombre){
      nombreFavorito=nombre;
    };
    function abrirFavorito(lascoordenadas){
      console.log("entro a abrirFavorito y las coords son: "+lascoordenadas);

      function reverseGeocode(platform) {
        console.log("entro a reversegeocode");
              var geocoder = platform.getGeocodingService(),
                parameters = {
                  prox: lascoordenadas+",57",
                  mode: 'retrieveAddresses',
                  maxresults: '1',
                  gen: '9'};

              geocoder.reverseGeocode(parameters,
                function (result) {
                  g=1;
                  console.log("aca estamos");
                  console.log(JSON.stringify(result));
                  console.log(JSON.stringify(result.Response.View[0].Result[0].Location.LocationId));
                  locationId=JSON.stringify(result.Response.View[0].Result[0].Location.LocationId);
                  console.log("locationId"+locationId)
                  console.log(JSON.stringify(result.Response.View[0].Result[0].Location.Address.Label));
                  label= JSON.stringify(result.Response.View[0].Result[0].Location.Address.Label);
                  lat2=JSON.stringify(result.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
                  lon2=JSON.stringify(result.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
                  console.log("lat2="+lat2);
                  console.log("lon2="+lon2);
                  coordenadas=lat2+","+lon2;
                  coordsBusqueda = {lat: lat2, lng: lon2};
                  console.log("coordenadas="+coordenadas)
                  
                  //console.log(JSON.stringify(result.Response.View[0].Result[0].Location.Address.Street));
                  if (g==1){
                      if (d==1){
                      dynamicSheet.close();
                      };
                      if (e==1){
                        dynamicSheet2.close();
                      }
                      crearDynamicSheet2();
                      if (u==1){
                        container3.removeAll();
                      };
                      if (f==1){
                        container4.removeAll();
                      };
                      
                      f=1;
                      marker2 = new H.map.Marker(new H.geo.Point(lat2, lon2), {icon: marcadorFavorito});
                      container4 = new H.map.Group({
                          objects: [marker2]
                        });
                      map.addObject(container4);

                      map.setCenter(coordsBusqueda);
                      app.panel.close(".panel-user", true)
                  };
                }, function (error) {
                  alert(error);
                }
              );
          };
          reverseGeocode(platform)
            /*
            if (d==1){
            dynamicSheet.close();
            }*/
    }

    function crearDynamicSheet2(){
        e=1;
              dynamicSheet2 = app.sheet.create({
                El: ".hojafavorito",
                backdropEl: ".contenedormapa",
                swipeToClose: true,
                swipeToStep: true,
                 backdrop: true,
                 closeByOutsideClick:true,
                swipeHandler: ".swipe-handler",
                content:  '<div class="sheet-modal my-sheet-swipe-to-close" style="height:auto; --f7-sheet-bg-color: #fff; opacity:0.95">'+
                            '<div class="swipe-handler">'+  
                              '<div class="sheet-modal-inner">'+
                                
                                '<div class="sheet-modal-swipe-step">'+
                                  '<div class="block">'+
                                    '<h2>'+label+'</h2>'+
                                    '<div class="row">'+
                                      '<div id="'+coordenadas+'" class="col-50 crearRuta boton button button-round button-fill">Obtener ruta</div>'+
                                      '<div class="col-50 activarAlarma boton button button-round button-fill">Activar alarma</div>'+
                                    '</div>'+
                                    '<p>Tus coordenadas son:</p>'+
                                    '<p>'+coordenadas+'</p>'+
                                    '<p><a href="#" class="link sheet-close">Close me</a></p>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>',
              });
              dynamicSheet2.open();
              $$(".crearRuta").on('click',function(){
                  crearRuta(this.id);
                  dynamicSheet2.close();
                  map.removeObject(marker);  
              });
              $$(".activarAlarma").on('click',function(){
                  console.log("hiciste click en activar alarma");
                  activarAlarma();  
              });
              

      };
    function fnIniciarDatos() {

        codido = "VIS"; tipo = "Visitantes"; saludo = "Hola Visitante";
        var data = {
          tipo: tipo, saludo: saludo
        }
        refTiposUsuarios.doc(codido).set(data);

        codido = "ADM"; tipo = "Administrador"; saludo = "Hola Mr. Admin";
        var data = {
          tipo: tipo, saludo: saludo
        }
        refTiposUsuarios.doc(codido).set(data);

        codido = "COM"; tipo = "Comercio"; saludo = "Hola Comercio";
        var data = {
          tipo: tipo, saludo: saludo
        }
        refTiposUsuarios.doc(codido).set(data);

        var data = {
          nombre: "Admin",
          apellido: "Apellido",
          web: "web.com",
          telefono: "1234",
          fnac: "01/01/1999",
          tipo: "ADM"
        }
        refUsuarios.doc("admin@admin.com").set(data);
    };

function crearRegistro(){
        var correo = $$('#emailRegistro').val();
        var clave = $$('#claveRegistro').val();
        //Se declara la variable huboError (bandera)



        var huboError = 0;

        firebase.auth().createUserWithEmailAndPassword(correo, clave)
            .catch(function(error) {
                //Si hubo algun error, ponemos un valor referenciable en la variable huboError
                huboError = 1;
                var errorCode = error.code;
                var errorMessage = error.message;
               
                console.log(errorCode);
                console.log(errorMessage);
            })
            .then(function(){   
                //En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
                if(huboError == 0){
                    app.panel.close('.panel-registro', true);
                    alert("ok");
                    $$("#tituloindex").text(correo);
                    mainView.router.navigate("/about/");
                    console.log(huboError);
                }
            }); 
            // [END createwithemail]
    };

    function Loguearse(){
      
        correo = $$('#emailLogin').val();
        clave = $$('#claveLogin').val();

        //Se declara la variable huboError (bandera)
        var huboError = 0;     
        firebase.auth().signInWithEmailAndPassword(correo, clave)
            .catch(function(error){
                //Si hubo algun error, ponemos un valor referenciable en la variable huboError
                huboError = 1;
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
                console.log(errorCode);
                alert(errorMessage);
                alert(errorCode);
                app.panel.close('.panel-login', true);
            })
            .then(function(){   
                //En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
                if(huboError == 0){
                    
                    app.panel.close('.panel-login', true);
                    mensajeLogin();
                    $$("#user").text(correo);
                    $$("nombreUsuario").text(correo);
                    $$("user").attr("data-panel",".panel-user");
                    usuario = { email: correo, clave: clave };
                    
                    console.log("usuario, te estamos guardando");
                    //storage.setItem("persona", persona); -> guardará [object Object]
                    var usuarioAGuardar = JSON.stringify(usuario);
                    // por eso convertimos el JSON en un string
                    
                    
                    storage.setItem("usuario", usuarioAGuardar);
                    console.log("usuarioAGuardar: " + usuarioAGuardar);
                    console.log("usuario: " + usuario.email + "password: " + usuario.clave);
                    
                    
                }
            }); 
    };

    function mensajeLogin(){
        console.log("te Logueaste");
        alert("te logueaste");
    };

    function loginConGoogle(){
         //Se declara la variable huboError (bandera)
        var huboError = 0; 

        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider)
        .then(function(result) {
        if(huboError == 0){
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
          mensajesLoginGoogle();
          console.log("te logueaste "+ user);
          alert("te logueaste "+ user);
        }
        })
        .catch(function(error) {
            //Si hubo algun error, ponemos un valor referenciable en la variable huboError
                huboError = 1;
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          mensajesLoginGoogle();
        });
    };

    function mensajesLoginGoogle(){
          console.log("te logueaste "+ user);
          alert("te logueaste "+ user);
    };
    function guardarQuery(){
        queryBusqueda=$$("#busqueda").val();
        console.log(queryBusqueda);
        // Get an instance of the geocoding service:
      service = platform.getSearchService();

      // Call the geocode method with the geocoding parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
      if (l==1){
        container.removeAll();
      };


      service.geocode({
        q: queryBusqueda
      }, (result) => {
        crearPopoverResultados();
        indice=1;
        //var group = new H.map.Group();
        //map.addObject(group);
        // get geo bounding box for the group and set it to the map
        
        // Add a marker for each location found
        result.items.forEach((item) => {
          console.log(indice);
         // map.addObject(new H.map.Marker(item.position));
          eval("marcador"+indice+" = new H.map.Marker(new H.geo.Point("+item.position.lat+", "+item.position.lng+"))");


// VER OPCION
/*
var marcadores = []; // como variable global

marcadores[i] = new H.map...........


OPCION 2:
var marcadores = [];

marcador = new H.map..........
marcadores.push(marcador)
PUSH agrega un elemento al array


y abajo

objects: marcadores








*/

         // var brandenburgerTorMarker = new H.map.Marker(new H.geo.Point(52.516237, 13.377686));
          console.log("lat: "+item.position.lat);
          console.log("lng: "+item.position.lng);
          console.log(item.address.street+", " +item.address.houseNumber+", "+item.address.city+", " +item.address.state+", " +item.address.countryName);
          console.log(item.title)
          // crearPopoverResultados();
          indice++;
          /*
          //creo una variable de acumulacion para poder identificar los resultados a la hora de crear el grupo de marcadores
          indice++;
          eval(" resultado ="+indice);
          console.log(resultado);
          */
          /* CON ESTO INTENTO CONCATENAR LA VARIABLE INDICE PARA NOMBRAR LOS MARCADORES
          eval("var marcador"+indice+" = new H.map.Marker(item.position)")
          ,*/
          var m=0;
          $$("#resultados").append('<li><a class="list-button item-link tituloItem" id="'+item.title+'" href="#">'+item.title +'</a></li>');
          $$(".tituloItem").on('click',function(){
              if (m==0){
                  m=1;
                  definirResultado(this.id);
                  app.popover.close(".popoverResultados",true);
              };
          });  
            
          /*resultado=JSON.stringify(item)
          console.log("item: "+resultado);
          console.log(item.address.street+", " +item.address.houseNumber+", " 
            +item.address.city+", " +item.address.state+", " +item.address.countryName);
          */

          //CUANDO AGREGO LA FUNCION ADDMARKERTOGROUP DEJA DE FUNCIONAR BIEN LA FUNCION, ME MUESTRA UN SOLO RESULTADO
          //addMarkerToGroup(group, {lat: item.position.lat , lng: item.position.lng});
        });
        
       
        
      }, alert, );

      
    };
    function chequeando (numero){
      console.log(numero);
    }
    
    

    function definirResultado(a){
       service = platform.getSearchService();
       query=a;
      
        // Call the geocode method with the geocoding parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        console.log("entró a la funcion de definicion de resultado");
      if (n==1){
          container2.removeAll();
          
          console.log("tendria que borrar"+n);
          n=0;
        }

        if (d==1){
              dynamicSheet.close();
            };
            if(u==1){
             container3.removeAll();
            };
            if (f==1){
               container4.removeAll();
            };
       // map.removeObjets(map.getObjets ());
      service.geocode({
        q: query
      }, (result) => {
        console.log("tomó el query");
        
        
        // Add a marker for each location found
        result.items.forEach((item) => {
          
            
            if (n==0){ 
              n=1;

              
              console.log("lat: "+item.position.lat);
              console.log("lng: "+item.position.lng);
              console.log(item.address.street+", " +item.address.houseNumber+", "+item.address.city+", " +item.address.state+", " +item.address.countryName);
              
              latBusqueda = item.position.lat;
              lngBusqueda = item.position.lng;
              coordsBusqueda = {lat: latBusqueda, lng: lngBusqueda};
              map.setCenter(coordsBusqueda);
              lat2=item.position.lat;
              lon2=item.position.lng;
              coordenadas=item.position.lat+","+item.position.lng;
              label=item.title;
              console.log(label);
              console.log(coordenadas);
              crearDynamicSheet();
              getDistanciaMetros(latUsuario, lonUsuario, lat2, lon2);
              //locationId
              /*resultado=JSON.stringify(item)
              console.log("item: "+resultado);
              console.log(item.address.street+", " +item.address.houseNumber+", " 
                +item.address.city+", " +item.address.state+", " +item.address.countryName);
              */
              eval("marcador = new H.map.Marker(new H.geo.Point("+item.position.lat+", "+item.position.lng+"))");
              container2 = new H.map.Group({
                    objects: [marcador]
                  });
                map.addObject(container2);
            };
          
        });
      }, alert);
    }
    function ubicame(){
      console.log("te llevo a donde vos estes");
      //se ejecuta solo cuando hago click en el boton del index
      
            
    map.setCenter(coordsUsu); // centrar el mapa en una coordenada
          
    };
    function changeTime(){
      var distanciaparaalarma = $$('#demo-picker-describe').val();
      console.log(distanciaparaalarma);
      console.log("entro a la funcion de cambio del picker");
    };
    
    function geolocalizacion(){

        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        
      var onSuccess = function(position) {
          latUsuario = position.coords.latitude;
          lonUsuario = position.coords.longitude;
          console.log(latUsuario);
          console.log(lonUsuario);
          ubicacionUsuario = latUsuario+","+lonUsuario;

          // Initialize the platform object:
          platform = new H.service.Platform({
            'apikey': '-iBipIMj1if2vBaXas4CodolHaSqfw_NTWR2C4OAMiU'
          });

          // Obtain the default map types from the platform object
          var maptypes = platform.createDefaultLayers();
          
          // Instantiate (and display) a map object:
          map = new H.Map(
            document.getElementById('mapContainer1'),
            maptypes.vector.normal.map,
            //layers.raster.terrain.transit
            {
              zoom: 15,
              center: { lng: lonUsuario, lat: latUsuario }
            });

            /* LO PASE A LA FUNCION RECALCULAR UBICACION
            var svgMarkup = '<svg width="24" height="24" ' +
              'xmlns="http://www.w3.org/2000/svg">' +
              '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
              'height="22" /><text x="12" y="18" font-size="12pt" ' +
              'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
              'fill="white">O</text></svg>';
            var icon = new H.map.Icon(svgMarkup);
            if (latUsuario!=0 && lonUsuario!=0) {
              coordsUsu = {lat: latUsuario, lng: lonUsuario};
              markerUsu = new H.map.Marker(coordsUsu , { icon: icon });
              map.addObject(markerUsu);
              map.setCenter(coordsUsu); // centrar el mapa en una coordenada
            };
            */

          // Enable the event system on the map instance:
          var mapEvents = new H.mapevents.MapEvents(map);
          // Instantiate the default behavior, providing the mapEvents object:
          var behavior = new H.mapevents.Behavior(mapEvents);

          // Get an instance of the geocoding service:
          var service = platform.getSearchService();

          // Call the geocode method with the geocoding parameters,
          // the callback and an error callback function (called if a
          // communication error occurs):

         // Add event listeners:
          map.addEventListener('longpress', function(evt) {
              // Log 'tap' and 'mouse' events:
              console.log(evt.type, evt.currentPointer.type);
              console.log(n);
              coord = map.screenToGeo(evt.currentPointer.viewportX,
                      evt.currentPointer.viewportY);

              coordenadas=coord.lat+","+coord.lng;

              lat2=coord.lat;
              lon2=coord.lng;
              if (u==1){
                //map.removeObject(marker);
              };
              if (u==1){
                    container3.removeAll();
                  }; 
              if(l==1){
              map.removeObject(container);
              };
              if (n==1){
                  container2.removeAll();
                  
                  console.log("tendria que borrar"+n);
                };
            if (e==1){
              dynamicSheet2.close();
            };
            if (f==1){
                  container4.removeAll();
                };
            console.log("coord"+coord);
            console.log("coordenadas"+coordenadas);
          /*
          var bubble =  new H.ui.InfoBubble(coord, {
                  content: '<b>Coordenadas:</b>'+coord.lat+", "+ coord.lng 
                 });
          
          ui.addBubble(bubble); */
           //addMarker(coord);
            
          function reverseGeocode(platform) {
              var geocoder = platform.getGeocodingService(),
                parameters = {
                  prox: coordenadas+",57",
                  mode: 'retrieveAddresses',
                  maxresults: '1',
                  gen: '9'};

              geocoder.reverseGeocode(parameters,
                function (result) {
                  g=1;
                  console.log("aca estamos");
                  console.log(JSON.stringify(result.Response.View[0].Result[0].Location.LocationId));
                  locationId=JSON.stringify(result.Response.View[0].Result[0].Location.LocationId);
                  console.log("locationId"+locationId)
                  console.log(JSON.stringify(result.Response.View[0].Result[0].Location.Address.Label));
                  label= JSON.stringify(result.Response.View[0].Result[0].Location.Address.Label);
                  //console.log(JSON.stringify(result.Response.View[0].Result[0].Location.Address.Street));
                  if (g==1){
                    crearDynamicSheet();
                    agregarMarcadorAlCliquear();
                  };
                }, function (error) {
                  alert(error);
                }
              );
          };
            
            if (d==1){
            dynamicSheet.close();
            }


            
            reverseGeocode(platform)
            console.log(coordenadas);
            console.log(coord.lat+","+coord.lng);
      });


        
      
      function agregarMarcadorAlCliquear(){
            u=1;
            marker = new H.map.Marker(coord);
          
            //eval("marcador = new H.map.Marker(new H.geo.Point("+item.position.lat+", "+item.position.lng+"))");
            container3 = new H.map.Group({
                  objects: [marker]
                });
              map.addObject(container3);


          //map.addObject(marker);
          map.setCenter(coord);
      };  
     
      
      

        // Crea interfaz de usuario (zoom, capas y barra de escala)
      var ui = H.ui.UI.createDefault(map, maptypes, "es-ES");
      
      //  PARA SETEAR UBICACION DE COMANDOS
      var mapSettings = ui.getControl('mapsettings');
      var zoom = ui.getControl('zoom');
      var scalebar = ui.getControl('scalebar');
      mapSettings.setAlignment('top-right');
      zoom.setAlignment('top-right');
      scalebar.setAlignment('top-right');
      
            /*alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
            console.log('Latitude: '          + position.coords.latitude          + '\n' +
                      'Longitude: '         + position.coords.longitude         + '\n' +
                      'Altitude: '          + position.coords.altitude          + '\n' +
                      'Accuracy: '          + position.coords.accuracy          + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                      'Heading: '           + position.coords.heading           + '\n' +
                      'Speed: '             + position.coords.speed             + '\n' +
                      'Timestamp: '         + position.timestamp                + '\n');
                      */
        };
     
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
     
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        
    };
    function crearDynamicSheet(){
        d=1;
        console.log("entro a createDyamicSheet");
              dynamicSheet = app.sheet.create({
                El: ".hojamarcador",
                backdropEl: ".contenedormapa",
                swipeToClose: true,
                swipeToStep: true,
                 backdrop: true,
                 closeByOutsideClick:true,
                swipeHandler: ".swipe-handler",
                content:  '<div class="sheet-modal my-sheet-swipe-to-close" style="height:auto; --f7-sheet-bg-color: #fff; opacity:0.95">'+
                            '<div class="swipe-handler">'+  
                              '<div class="sheet-modal-inner">'+
                                
                                '<div class="sheet-modal-swipe-step">'+
                                  '<div class="block">'+
                                    '<h2>'+label+'</h2>'+
                                    '<div class="row">'+
                                      '<div id="'+coordenadas+'" class="col-50 crearRuta boton button button-round button-fill">Obtener ruta</div>'+
                                      '<div class="col-50 activarAlarma boton button button-round button-fill">Activar alarma</div>'+
                                    '</div>'+
                                     '<div class="row">'+
                                      '<div class="col-33"></div>'+
                                      '<div class="col-33 GuardarFavorito open-prompt boton button button-round button-fill style="height:10vh; width:10vh; border-radius:50">GUARDAR</div>'+
                                      '<div class="col-33"></div>'+
                                    '</div>'+
                                    '<p>Tus coordenadas son:</p>'+
                                    '<p>'+coordenadas+'</p>'+
                                    '<p><a href="#" class="link sheet-close">Close me</a></p>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>',
              });
              dynamicSheet.open();
              $$(".crearRuta").on('click',function(){
                  crearRuta(this.id);
                  dynamicSheet.close();
                  //map.removeObject(marker); 
                  if (u==1){
                    container3.removeAll();
                  }; 
                  if (n==1){
                    container2.removeAll();
                  }; 
              });
              $$(".activarAlarma").on('click',function(){
                  console.log("hiciste click en activar alarma");
                  activarAlarma();  
              });
              $$(".GuardarFavorito").on('click',function(){
                  console.log(locationId);
                  console.log(label);
                  console.log(coordenadas);
                  //fnGuardarFavorito();
                  $$('.open-prompt').on('click', function () {
                    app.dialog.prompt('Agregue un nombre para guardar este sitio', function (name) {
                        fnGuardarFavorito(name);
                        app.dialog.alert('Listo,' + name+ 'ha sido guardado');
                        //nombreFavorito = name;
                        //console.log(name);
                    });
                  });  
              });

      };
    function crearRuta(r){
      console.log(r);
      if (ruta==1){
        map.removeObjects([routeLine, startMarker, endMarker]);
        console.log("entro a cancelar ruta")
        $$(".cancelarRuta").remove();
        ruta=0;
      }
      // Create the parameters for the routing request:
      if (ruta==0){
        ruta=1;
        var routingParameters = {
          // The routing mode:
          'mode': 'fastest;car',
          // The start point of the route:
          'waypoint0': ubicacionUsuario,
          // The end point of the route:
          'waypoint1': r,
          // To retrieve the shape of the route we choose the route
          // representation mode 'display'
          'representation': 'display'
        };

        // Define a callback function to process the routing response:
        var onResult = function(result) {
          var route,
            routeShape,
            startPoint,
            endPoint,
            linestring;
          if(result.response.route) {
          // Pick the first route from the response:
          route = result.response.route[0];
          // Pick the route's shape:
          routeShape = route.shape;

          // Create a linestring to use as a point source for the route line
          linestring = new H.geo.LineString();

          // Push all the points in the shape into the linestring:
          routeShape.forEach(function(point) {
            var parts = point.split(',');
            linestring.pushLatLngAlt(parts[0], parts[1]);
          });

          // Retrieve the mapped positions of the requested waypoints:
          startPoint = route.waypoint[0].mappedPosition;
          endPoint = route.waypoint[1].mappedPosition;

          // Create a polyline to display the route:
          routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 }
          });

          // Create a marker for the start point:
          startMarker = new H.map.Marker({
            lat: startPoint.latitude,
            lng: startPoint.longitude
          });

          // Create a marker for the end point:
          endMarker = new H.map.Marker({
            lat: endPoint.latitude,
            lng: endPoint.longitude
          });

          // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine, startMarker, endMarker]);

          // Set the map's viewport to make the whole route visible:
          map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
          }
          getDistanciaMetros(latUsuario,lonUsuario,lat2,lon2);
         
        };

        // Get an instance of the routing service:
        var router = platform.getRoutingService();
        $$(".page").append('<div class="cancelarRuta fab fab-left-bottom color-red">'+
          '<a href="#">'+
            
            '<i class="icon  f7-icons if-not-md">xmark</i>'+
            
            '<i class="icon cancelarRuta material-icons md-only">close</i>'+
          '</a>'+

        '</div>');
        $$(".cancelarRuta").on('click', cancelarRuta);
        // Call calculateRoute() with the routing parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        router.calculateRoute(routingParameters, onResult,
          function(error) {
            alert(error.message);
          });
      };
    };
    function cancelarRuta(){
      map.removeObjects([routeLine, startMarker, endMarker]);
      console.log("entro a cancelar ruta")
      $$(".cancelarRuta").remove();
    };
    function getDistanciaMetros(lat1,lon1,lat2,lon2){

        console.log("entro a getDistanciaMetros")
        rad = function(x) {return x*Math.PI/180;}
        var R = 6378.137; //Radio de la tierra en km 
        var dLat = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * 
        Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        //aquí obtienes la distancia en metros por la conversion 1Km =1000m
        distancia = R * c * 1000; 
        //return distancia ;
        console.log(distancia); 
      };

    function recalculaPosicion(){
      
      /*
      function testObjectsEvents(map, logEvent) {
        
        markerUsu.addEventListener('pointerleave', logEvent);
        

      };
      function logEvent(evt) {
          console.log("click en el marcador");
        };
      testObjectsEvents(map, logEvent);
      */


        var onSuccess = function(position) {
          latUsuario = position.coords.latitude;
          lonUsuario = position.coords.longitude;
          //console.log(latUsuario);
          //console.log(lonUsuario);
          ubicacionUsuario = latUsuario+","+lonUsuario;
          };
     
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        };
     
        navigator.geolocation.getCurrentPosition(onSuccess, onError);



        var onMapWatchSuccess = function (position) {
            
            var latUsuarioActualizada = position.coords.latitude;
            var lonUsuarioActualizada = position.coords.longitude;
            
            if (latUsuarioActualizada != latUsuario && lonUsuarioActualizada != lonUsuario) {
         
                latUsuario = latUsuarioActualizada;
                lonUsuario = lonUsuarioActualizada;
                console.log("estamos actualizando tu ubicacion!");
                console.log("tu nueva ubicacion es:"+latUsuarioActualizada+" "+lonUsuarioActualizada);
            }
        }
         
        // Error callback
         
        function onMapError(error) {
            console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }
         
        // Watch your changing position
         
        function watchMapPosition() {
         
            return navigator.geolocation.watchPosition
            (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
        }

        watchMapPosition();











        var svgMarkup = '<svg width="42" height="42" ' +
              'xmlns="http://www.w3.org/2000/svg">' +
              '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
              'height="22" /><text x="12" y="18" font-size="12pt" ' +
              'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
              'fill="white">O</text></svg>';
        var icon = new H.map.Icon(svgMarkup);
        var marcadorUsuario = new H.map.Icon("https://image.flaticon.com/icons/svg/727/727618.svg", {size: {w: 25, h: 25}});
        if (m==0){
          if (latUsuario!=0 && lonUsuario!=0) {
            coordsUsu = {lat: latUsuario, lng: lonUsuario};
            markerUsu = new H.map.Marker(coordsUsu , { icon: marcadorUsuario });
            map.addObject(markerUsu);
            m=1;
             // centrar el mapa en una coordenada
            //console.log("estas en: "+coordsUsu)
          };
        }else {
          markerUsu.setGeometry( {lat: latUsuario, lng: lonUsuario} );
        };
        

        var toggle = app.toggle.create({
          el: '.toggle',
          on: {
            change: function () {
              console.log('Toggle changed');
              if (a==1){
                  map.removeObject(markerAlarma);
                  a=0;
                };


              if (toggle.checked) {
                
                if (u==1){
                    container3.removeAll();
                }; 
                if(l==1){
                  map.removeObject(container);
                };
                if (n==1){
                  container2.removeAll();
                };
                if (f==1){
                  container4.removeAll();
                };
                if(a==0){
                  a=1;
                  coordsAlarma = {lat: latAlarma1, lng: lonAlarma1};
                  markerAlarma = new H.map.Marker(coordsAlarma , { icon: marcadorAlarma });
                  map.addObject(markerAlarma);
                };
                console.log("toggle checked"+distanciaAlarma);
                alarma=1;
                
                app.dialog.alert('Te avisaremos cuando estes a '+distanciaAlarmaParaMostrar+" "+ "<font style='text-transform: lowercase;''>"+metrosOkilometrosParaMostrar+"</font>" ,"¡Listo!")
                if (metrosOkilometros=="Kilometros"){
                  distanciaAlarma=distanciaAlarma*1000;
                  
                }
              }else{
                alarma=0;
                $$(".cancelarAlarma").remove();
                app.dialog.alert('Tu alarma de desactivó',"¡Listo!" );
              };
            }
          }
        })

        
        

        //activo alarma
        //VAR alarma variable bandera para activar/desactivar alarma
        //VAR geocerca contiene la distancia en metros de la alarma
        if (alarma==1){
                
                getDistanciaMetros(latUsuario,lonUsuario,latAlarma1,lonAlarma1);
                if (distancia>1000){
                  distanciaParaMostrar=parseInt(distancia)/1000;
                  unidad="Km";
                }else {
                  distanciaParaMostrar=parseInt(distancia);
                  unidad="Mts";
                }
          //MIDO DISTANCIA A DESTINO. lat2 y lon2 son las coordenadas marcadas como destino de ruta
          getDistanciaMetros(latUsuario,lonUsuario,latAlarma1,lonAlarma1);
          if(fab==0){
                  console.log(fab);
                  fab=1;
                  $$(".page").append(
                    '<div class="contenedorFab">'+
                      '<div class="fab fab-right-bottom color-yellow">'+
                        '<a href="#">'+
                          '<!-- Icons For iOS Theme -->'+
                          '<i class="f7-icons size-22">bell</i>'+
                          '<i class="icon f7-icons if-not-md">xmark</i>'+
                          '<!-- Icons For MD Theme -->'+
                          
                          '<i class="icon material-icons md-only">close</i>'+
                        '</a>'+
                        '<!-- FAB speed dial actions -->'+
                      
                        '<div class="fab-buttons fab-buttons-top">'+
                          '<a href="#" class="fab-label-button cancelarAlarma">'+
                            '<span>X</span>'+
                            '<span class="fab-label ">Desactivar</span>'+
                          '</a>'+
                          '<a href="#" class="fab-label-button botonfab">'+
                            '<span><i class="f7-icons size-22">info</i></span>'+
                            '<span class="fab-label labelAlarma">Distancia de alarma: '+distanciaAlarmaParaMostrar+' '+metrosOkilometrosParaMostrar+'</span>'+
                          '</a>'+
                          '<a href="#" class="fab-label-button">'+
                            '<span><i class="f7-icons size-22">flag</i></span>'+
                            '<span class="fab-label labelDestino">Distancia a destino: '+distanciaParaMostrar+' '+unidad+' </span>'+
                          '</a>'+
                        '</div>'+
                      
                      '</div>'+
                    '</div>'
                  );
                }
                if(fab==1){
                  console.log(fab)
                  
                  $$(".labelAlarma").html('Distancia de alarma: '+distanciaAlarmaParaMostrar+' '+metrosOkilometrosParaMostrar);

                  $$(".labelDestino").html('Distancia a destino: '+distanciaParaMostrar+' '+unidad);

                  
                };

          
          $$(".cancelarAlarma").on('click', function(){
            if (a==1){
                  map.removeObject(markerAlarma);
                  a=0;
                };
            alarma=0;
            var desactivar=1;
            if(desactivar==1){
              desactivar=0;
              $$(".contenedorFab").remove();
              fab=0;
              //app.dialog.alert('Tu alarma de desactivó',"¡Listo!" );
            }
          });
          if(distancia <= distanciaAlarma){
            var pasado = distanciaAlarma - distancia;
            app.dialog.alert('Ya estas a '+distanciaParaMostrar+' '+unidad+' de tu destino',"¡Atento!" );
            console.log("ya llegas. tu alarma se activo hace:"+pasado+" metros");
            console.log("estas a "+distancia+" metros de tu destino")
            //NOTIFICACION
          }else{
            var faltaTanto = distancia - distanciaAlarma;
            console.log("falta "+faltaTanto+" metros para que se active la alarma");
            console.log("estas a "+distancia+" metros de tu destino");
          }
        }

    };
      function activarAlarma(){
        console.log("entro a la funcion de activar alarma");
        sheetAlarmas = app.sheet.create({
                El: ".hojaalarmas",
                swipeToClose: true,
                //swipeToStep: true,
                backdrop: true,
                push:true,
                closeByOutsideClick: false,
                swipeHandler: ".swipe-handler",
                content:  
                       '<div class="sheet-modal my-sheet-swipe-to-close" style="height:80vh; --f7-sheet-bg-color: #fff; opacity:1">'+
                            '<div class="swipe-handler">'+  
                              '<div class="sheet-modal-inner">'+
                                '<div class="sheet-modal-swipe-step">'+ 
                                '<div class="block">'+
                                '<h2>Activa tus alarmas</h2>'+
                                '<div class="block-footer class="no-margin-bottom"">'+
                                  '<p class="no-margin-bottom">Selecciona a qué distancia de tu destino querés recibir tus avisos y activalas deslizando el interruptor</p>'+
                                '</div>'+
                                  '<div class="no-margin-top no-padding-top list simple-list ">'+
                                        '<p class="text-align-center margin-bottom-half no-padding">ALARMA 1</p>'+
                                        '<ul>'+
                                          '<li>'+
                                            '<div class="item-content">'+
                                              '<div class="item-media"><i class="icon icon-f7"></i></div>'+
                                              '<div class="item-inner">'+
                                                '<input type="text"  placeholder="Elija la distancia" readonly="readonly" id="demo-picker-describe"/>'+
                                                '<div class="item-after">'+
                                                  '<label class="toggleAlarma1 toggle toggle-init disabled">'+
                                                    '<input type="checkbox"/>'+
                                                    '<span class="toggle-icon"></span>'+
                                                  '</label>'+
                                                '</div>'+
                                              '</div>'+
                                            '</div>'+
                                            
                                          '</li>'+
                                          
                                        '</ul>'+
                                        '<div >'+
                                              '<p class="block-footer">Antes de activar la alarma verificá nuevamente la distancia seleccionada</p>'+
                                            '</div>'+
                                      '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>',


              });
              sheetAlarmas.open();
              
              var pickerDescribe = app.picker.create({
                  toolbar: true,
                  push:true,
                  backdrop:true,
                  toolbarCloseText: 'Desliza hacia abajo para cerrar',
                  sheetSwipeToClose:true,
                  inputEl: '#demo-picker-describe',
                  rotateEffect: false,
                  closeByOutsideClick: true,
                  //value: [distanciaAlarma, metrosOkilometros],
                  /*onClose: function(pickerDescribe){console.log("picker cerrado") },
                  onChange: function (pickerDescribe,values,displayValues) {
                     distanciaAlarma= values[0];
                      metrosOkilometros = values[1];
                      console.log(distanciaAlarma);
                      console.log(metrosOkilometros);
                     
                  },*/
                  cols: [
                    {
                      textAlign: 'left',
                      values: ('5 10 15 20 30 40 50 60 100 200 300 400 500').split(' ')
                    },
                    {
                      values: ('Metros Kilometros').split(' ')
                    },
                  ],
                  on: {
                    change: function (picker, values){
                      distanciaAlarma = picker.value[0];
                      metrosOkilometros= picker.value[1];
                      distanciaAlarmaParaMostrar= picker.value[0];
                      metrosOkilometrosParaMostrar= picker.value[1];
                      console.log(distanciaAlarma);
                      console.log(metrosOkilometros);
                        var latTranscision=lat2;
                        var lonTranscision=lon2;
                        latAlarma1=latTranscision;
                        lonAlarma1=lonTranscision;
                      if (picker.value[0]!=""){
                        if ($$(".toggleAlarma1").hasClass('disabled')){
                          $$(".toggleAlarma1").removeClass('disabled');
                        };
                      } else {
                        $$(".toggleAlarma1").addClass('disabled');
                      }

                        
                    }
                  }

              });
      
      };
      
      //la funcion recalculaPosicion es la que tomará la posicion actual del GPS y hará el cálculo
      function crearSheetAlarmas(){
        sheetAlarmas = app.sheet.create({
                El: ".hojaalarmas",
                swipeToClose: true,
                swipeToStep: true,
                backdrop: true,
                swipeHandler: ".swipe-handler",
                content:  '<div class="sheet-modal my-sheet-swipe-to-close" style="height:auto; --f7-sheet-bg-color: #fff; opacity:1">'+
                            '<div class="swipe-handler">'+  
                              '<div class="sheet-modal-inner">'+
                                '<div class="sheet-modal-swipe-step">'+
                                  '<div class="block">'+
                                    '<h2>'+ALARMAS+'</h2>'+
                                    '<div class="row">'+
                                      '<div id="'+coordenadas+'" class="col-50 crearRuta boton button button-round button-fill">Obtener ruta</div>'+
                                      '<div class="col-50 activarAlarma boton button button-round button-fill">Activar alarma</div>'+
                                    '</div>'+
                                    '<p>Tus coordenadas son:</p>'+
                                    '<p>'+coordenadas+'</p>'+
                                    '<p><a href="#" class="link sheet-close">Close me</a></p>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>',
              });
              sheetAlarmas.open();
      }
     
     function crearPickerAlarmas(){
      var pickerDevice = app.picker.create({
          inputEl: '#demo-picker-device',
          cols: [
            {
              textAlign: 'center',
              values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
          ]
        });
      }

      function crearPopoverResultados(){


        var dynamicPopover = app.popover.create({
          El: '.popoverResultados',
          targetEl: '#busqueda',

          content: '<div class="popover popoverResultados">'+
                      '<div class="popover-inner">'+
                        '<div class="list">'+
                          '<ul id="resultados">'+
                            '<li><a class="list-button item-link " id="cerrarPopover" href="#">Elegir en el mapa</a></li>'+
                          '</ul>'+
                        '</div>'+
                      '</div>'+
                    '</div>',


          // Events
          on: {
            open: function (popover) {
              console.log('Popover open');
            },
            opened: function (popover) {
              console.log('Popover opened');
            },
          }
        });
        
        dynamicPopover.open();
        $$("#cerrarPopover").on("click", function(){
          l=1;
          app.popover.close(".popoverResultados",true);
          console.log(indice+"indice");
          
          
          if(indice==1){
              container = new H.map.Group({
                  objects: [marcador1]
                });
              map.addObject(container);
              map.getViewModel().setLookAtData({
                bounds: container.getBoundingBox()
              });
              map.removeObject(marker);
          }else{
            if(indice==2){
              container = new H.map.Group({
                  objects: [marcador1]
                });
              map.addObject(container);
              map.getViewModel().setLookAtData({
                bounds: container.getBoundingBox()
              });
              map.removeObject(marker);
            }else{
              if(indice==3){
                container = new H.map.Group({
                    objects: [marcador1, marcador2]
                  });
                map.addObject(container);
                map.getViewModel().setLookAtData({
                  bounds: container.getBoundingBox()
                });
              map.removeObject(marker);
              }else{
                if(indice==4){
                  container = new H.map.Group({
                      objects: [marcador1, marcador2, marcador3]
                    });
                  map.addObject(container);
                  map.getViewModel().setLookAtData({
                    bounds: container.getBoundingBox()
                  });
              map.removeObject(marker);
                }else{
                  if(indice==5){
                    container = new H.map.Group({
                        objects: [marcador1, marcador2, marcador3, marcador4]
                      });
                    map.addObject(container);
                    map.getViewModel().setLookAtData({
                      bounds: container.getBoundingBox()
                    });
              map.removeObject(marker);
                  }else{
                    if(indice==6){
                      container = new H.map.Group({
                          objects: [marcador1, marcador2, marcador3, marcador4, marcador5]
                        });
                      map.addObject(container);
                      map.getViewModel().setLookAtData({
                        bounds: container.getBoundingBox()
                      });
              map.removeObject(marker);
                    }else{
                      if(indice==7){
                        container = new H.map.Group({
                            objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6]
                          });
                        map.addObject(container);
                        map.getViewModel().setLookAtData({
                          bounds: container.getBoundingBox()
                        });
              map.removeObject(marker);
                      }else{
                        if(indice==8){
                          container = new H.map.Group({
                              objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7]
                            });
                          map.addObject(container);
                          map.getViewModel().setLookAtData({
                            bounds: container.getBoundingBox()
                          });;
              map.removeObject(marker);
                        }else{
                          if(indice==9){
                            container = new H.map.Group({
                                objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8]
                              });
                            map.addObject(container);
                            map.getViewModel().setLookAtData({
                              bounds: container.getBoundingBox()
                            });;
              map.removeObject(marker);
                          }else{
                            if(indice==10){
                              container = new H.map.Group({
                                  objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9]
                                });
                              map.addObject(container);
                              map.getViewModel().setLookAtData({
                                bounds: container.getBoundingBox()
                              });;
              map.removeObject(marker);
                            }else{
                              if(indice==11){
                                container = new H.map.Group({
                                    objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10]
                                  });
                                map.addObject(container);
                                map.getViewModel().setLookAtData({
                                  bounds: container.getBoundingBox()
                                });
                              }else{
                                if(indice==12){
                                  container = new H.map.Group({
                                      objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11]
                                    });
                                  map.addObject(container);
                                  map.getViewModel().setLookAtData({
                                    bounds: container.getBoundingBox()
                                  });
                                }else{
                                  if(indice==13){
                                    container = new H.map.Group({
                                        objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12]
                                      });
                                    map.addObject(container);
                                    map.getViewModel().setLookAtData({
                                      bounds: container.getBoundingBox()
                                    });
                                  }else{
                                    if(indice==14){
                                      container = new H.map.Group({
                                          objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13]
                                        });
                                      map.addObject(container);
                                      map.getViewModel().setLookAtData({
                                        bounds: container.getBoundingBox()
                                      });
                                    }else{
                                      if(indice==15){
                                        container = new H.map.Group({
                                            objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14]
                                          });
                                        map.addObject(container);
                                        map.getViewModel().setLookAtData({
                                          bounds: container.getBoundingBox()
                                        });
                                      }else{
                                        if(indice==16){
                                          container = new H.map.Group({
                                              objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15]
                                            });
                                          map.addObject(container);
                                          map.getViewModel().setLookAtData({
                                            bounds: container.getBoundingBox()
                                          });
                                        }else{
                                          if(indice==17){
                                            container = new H.map.Group({
                                                objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15, marcador16]
                                              });
                                            map.addObject(container);
                                            map.getViewModel().setLookAtData({
                                              bounds: container.getBoundingBox()
                                            });
                                          }else{
                                            if(indice==18){
                                              container = new H.map.Group({
                                                  objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15, marcador16, marcador17]
                                                });
                                              map.addObject(container);
                                              map.getViewModel().setLookAtData({
                                                bounds: container.getBoundingBox()
                                              });
                                            }else{
                                              if(indice==19){
                                                container = new H.map.Group({
                                                    objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15, marcador16, marcador17, marcador18]
                                                  });
                                                map.addObject(container);
                                                map.getViewModel().setLookAtData({
                                                  bounds: container.getBoundingBox()
                                                });
                                              }else{
                                                if(indice==20){
                                                  container = new H.map.Group({
                                                      objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15, marcador16, marcador17, marcador18, marcador19]
                                                    });
                                                  map.addObject(container);
                                                  map.getViewModel().setLookAtData({
                                                    bounds: container.getBoundingBox()
                                                  });
                                                }else{
                                                  if(indice==21){
                                                    container = new H.map.Group({
                                                        objects: [marcador1, marcador2, marcador3, marcador4, marcador5, marcador6, marcador7, marcador8, marcador9, marcador10, marcador11, marcador12, marcador13, marcador14, marcador15, marcador16, marcador17, marcador18, marcador19, marcador20]
                                                      });
                                                    map.addObject(container);
                                                    map.getViewModel().setLookAtData({
                                                      bounds: container.getBoundingBox()
                                                    });
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          
        })
      };






    function consultarLocalStorage(){
        
//return 0;

        var usuarioGuardado = storage.getItem("usuario");
        usuarioGuardado = JSON.parse(usuarioGuardado);

        // convertimos el string en JSON
        if (usuarioGuardado.email == ""){
          console.log("no hay datos en el local");
        } else {
        
        console.log("consultarlocal, usuarioguardado.email: " + usuarioGuardado.email);
        console.log("consultarlocal, usuarioguardado.clave: " + usuarioGuardado.clave);
        usuarioLocal = usuarioGuardado.email;
        claveLocal = usuarioGuardado.clave;
        console.log("consultarlocal, usuariolocal + clavelocal: " + usuarioLocal + claveLocal)
        

        if ( usuarioGuardado != null){
          LoguearseConLocal(usuarioLocal, claveLocal);
        };
      };

    };

    function LoguearseConLocal(u,c ){
             console.log("loguearseconlocal, u+c"+u+c)
             correo=u;
        //Se declara la variable huboError (bandera)
        var huboError = 0;     
        firebase.auth().signInWithEmailAndPassword(u, c)
            .catch(function(error){
                //Si hubo algun error, ponemos un valor referenciable en la variable huboError
                huboError = 1;
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
                console.log(errorCode);

                
            })
            .then(function(){   
                //En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
                if(huboError == 0){
                  $$("#user").text(u);
                  console.log("te logueaste");
                  
                  $$("#nombreUsuario").text(u);
                    $$("#user").attr("data-panel",".panel-user");


                }
            }); 
      
    };




/*
function fnTocaBoton() {
    var mensaje = "";

    idDelBoton = this.id;
    mensaje = "Mi ID es: " + idDelBoton + "<br/>";

    // voy a "separar" el valor del id, usando los guiones bajos
    // el split separa un valor (en este caso una variable),
    // usando el caracter o caracteres indicandos como parámetro
    // el resultado es un array!
    var partes = idDelBoton.split("_");

    // sabiendo la forma: btn_g1_1 puedo tener:
    p0 = partes[0];
    p1 = partes[1];
    p2 = partes[2];

    mensaje += "Soy del Grupo: " + p1 + "<br/>";
    mensaje += "Y tengo el nro: " + p2 + "<br/>";


    $$('#msgBtn').html(mensaje);
}
*/


