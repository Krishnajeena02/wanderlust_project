 class ExpressError extends Error{
    constructor(statuscode, messege){
        super();
        this.statuscode=statuscode;
        this.messege=messege;
    }
 }

 module.exports = ExpressError;