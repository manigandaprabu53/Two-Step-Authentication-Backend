import auth from "../Utils/auth.js";

const verifyAuth = async (req, res, next)=>{
    let token = req.headers?.authorization?.split(" ")[1]
    
    if(token){
        let payload = auth.decodeToken(token)
        if(Math.floor(+new Date()/1000) < payload.exp)
        {
            req.headers.userId = payload.id;
            next();
        }
        else
            res.status(401).send({message: "Session Expired"})
    }
    else{
        res.status(401).send({
            message: "No Token Found"
        })
    }
}

export default verifyAuth