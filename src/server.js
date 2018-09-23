const express = require('express');
const app = express();
//requerimos a path para poder usar las rutas de las carpetas
const path = require('path');

const passport = require('passport');
//requerimos a flash para manejar notificaciones de errores
const flash = require('connect-flash');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

//requerimos para la conexion a la bd----------------------------------------------------------------------
const mongoose = require('mongoose');
// requerimos especificamente la url de la bd de la siguiente manera
//vamos a la carpeta donde esta el archivo.
const { url } = require('./config/database.js');
//-----------------creamos nuestra conexion a la bd----------------------------------------------------------
mongoose.connect(url,{
	useNewUrlParser: true
}).then(() => console.log('mongoose connect')).catch(err => console.log("Not Connected to Database ERROR! ", err));

//configuraciones - establecer puerto------------------------------------------------------------------------ 
app.set('port',process.env.PORT || 2801);
//aqui usamos el puerto----------------------------------------------------------------------------------------
app.listen(app.get('port'), ()=>{
    console.log('Servidor en el puerto', app.get('port'));
});
//configuramos o requerimos passport para utilizarlo---------------------------------------------------------
require('./config/passport')(passport);

//Configuramos o decimos donde estaran nuestras vistas----------------------------------------------------------
app.set('views', path.join(__dirname,'views'));
//configuramos el motor de plantilla y le decimos cual usamos---------------------------------------------------
app.set('view engine', 'ejs');


//midleware-----------------------------------------------------------------------------------------------------
//morgan sirve para ver los error por consola como 404,400,etc.
app.use(morgan('dev'));
app.use(cookie());
//el extended: true para procesar imagenes
app.use(bodyParser.urlencoded({extended:true}));

//manejamos las sesiones de express
app.use(session({
    secret:'login',
    resave:false,//para que no se guarden todo el tiempo
    saveUninitialized:false
}));

//usamos passport--------------------------------------------------------------------------------------------------
//unimos passport con las sessiones, ya que estas sesiones se guardan en el navegador
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas-----------------------------------------------------------------------------------------------------------
//requerimos las rutas y les pasamos el parametro app para usar todas las app configuras y passport para sesiones
require('./app/route')(app,passport);

//configuramos donde estaran nuestros archivos css, imagenes-----------------------------------------------------
app.use(express.static(path.join(__dirname,'public')));