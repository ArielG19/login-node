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
    app.post('/login',(req,res)=>{
        
    });
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

    app.get('/dashboard',(req,res)=>{
        res.render('dashboard',{
            //obtenemos un obejto de passport con los datos de usuario
            user:req.user
        });
    });
};