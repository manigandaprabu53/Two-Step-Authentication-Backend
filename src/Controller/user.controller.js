import userModel from '../Model/user.model.js';
import auth from '../Utils/auth.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const signupUser = async(req, res)=>{
    try {
        let email = String(req.body.email);
        let user = await userModel.findOne({email: email})
        if(user){
            res.status(400).send({message: "User Already Present"})
        }
        else{
            req.body.password = await auth.hashData(req.body.password);
            req.body.token = crypto.randomBytes(10).toString('hex');
            req.body.tokenExpiry = Date.now() + 24 * 3600 * 1000;
            console.log("Token Expiry: "+req.body.tokenExpiry)
            await userModel.create(req.body);
            let link = `http://localhost:8000/users/activateAccount/${req.body.token}`;

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {user: 'manigandaprabumani96271@gmail.com', pass: 'jkta zqzx gsyt dxzg'}
            });
            const mailOptions = {
                to: email,
                from: 'passwordreset@demo.com',
                subject: 'Activate Account',
                html: `Please click <a href="${link}"> here </a> to activate your account.`
            }

            transporter.sendMail(mailOptions, (err)=>{
                if(err){
                    return res.status(500).send({message: "Error Sending Mail", err})
                }
                else{
                    
                    return res.status(200).send({message: "User created and Activation mail has been sent"})
                }
            })
            // res.status(200).send({message: "User Created Successfully"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

const activateAccount = async (req, res)=>{
    try {
        let token = req.params.token;
        console.log(token)
        let user = await userModel.findOne({token: token, tokenExpiry: {$gt: Date.now()}});
        console.log("user Account: "+user)
        if(!user){
            res.status(400).send({message: "Activation Time Exeeded. SignUp again to activate account"})
            let userdel = userModel.findOne({token: token});
            userdel.remove();
        }
        else{
            user.token = null;
            user.tokenExpiry = null;
            user.active = true;
            user.save()
            res.status(200).send({message: "Account Activated"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

const loginUser = async(req, res)=>{
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email: email});
        console.log(password)
        if(user){
            if(await auth.compareHash(password, user.password)){
                console.log("Password Matched")
                const token = auth.createToken({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user.id
                })
                
                res.status(200).send({message: "User Login Successfull", token: token})
            }
            else{
                res.status(401).send({message: "Incorrect Password"})
            }
        }
        else{
            res.status(401).send({message: "Unauthorized User"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

const forgotPassword = async(req, res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email});
        if(!user){
            res.status(400).send({message: "User Not Found"})
        }else{
            user.token = crypto.randomBytes(10).toString('hex');
            user.tokenExpiry = Date.now()+600000;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {user: 'manigandaprabumani96271@gmail.com', pass: 'jkta zqzx gsyt dxzg'}
            });

            const mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://localhost:5173/resetPassword/${user.token}\n\n  If you did not request this, please ignore this email and your password will remain unchanged.\n`
            }

            transporter.sendMail(mailOptions, (err)=>{
                if(err){
                    return res.status(500).send({message: "Error Sending Mail", err})
                }
                else{
                    res.status(200).send({message: "Password Reset Mail Sent"})
                }
            })
            // res.status(200).send({message: "Password Reset Token Generated"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

const resetPassword = async(req, res)=>{
    try {
        console.log("Password Reset Block")
        let token = req.params.token;
        console.log(req.params.token+" => Token")
        console.log(req.body.password+" => Password")
        const user = await userModel.findOne({token: token, tokenExpiry: {$gt: Date.now()}})

        if (!user) return res.status(400).send({message: 'Password reset token is invalid or has expired'});
        user.password = await auth.hashData(req.body.password);
        user.token = null;
        user.tokenExpiry = null;
        user.save();
        console.log("Hashed Data: "+user.password)
        res.status(200).send({message: "Password Has Been Reset"})
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

export default {
    signupUser,
    activateAccount,
    loginUser,
    forgotPassword,
    resetPassword

}