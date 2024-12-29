import Product from "../models/product.js";


export default  function addProduct(req,res){
    console.log(req.user);
    if(req.user == null)
    {
    res.status(401).json({message:"please login and try agin!"});
    return
    }
    if(req.user.role !=="admin")
    {
    res.status(403).json({message : "You are not an Admin"})
    return
    }

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