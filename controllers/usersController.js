const bcrypt = require('bcrypt')
const jsonwebtoken = require("jsonwebtoken");
const User = require('../models/user');

const signupUser = async(req,res)=>{
const {userName,userEmail,userPass,userNumber,userAddress} = req.body;
try {
    const hashedPass = await bcrypt.hash(userPass,10);
    await User.create({
        userName : userName,
        userEmail : userEmail,
        userPass : hashedPass,
        userNumber : userNumber,
        userAddress : userAddress,
    })

    return res.json({msg: "User Created Successfully"})
} catch (error) {
    return res.json({msg: error})
}
}


const signinUser = async(req,res)=>{
    const {userEmail,userPass} = req.body;
    const userCheck = await User.findOne({
        userEmail : userEmail
    })

    if(userCheck){
        const userPasscheck = await bcrypt.compare(userPass,userCheck.userPass);
        if(userPasscheck===true){
            const token = jsonwebtoken.sign({id:userCheck._id},"shubham@123")
            return res.cookie("token",token).json({msg:"Login Successful"})
        }
        else{
            return res.json({msg:"Invalid Email or Password"})
        }
    }
    else{
        return res.json({msg:"Invalid Email or Password"})
    }
}

module.exports = {signupUser,signinUser}