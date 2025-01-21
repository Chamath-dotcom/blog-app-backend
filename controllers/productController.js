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
    try{
        const foundProd = await Product.find();
        if(foundProd){
            res.json({message:foundProd})
        }else{
            res.json({messag:"can't found product!"})
        }
    }catch{
        res.json({message :"something went wrong!!"})
    }

}

export async function deleteProduct(req,res) {
  const user =req.user;
  const prod_key = req.params.prod_key;
  if(user ==null || user.role !=="admin"){
    res.json({message:"you can't delete thise product"})
  }
  try{
    await Product.deleteOne( {prod_key:prod_key})
    res.json({message:"your product has been deleted "})
  }catch(err){
    res.json({message:"somethind went wrong"})
  }
    
}