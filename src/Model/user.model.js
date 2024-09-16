import mongoose from "../Model/index.js";
import generateUUID from "../Utils/helper.js";
import validator from '../Utils/validators.js';

const userSchema = new mongoose.Schema(
    {
        id:{
            type: String,
            default: function(){
                return generateUUID();
            }
        },
        firstName:{
            type: String,
            required: [true, 'Name is Required']
        },
        lastName:{
            type: String,
            required: [true, 'Name is Required']
        },
        email:{
            type: String,
            required: [true, 'Email is Required'],
            validate:{
                validator: validator.validateEmail,
                message: props=>`${props.value} is not a valid email`
            }
        },
        password:{
            type: String,
            required: [true, 'Password is required'],
            validate:{
                validator: validator.validatePassword,
                message: props=>`${props.value} doesn't meet requirement`
            }
        },
        active:{
            type: Boolean,
            default: false
        },
        token:{
            type: String,
            default: null
        },
        tokenExpiry:{
            type: Date,
            default: null
        }
    },
    {
        collection: 'users',
        versionKey: false
    }
)

export default mongoose.model('users', userSchema)