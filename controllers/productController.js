import Product from "../models/product.js";


export async function addProduct(req,res){
    console.log(req.user);
    const user = req.user;
    const productData = req.body;
    const newProduct = new Product(productData)
    if(user == null || user.role !=="admin")
        {
            res.status(401).json({message:"you can't access this"});
            return
        }
    try{
        await newProduct.save();
            res.json({message :`${productData.name} added !`})
        
    }
    catch{
        res.json({message:"product addition failed !"});
    }

}

export async function getProduct(req,res){
    const user =req.user;;
    let isAdmin =false;
    if(user !== null && user.role=="admin"){
        isAdmin=true
    }
    try{
        if(isAdmin){
         const foundProd = await Product.find();
         res.json({message:foundProd})            
        }else{
         const foundProd = await Product.find({availability:true});
         res.json({message:foundProd})
        }
    }catch{
        res.json({message :"something went wrong!!"})
    }

}

export async function deleteProduct(req,res) {
    const user = req.user;
    const key = req.params.key;
    
    try{
        if(user==null){
            res.status(401).json({ message: "Please login and try again!" });
            return;
        }
        if( user.role =="admin" )
        {
         try{
            const deleteProduct = await Product.deleteOne({prod_key:key});
            if(deleteProduct){
                res.json({message:"Product deleted successfully"})
            }else{
                res.status(404).json({message:"Product not found"})
            }
           }
         catch(err){
            res.status(500).json({message:"Failed to delete Product",err})
           }
        }
        else
        {
         res.status(403).json({message:"You are not authorized to delete this review"})
        }
    }
    catch(err){
        res.status(500).json({message:"Failed to delete Product",err})
    }
    
    
}