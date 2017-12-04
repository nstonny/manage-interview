var error = require('./error-handlers');
/**
* checks and matches user provided token with the one in the database 
*
* @param {obj} db Database
* @return {obj} user if authentication succeeds
* @return {obj} res containing unauthorized error if fails
*/
module.exports = function (db) {    
        return {
            requireAuthentication: function (req, res) {
                var token = req.get('Auth');                    
                db.user.findByToken(token).then(function (user) {
                    req.user = user;                    
                }, function () {
                    error.unauthorized(res);
                });
            }
        };    
    };