import auth from "../Utils/auth.js";
import usersModel from '../Model/user.model.js'

const verifyAdmin = async (req, res, next)=>{
    let token = req.headers?.authorization?.split(" ")[1]
    // console.log(token)
    if(token){
        let payload = auth.decodeToken(token);
        let user = await usersModel.findOne({id: payload.id, email: payload.email, role: payload.role})
        if(user && user.role === "admin")
            next()
        else
            res.status(401).send({message: "Access Denied Contact Admin"})
    }
    else{
        res.status(401).send({
            message: "No Token Found"
        })
    }
}

export default verifyAdmin