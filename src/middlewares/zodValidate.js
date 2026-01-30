export const zodValidate = (schema) => (req, res, next) => {
    try{
        req.body = schema.parse({
            body:req.body, 
            params: req.params, 
            query: req.query
        });
        next();
    }catch(err){
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
        });
    }
};