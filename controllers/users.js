const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};

module.exports.Register = async(req,res, next)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser,err=>{
        if(err){
           return next(err); 
        }
        else{
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        }
    } )
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.login = (req,res)=>{
    const {username} = req.body;
    req.flash('success', `Welcome back ${username}!`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out!');
        res.redirect('/campgrounds');
    });
}