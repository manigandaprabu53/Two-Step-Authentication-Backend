import bcrypt from 'bcryptjs';
import config from './config.js';
import jwt from 'jsonwebtoken'

const hashData = async(str)=>{
    console.log('Inside Hashing')
    let salt = await bcrypt.genSalt(config.SALT);
    console.log(salt)
    let hash = await bcrypt.hash(str, salt);
    console.log(hash)
    return hash;
}

const compareHash = async(str, hash)=>{
    return await bcrypt.compare(str, hash);
}

const createToken = (payload)=>{
    let token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRY
    })
    return token;
}

const decodeToken = (token)=>{
    return jwt.decode(token)
}

export default {
    hashData,
    createToken,
    decodeToken,
    compareHash
}