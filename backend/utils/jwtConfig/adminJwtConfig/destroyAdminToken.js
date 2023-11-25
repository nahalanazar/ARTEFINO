import jwt from 'jsonwebtoken'

const destroyAdminToken = (res) => {
    // empty string to place in cookie instead of token
    const jwtToken = ''

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: new Date(0)
    }

    res.cookie('adminJwt', jwtToken, cookieOptions)
}

export default destroyAdminToken;
