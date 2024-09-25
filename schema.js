const Joi =  require("joi");



module.exports.listingschema= Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required(),
        image:Joi.object({
            filename:Joi.string().optional(),
            url: Joi.string().allow("",null).required(),
        }).required()

    }).required()

});


