import jwt from 'jsonwebtoken'

const generateAdminToken = (res, userId) => {
    const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY_ADMIN, {
        expiresIn: '30d'
    })

    // to save in cookies
    res.cookie('adminJwt', jwtToken, {
        httpOnly: true,  // To prevent cookies from being accessed by client-side scripts
        secure: process.env.NODE_ENV !== 'production',  // Value will be false in the development environment and hence http will be allowed in development
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // Sets expiry of cookie to 30 days
    })
}

export default generateAdminToken;

// generateAdminToken.js
// import jwt from 'jsonwebtoken';

// const generateAdminToken = (res, adminId) => {
//   const jwtToken = jwt.sign({ adminId, role: 'admin' }, process.env.JWT_SECRET_KEY_USER, { expiresIn: '30d' });

//   const cookieOption = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   };

//   res.cookie('adminJwt', jwtToken, cookieOption);
// };

// export default generateAdminToken;
