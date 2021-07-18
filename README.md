# encryptly-auth-sdk
### SDK for Encryptly Authentication Service

_Installing and updating the SDK (server side)_
```
npm i encryptly-auth-sdk@latest

or 

yarn add encryptly-auth-sdk@latest
```



_Environment Variables Example_
```
ENCRYPTLY_CLIENT_ID=0b3bde10-f5cf-47a1-bd64-ed9103217c86
ENCRYPTLY_CLIENT_SECRET=76bd6936-5430-4deb-a3da-a8b099f0aa61
ENCRYPTLY_SERVER_URL=http://localhost:5001
```

_Verifying Token_

```javascript
const { checkToken } = require("encryptly-auth-sdk");

exports.oauthLogin = async (req, res) => {
    // If you passed the token using ?token=<TOKEN>
    if (!req.query.token) {
        return res.status(400).send({ error: "No token provided" });
    }

    const serverUrl = process.env.ENCRYPTLY_SERVER_URL;
    const clientId = process.env.ENCRYPTLY_CLIENT_ID;
    const clientSecret = process.env.ENCRYPTLY_CLIENT_SECRET;

    const response = await checkToken({
        token: req.query.token,
        serverUrl,
        clientId,
        clientSecret
    });

    // In case of wrong token
    if (response.error) {
        return res.sendStatus(401);
    }

    // User object received from authentication server
    const { _id, displayName, email, firstName, lastName } = response.user;

    // Handle retrieving or adding the user to your own database
    // Or whatever you wish to do with the user object
    let user = await User.findOne({ email: email });
    if (!user) {
        user = new User({
            displayName,
            email,
            oauthId: _id,
            accessLevel: "User",
        });
        await user.save();
    }

    const jwtUserData = {
        userId: user._id,
        userAccessLevel: user.accessLevel,
    };
    const jwtToken = jwt.sign(jwtUserData, process.env.JWT_SECRET);

    // If you are being redirected directly
    // from Encryptly Authentication Server
    if (req.query.redirectUrl) {
        let redirectUrl = req.query.redirectUrl ? req.query.redirectUrl : "/";
        redirectUrl = redirectUrl + "?token=" + jwtToken;

        return res.redirect(redirectUrl);
    }
    
    // If you are calling this route from client
    // and sending the received token from
    // Encryptly Authentication Service (popup method)
    return res.send({ token: jwtToken });
}
```