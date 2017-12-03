var errorHandlers = {
    serverError: function(res,msg){
        res.status(500).send({
            "error": "internal server error"
        });
    },
    unauthorized: function(res,msg){
        res.status(401).send({
            "error": "unauthorized access requested"
        });
    },
    notFound: function(res,errMsg){
        res.status(404).send({
            "error": errMsg
        });
    },
    badRequest: function(res,errMsg){
        res.status(400).send({
            "error": errMsg
        });
    }          
}
module.exports = errorHandlers;