const res = require("express/lib/response");
const Product = require("../models/productmodel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apifeatures");


//create product  --  admin

exports.createproduct = catchAsyncErrors(async (req,res) =>{

    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
    success:true,
    product
    })

    
    });

// exports.createproduct=async(req,res,next)=>{
//     try {
//         const product = await Product.create(req.body);
//             res.status(201).json({
//             success:true,
//             product
//             })
        
//     } catch (error) {
//         res.status(400).json({
//             success:false,
//             message:error
//         })
        
//     }
// }

// get all products


exports.getAllProducts = catchAsyncErrors(async (req,res,next) => {

const resultPerPage = 5;
const productCount = await Product.countDocuments()

 const apiFeature = new ApiFeature(Product.find(),req.query)
 .search()
 .filter().pagination(resultPerPage)

const products = await apiFeature.query;

res.status(200).json({
    success:true,
    products ,
    productCount
})

})

//get single product detail

exports.getproductdetail = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){

        return next(new ErrorHandler("Product Not Found",404))
    }


    res.status(200).json({
        success:true,
        product
    
    })

})



//update product admin

exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{

var product = await Product.findById(req.params.id);
if(!product){

    return next(new ErrorHandler("Product Not Found",404))
}

product = await Product.findByIdAndUpdate(req.params.id,req.body,{

    new:true,
    runValidators:true,
useFindAndModify:false
})
res.status(200).json({
success:true,
product

})
})

//delete product -- Admin

exports.deleteproduct =  catchAsyncErrors(async(req,res,next)=>{

const product = await Product.findById(req.params.id)

if(!product){

    return next(new ErrorHandler("Product Not Found",404))
} 

await product.remove();

res.status(200).json({
    success:true,
    message:"Product deleted Successfully"

})

})

//create new review or update the review

exports.createProductReview =  catchAsyncErrors(async(req,res,next)=>{
const{rating,comment,productId} = req.body;
const review ={
user:req.user._id,
name:req.user.name,
rating:Number(rating),
comment,
}


const product = await Product.findById(productId)

const isReviewed =  product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
    );
   
if (isReviewed) {
  
product.reviews.forEach((rev)=>{
    if(rev.user.toString() === req.user._id.toString())
    (rev.rating= rating),
    (rev.comment=comment)
 
})


} else {
    product.reviews.push(review)
    product.numofreviews =  product.reviews.length;
}

let avg = 0;
let totalRatings=product.reviews.length;
product.reviews.forEach((rev)=>{
    avg += rev.rating
});
product.ratings = avg/totalRatings;



await product.save({

validateBeforeSave:false

})


res.status(200).json({

    success:true
})
})

//get all reviews of product

exports.getProductReview =  catchAsyncErrors(async(req,res,next)=>{

const product = await Product.findById(req.query.id)

if(!product){

    return next(new ErrorHandler("Product Not Found",404))
} 

res.status(200).json({

    success:true,
    reviews:product.reviews
})

})



//delete reviews of product

exports.deleteProductReview =  catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId)

    if(!product){
    
        return next(new ErrorHandler("Product Not Found",404))
    } 

const reviews = product.reviews.filter((rev)=> rev._id.toString() != req.query.id.toString())

let avg = 0;

product.reviews.forEach((rev)=>{
    avg += rev.rating
});

const ratings = avg/reviews.length;

const numofreviews = reviews.length

await Product.findByIdAndUpdate(req.query.productId,{

    reviews,ratings,numofreviews
},{

    new:true,
    runValidators:true,
    useFindAndModify:false
 })

res.status(200).json({

    success:true,
 
})

})





