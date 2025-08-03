const jwt = require('jsonwebtoken');

const authUser = (req, res)=>{
    const {username, password} = req.body;
    

    if (username != process.env.ADMIN_USERNAME || password != process.env.ADMIN_PASS){
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    } )

    res.json({token});
};

module.exports = {authUser};