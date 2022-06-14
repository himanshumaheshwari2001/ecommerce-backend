const Order = require("../models/ordermodel")
const Product = require("../models/productmodel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncError");

//create new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{

    const{
shippingInfo,

paymentInfo,
itemPrice,
taxPrice,
shippingPrice,
totalPrice,
orderItems

    } = req.body;
const order = await Order.create({
    shippingInfo,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt : Date.now(),
    user:req.user._id,
orderItems
})

res.status(200).json({

    success:true,
     order
})


})

//get single order 

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
const order = await  Order.findById(req.params.id).populate("user","name email")
if(!order){

    return next(new ErrorHandler("order not found with this id",404))
}

res.status(200).json({

    success:true,
    order
})


})


//get logged in user order

exports.myOrder = catchAsyncErrors(async(req,res,next)=>{

    const orders = await  Order.find({user:req.user._id})
  
    res.status(200).json({
    
        success:true,
        orders
    })
    
    
    })

    //get all order admin

exports.getAllOrder = catchAsyncErrors(async(req,res,next)=>{
   
        const orders = await  Order.find()
      
let totalAmount = 0;
orders.forEach((order)=>{

    totalAmount += order.totalPrice
})

        res.status(200).json({
        
            success:true,
            totalAmount,
            orders
        })
        
        
        })

//update  order  status admin

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
  
    const order = await  Order.findById(req.params.id);

    if(!order){

        return next(new ErrorHandler("order not found with this id",404))
    }


if(order.orderStatus === "Delivered"){

    return next(new ErrorHandler("you have already delivered this order",404))
}

order.orderItems.forEach(async(order)=>
    {
        await updateStock(order.product,order.quantity)
    })

order.orderStatus = req.body.status;

if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now()
}

await order.save(({validateBeforeSave:false}))
    res.status(200).json({
    
        success:true,
        
    })
    
    
    })

async  function updateStock(id,quantity){

const product = await Product.findById(id);
product.stock -= quantity 
await product.save({

    validateBeforeSave:false
}) 


}

    //delete  order admin

    exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
   
        const orders = await  Order.findById(req.params.id)
      
        if(!orders){

            return next(new ErrorHandler("order not found with this id",404))
        }

await orders.remove()

        res.status(200).json({
        
            success:true,
          
        })
        
        
        })


