/**
 * OrdersController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res,next){
        Orders.find(function foundOrders(err, orders){
            if (err) return (err);
            // res.json(200, orders);
            res.view({
                orders: orders
            })
        });
    },

    editOrder: function(req,res,next){
        const {
            departure,destination,startDateTime,contactPerson,contactContactNo,
            isFiveSeat,isShare, shareSeat,price,paymentMethod, status,user,
        } = req.body;
        const order_id = req.param('order_id');
        Orders.update({id:order_id}, {
            departure:departure,destination:destination,startDateTime:startDateTime,
            contactPerson:contactPerson,contactContactNo:contactContactNo,
            isFiveSeat:isFiveSeat, isShare:isShare, shareSeat:shareSeat,
            price:price, paymentMethod:paymentMethod, status:status,
            user:user,
        }).exec(function(err, updated){
            if (err) return;
            res.send(200);
        });
    },

    paypal: function(req,res,next){
        const order_id = req.params['order_id'];
        const token = req.params['token'];
        res.view('order/paypal', {order_id: order_id, token: token});
    },

    paypalCompleted: function(req,res,next){
        const {order_id, token} = req.body;
        Orders.findOne({id: order_id}).exec((err, order)=>{
            if (err) return res.json({result:false, message:'FAIL: FOUND USER ERROR '}); 
            if (!order) return res.json({result:false, message:'FAIL: CANNOT FOUND USER '}); 

            if (order.user == token){

                // console.log("token == order.user" + order_id);
                // console.log(token);
                Orders.update({id:order_id}, {paymentMethod:'PAYPAL', paymentStatus:'PAID'}).exec(function(err, updated){
                    if (err) return res.json({result:false, message:'FAIL: CANNOT UPDATE PAYPAL PAYMENT'});
                    return res.json({result:true});
                });
            } else {
                ObjectID = require('mongodb').ObjectID
                // console.log("token != order.user" + order_id);
                // console.log(token);
                // Join_users.find({"order": ObjectId(order_id)}).exec((err,items)=>{
                //     console.log(err);
                // });
                Join_users.update({order: new ObjectID(order_id), user: new ObjectID(token), status: "JOIN", isPrevious: false}, {paymentMethod:'PAYPAL', paymentStatus:'PAID'}).exec(function(err, updated){
                    if (err) return res.json({result:false, message:'FAIL: CANNOT UPDATE PAYPAL PAYMENT'});
                    return res.json({result:true});
                });
            }
        });
    },
};

