/**
* defines error handlers for possible errors
*/
var errorHandlers = {
    /**
    * @param {obj} res response object
    * @return {obj} res containing server error 
    */
    serverError: function(res){
        res.status(500).send({
            "error": "internal server error"
        });
    },
    /**
    * @param {obj} res response object
    * @return {obj} res containing unauthorized error 
    */
    unauthorized: function(res){
        res.status(401).send({
            "error": "unauthorized access requested"
        });
    },
    /**
    * @param {obj} res response object
    * @param {obj} errMsg accepts custom error msg
    * @return {obj} res containing not found error with custom error msg 
    */
    notFound: function(res,errMsg){
        res.status(404).send({
            "error": errMsg
        });
    },
    /**
    * @param {obj} res response object
    * @param {obj} errMsg accepts custom error msg
    * @return {obj} res containing bad request error with custom error msg 
    */
    badRequest: function(res,errMsg){
        res.status(400).send({
            "error": errMsg
        });
    }          
}
module.exports = errorHandlers;