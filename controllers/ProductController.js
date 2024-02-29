const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");

const delFile = require("../utils/delFile")


const create = async (req, res) => {

    let data = req.body;
    console.log(data)
    data['weight'] = Number(data['weight']);
    data['price'] = Number(data['price']);
    data['stock'] = Number(data['stock']);
    if(req.file){
        data['imgUrl']=`/images/product/${req.file.filename}`
    }
    const product = await Product.create(data); 
    res.status(StatusCodes.CREATED).json({product});
};

const edit = async (req, res) => {
   
    let data = req.body;
    data['weight'] = Number(data['weight']);
    data['price'] = Number(data['price']);
    data['stock'] = Number(data['stock']);
    console.log(req.body);
    let _id = data._id;
    delete data._id
    if(req.file){
        data['imgUrl']=`/images/product/${req.file.filename}`
        let prev_prod = await Product.findById(_id);
        let prev_img = prev_prod.imgUrl.split('/').pop();
        delFile(prev_img,res,'product');
    }
    

    await Product.findByIdAndUpdate(_id, data);
    let newThing = await Product.findById(_id);
    console.log(newThing);
    return res.status(StatusCodes.OK).json({message: 'update success', data: newThing});
};

const destroy = async (req,res)=>{
    let id = req.params.id;
    let prev_prod = await Product.findById(_id);
    let prev_img = prev_prod.imgUrl.split('/').pop();
    delFile(prev_img,res,'product');
    deleted = await Product.findByIdAndDelete(id);

    if(deleted){
        return res.status(StatusCodes.OK).json({message: 'delete success', data: deleted});
    }
    return res.status(StatusCodes.NOT_FOUND).json({message:'delete failed'})
};

const getaAll = async(req,res)=>{
    const products = await Product.find().sort("name");
    // console.log(members)
    return res.json(products);
}


module.exports = {
    getaAll,
    create,
    edit,
    destroy,
  };