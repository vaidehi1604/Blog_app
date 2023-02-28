exports.logout= async(req,res)=>{
    if(req.headers&&req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
   if(!token){
    return
    res.status(401).json({success:false,message:'Authorization fail'})
   }

      const tokens=req.user.tokens;
     const newToken= tokens.filter(t=>t!==token)

     await user.findByIdAndUpdate(req.user._id,{tokens:newToken})
     res.json({success:true,message:'Sign out successfully '})
    }
}