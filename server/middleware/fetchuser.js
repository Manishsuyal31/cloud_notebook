var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Manish$uyal';

const fetchuser = (req, res, next) => {

    const authToken = req.header('auth-token');
    if (!authToken) {
        res.status(401).send({ error: 'PLEASE AUTHENTICATE USING A VALID TOKEN' });
    }
    try {
        const data = jwt.verify(authToken, JWT_SECRET);
        console.log(data.user);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: 'PLEASE AUTHENTICATE USING A VALID TOKEN' });
        
    }
}

module.exports = fetchuser;