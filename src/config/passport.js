//creamos estrategia de registro, local o facebook
const localStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = function(passport){
        passport.serializeUser(function(user,done){
            done(null, user.id);
        });

        passport.deserializeUser(function(id,done){
            User.findById(id,function(err,user){
                done(err,user);
            });
        });

        //registro----------------------------------------------------------------------------------------------
        passport.use('local-signup',new localStrategy({
            usernameField:'email',
            passwordField:'password',
            passReqToCallback:true
        },
        function(req,email,password,done){

                User.findOne({'local.email':email},function(err,user){
                        //si hay un error retornamos el error
                        if(err){
                            return done(err);
                        }
                        //si el usuario ya existe
                        if(user){
                            return done(null,false,req.flash('SignupMessage','El email ya esta registrado'));
                        }
                        else{
                            //sino procedemos a crear nuestros datos
                            var newUser = new User();
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function(err){
                                //si hay error
                                if(err){
                                    throw err;
                                }
                                //si no hay error retornamos el usuario guardado
                                return done(null,newUser);
                            });
                        }

                })
        }));

        //Login ---------------------------------------------------------------------------------------------
        passport.use('local-login', new localStrategy({
            usernameField:'email',
            passwordField:'password',
            passReqToCallback:true
        },
        function(req,email,password,done){

                User.findOne({'local.email': email},function(err,user){
                        //si hay un error retornamos el error
                        if(err){
                            return done(err);
                        }
                        //si el usuario no existe
                        if(!user){
                            return done(null,false, req.flash('LoginMessage','El usuario no esta registrado'));
                        }
                        if(!user.validPassword(password)){
                            //sino procedemos a crear nuestros datos
                            return done(null, false, req.flash('LoginMessage','Los datos no coinciden'));
                                //si no hay error retornamos el usuario guardado                           
                        }
                        return done(null,user);

                })
        }));
}