const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]

    },
    price: {
        type: Number,
        required: [true, "Please enter Product Price"],
        maxlength: [8, "Price cnnot exceed 8 character"]
    },
    ratings: {

        type: Number,
        default: 0


    },
    images: [
        {
            public_id: {
                type: String,
                required: true

            },
            url: {
                type: String,
                required: true

            }
        }
    ],
    category: {

        type: String,
        required: [true, "Please enter product category"]

    },
    stock: {
        type: Number,
        required: true,
        max: 99999,
        default: 1


    },
    numofreviews: {
        type: Number,
        default: 0


    },
    reviews: [

        {
            user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
        
            },
        

            name: {
                type: String,
               

            },
            rating: {
                type: Number,
                
            },

            comment: {
                type: String,
                


            }
        }
    ],

    user:{
type:mongoose.Schema.ObjectId,
ref:"user",
required:true,

    },

    createdat: {
        type: Date,
        default: Date.now

    }



})

module.exports = mongoose.model("product", productschema);
