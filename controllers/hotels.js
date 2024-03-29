const Hotel = require('../models/Hotel');

exports.getHotels=async(req,res,next) => {

    let query

        const reqQuery = {...req.query};

        const removeFields = ['select','sort','page','limit'];
        removeFields.forEach(param=>delete reqQuery[param]);
        

        //console.log(reqQuery);


        let queryStr = JSON.stringify(reqQuery);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
        

        query = Hotel.find(JSON.parse(queryStr)).populate({
            path:'review',
            select:'-_id -hotel rating description'
        });
        
        //console.log(req.query);
        
        //Select fields
        if(req.query.select){
            const fields=req.query.select.split(',').join(' ');
            query=query.select(fields);
        }

        //Sort
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        }
        else{

            query=query.sort({ rating: -1 });

        }
        const page=parseInt(req.query.page,10) || 1;
        const limit=parseInt(req.query.limit,10) || 25;
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;
        

    try{

        const total=await Hotel.countDocuments(query);
        query=query.skip(startIndex).limit(limit);

        const hotels = await query;

        const pagination={};
        if(endIndex<total){
            pagination.next={page:page+1,limit}
        }
        if(startIndex>0){
            pagination.prev={page:page-1,limit}
        }
        
        res.status(200).json({
            success:true,
            count:hotels.length,
            pagination,
            data:hotels
        });
    } catch(err){
        res.status(400).json({success:false});
        
    }

};
//@desc     Get a hotel
//@route    GET /api/v1/hotels/:id
//@access   Public
exports.getHotel=async(req,res,next) => {
    try{
        //const hotel = await Hotel.findById(req.params.id).populate('booking');
        const hotel = await Hotel.findById(req.params.id).populate({
            path:'review',
            select:'-_id -hotel rating description'
        });
        console.log(hotel);
        if(!hotel){
            res.status(400).json({success:false});
        }

        res.status(200).json({
            success:true,
            data:hotel
        });
    } catch(err){
        res.status(400).json({success:false});
    }

};

exports.createHotel=async(req,res,next) => {
    //console.log(req.body);
    // res.status(200).json({success:true,msg:'Create new hospitals'});
    const hotel =await Hotel.create(req.body);
    res.status(201).json({
        success:true,
        data:hotel

    });
    
};


exports.updateHotel=async(req,res,next) => {

    try{
        const hotel = await Hotel.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators: true
        });
        if(!hotel){

            res.status(400).json({success:false});
        }

        res.status(200).json({
            success:true,

            data:hotel

        });
    } catch(err){
        res.status(400).json({success:false});
    }
};



exports.deleteHotel=async(req,res,next)=>{
    try{
        const hotel=await Hotel.findById(req.params.id);

        if(!hotel){
            return res.status(400).json({success:false});
        }

        await hotel.deleteOne();

        res.status(200).json({success:true,data:{}});
    }
    catch(err){
        res.status(400).json({success:false});
    }
};

