const SaloonOwner = require("../models/saloonowner");
const bcrypt = require('bcrypt')
const jsonwebtoken = require("jsonwebtoken")

const signupSaloonOwner = async(req,res)=>{
const {userName,userEmail,userPass,userNumber,userExperience,saloonName,userAddress} = req.body;
try {
    const hashedPass = await bcrypt.hash(userPass,10);
    await SaloonOwner.create({
        userName : userName,
        userEmail : userEmail,
        userPass : hashedPass,
        userNumber : userNumber,
        userExperience : userExperience,
        userAddress : userAddress,
        saloonName : saloonName
    })

    return res.json({msg: "User Created Successfully"})
} catch (error) {
    return res.json({msg: error})
}
}

const signinSaloonOwner = async(req,res)=>{
    const {userEmail,userPass} = req.body;
    const userCheck = await SaloonOwner.findOne({
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

module.exports = {signupSaloonOwner,signinSaloonOwner}