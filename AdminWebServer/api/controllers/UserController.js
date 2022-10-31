/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res,next){
        Users.find(function foundUsers(err, users){
            if (err) return (err);
            // res.json(200, users);
            res.view({
                users: users
            });
        });
    },

    editUser: function(req,res,next){
        const {username, firstname, lastname, email, address, mobile,
           type, birthday
        } = req.body;
        const user_id = req.param('user_id');
        Users.update({id:user_id}, {username:username, firstname:firstname,
            lastname:lastname, email:email, address:address, mobile:mobile,
            type:type, birthday:birthday
        }).exec(function(err, updated){
            if (err) return;
            res.send(200);
        });
    },

    login: function(req,res,next){
        const {username, password} = req.body;
        if (username == null || username == undefined || password == null || password == undefined) return res.badRequest('Param Missing'); 

        Users.findOne({username:username}).exec((err,user)=> {
            if (err || !user) return res.json({result:false, message:'User not exist'});
            if (user.type != 'admin') return res.json({result:false, message: 'User is not admin'});
            if (password !== user.password) return res.json({result:false, message:'Password not match'});
            req.session.userId = user.id;
            req.session.username = user.username;
            //res.ok("Login success");
            // res.redirect('/order');
            res.json({result:true})
        });
    },

    logout: function(req,res,next){
        const {userId, username} = req.session;
        // if (userId == undefined || userId == null || username == undefined || username == null) return res.badRequest("No Login");
        req.session.destroy();
        res.redirect('/login');
        //res.ok("Logout Success");
    }
};

