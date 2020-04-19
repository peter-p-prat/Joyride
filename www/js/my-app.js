  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
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

//variables para gps

var latUsuario, lonUsuario;
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");



    geolocalizacion();

    consultarLocalStorage();
    

    db = firebase.firestore();
    refUsuarios = db.collection("USUARIOS");
    refTiposUsuarios= db.collection("TIPOS_USUARIOS");

    var iniciarDatos = 0;
    if ( iniciarDatos == 1 ) {
        fnIniciarDatos();
    }



    var panel = app.panel.create({
          el: '.panel-registro',
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

});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);

    
     


}); // AGREGADO

$$(document).on('page:init', '.page[data-name="mapa"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    
    // Initialize the platform object:
      var platform = new H.service.Platform({
        'apikey': 'Xl9vUwLE6MN47LOIbl3Fl5yVRvWjB3-_z-F0gJWecmA'
      });

      // Obtain the default map types from the platform object
      var maptypes = platform.createDefaultLayers();
      //var layers =  platform.createDefaultLayers();
      // Instantiate (and display) a map object:
      var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        //layers.raster.terrain.transit
        {
          zoom: 15,
          center: { lng: lonUsuario, lat: latUsuario }
        });

      if (latUsuario!=0 && lonUsuario!=0) {
        coordsUsu = {lat: latUsuario, lng: lonUsuario},
        markerUsu = new H.map.Marker(coordsUsu);
        map.addObject(markerUsu);
    }

      // Enable the event system on the map instance:
      var mapEvents = new H.mapevents.MapEvents(map);
      // Instantiate the default behavior, providing the mapEvents object:
      var behavior = new H.mapevents.Behavior(mapEvents);

      // Get an instance of the geocoding service:
      var service = platform.getSearchService();

      // Call the geocode method with the geocoding parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
      service.geocode({
        q: '200 S Mathilda Ave, Sunnyvale, CA'
      }, (result) => {
        // Add a marker for each location found
        result.items.forEach((item) => {
          map.addObject(new H.map.Marker(item.position));
        });
      }, alert);

        // Crea interfaz de usuario (zoom, capas y barra de escala)
      var ui = H.ui.UI.createDefault(map, maptypes, "es-ES");
      
      /*  PARA SETEAR UBICACION DE COMANDOS
      var mapSettings = ui.getControl('mapsettings');
      var zoom = ui.getControl('zoom');
      var scalebar = ui.getControl('scalebar');

      mapSettings.setAlignment('bottom-right');
      zoom.setAlignment('bottom-right');
      scalebar.setAlignment('bottom-right');
      */
    
     


}); // AGREGADO

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
   // geolocalizacion();
   
    
    





    
})


/** FUNCIONES PROPIAS **/


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

    function geolocalizacion(){

        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        
        var onSuccess = function(position) {
          latUsuario = position.coords.latitude;
          lonUsuario = position.coords.longitude;
          console.log(latUsuario + lonUsuario);
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

    

    function consultarLocalStorage(){
        
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


