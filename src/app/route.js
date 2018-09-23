//usamos express y passport    -------------------------------------------------------------------
module.exports = (app,passport) =>{
    //definimos nuestras rutas -------------------------------------------------------------------
    //ruta raiz
    app.get('/',(req,res)=>{
        res.render('index');
    });
    //rutas de login y register -------------------------------------------------------------------
    app.get('/login',(req,res)=>{
        res.render('login',{
            message: req.flash('LoginMessage')
        });
    });
   
    //utilizamos passport para registro y autenticacion
    app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	}));

    //-----------------------------------------------------------------------------------------------
    app.get('/signup',(req,res)=>{
        res.render('signup',{
            message: req.flash('SignupMessage')
        });
    });

    //utilizamos passport para registro y autenticacion
    app.post('/signup', passport.authenticate('local-signup',{
        //registro exitoso
        successRedirect:'/dashboard',
        failureRedirect:'/signup',
        failureFlash:true
    }));

    //pasamos el metodo isloggedIn para que compruebe si esta autentificado
    app.get('/dashboard',isLoggedIn,(req,res)=>{
        res.render('dashboard',{
            //obtenemos un obejto de passport con los datos de usuario
            user: req.user
        });
    });
    //ruta para terminar sesion
    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/');
    });

    //funcion para saber si esta logueado
    function isLoggedIn(req,res,next){
        //si esta autenticado q continue con la ruta
        if(req.isAuthenticated()){
            return next()
        }
        //sino retorne al home
        return res.redirect('/')
    }
};