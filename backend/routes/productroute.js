const express = require("express");
const { getAllProducts , 
    createproduct,
     updateProduct,
      deleteproduct,
       getproductdetail,
        createProductReview, 
        getProductReview,
        deleteProductReview} = require("../controllers/productcontroller");
const { isAuthenticatedUser ,authorizedRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(  getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizedRoles("admin"),createproduct);
router
.route('/admin/product/:id')
.put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteproduct) 

router.route("/product/:id").get(getproductdetail)
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(getProductReview).delete(isAuthenticatedUser,deleteProductReview)


module.exports = router;



