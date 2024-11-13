const PostModel = require("../models/post");
const UserModel= require("../models/user");
const path = require('path');
const multer= require("multer");
var express = require('express');
var router = express.Router();


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req, 'res')
        cb(null, 'public\\images\\uploads')
    },
    filename: (req, file, cb) => {
        const postImg = file.fieldname + "-" + Date.now();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${postImg}${fileExtension}`);
    }
});
const upload = multer({
    storage: storage
   });

router.get("/", async (req,res)=> {
    // let posts = await PostModel.find({}).lean();
    // let users = await UserModel.find({}).lean();
//  console.log(posts);
// for (const post of posts) {
//     // console.log(post.description , post.postBy);

//    let user= await  UserModel.findById({_id:post.postBy});
//     console.log(user);
// }
    let posts =await  PostModel.aggregate([
        {
                 $lookup:{
                    from: "users",
                    let:{id:"$postBy"},
                    pipeline:[
                      { $match:
                         { $expr:
                            { $eq: [ "$_id",  "$$id" ] }, 
                         }
                      },
                 
                      { $project: { _id : 1 , firstname:1, profile:1 } }
                    ],
               as: "user"
                   }  
                  },
                  {$unwind:"$user"}
        ])
        // console.log(userdata);

 
// userdata.forEach(element => 
//    element);
//    for (const user of posts) {
    
//    }
// for (const user of users) {
//     // console.log(user);
//     let postUser =await PostModel.findById({postBy:user._id}).lean();
//     console.log(postUser);
//     // let user = await PostModel.findById({postBy:user._id}).lean();
//     // console.log(user);
// }
// let user = await UserModel.find({})


    res.render("timeline",{layout:"main",userDetail:req.user , posts:posts})
});



router.post("/", upload.single('post-img'), async(req,res)=>{
      const addPost = await PostModel.create({
         title:req.body.title,
         description:req.body.description,
         image:req.file.filename,
         postBy:req.user._id
      })
      res.send(addPost)
})




module.exports=router;
