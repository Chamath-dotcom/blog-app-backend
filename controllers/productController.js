import Product from "../models/product.js";


export async function addProduct(req,res){
    console.log(req.user);
    const user = req.user;
    const productData = req.body;
    const newProduct = new Product(productData)
    try{
        if(user == null || user.role !=="admin")
        {
            res.status(401).json({message:"you can't access this"});
            return
        }
        if(user.role =="admin"){
            const saveprod = await newProduct.save();
            if(saveprod){
                res.json({message :`${productData.productName} added !`})
            }else{
                res.status(500).json({error:`product addition failed !`})
            }
        }
    }
    catch{
        res.json({message:"something went wrong!!"});
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