import generateUUID from '../Utils/helper.js';
import mongoose from 'mongoose';
import validators from '../Utils/validators.js';

const urlSchema = new mongoose.Schema(
    {
        id:{
            type: String,
            default: function(){
                return generateUUID();
            }
        },
        longUrl:{
            type: String,
            required: [true, "Long URL is required"],
            validate:{
                validator: validators.validateUrl,
                message: props=>`${props.value} is not a valid URL`
            }
        },
        shortUrl:{
            type: String,
            default: null
        },
        clicks:{
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        collection: 'url',
        versionKey: false
    }
)

export default mongoose.model('url', urlSchema)