const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name cannot be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength:[5,'Name cannot be more than 5 digits']
    },
    tel:{
        type: String
    },
    rating:{
        type:Number,
        default:0
    },
    image:{
        type: String
    },
    price:{
        type: Number
    }
},{
    id:false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

HotelSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`booking and review Being removed from hotel ${this._id}`);
    await this.model('Booking').deleteMany({booking:this._id});
    await this.model('Review').deleteMany({hotel:this._id});
    next();
});

HotelSchema.virtual('booking',{
    ref:'Booking',
    localField:'_id',
    foreignField:'hotel',
    justOne:false
});
HotelSchema.virtual('review',{
    ref:'Review',
    localField:'_id',
    foreignField:'hotel',
    justOne:false
});
module.exports=mongoose.model('Hotel',HotelSchema);