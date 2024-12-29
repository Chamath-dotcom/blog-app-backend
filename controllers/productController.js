import Product from "../models/product.js";


export default  function addProduct(req,res){
    const productData = req.body;
    const newProduct = new Product(productData)
    newProduct.save()
    .then(
        ()=>{
            res.json({message :`${productData.productName} added !`})
        }
    ).catch(
        ()=>{
            res.status(500).json({error:`product addition failed !`})
        }
    )
}