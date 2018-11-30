import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
    if (password.length < 8 ) {
        throw new Error("Your password should be greater than or equal 8 chars ")
    }  
    return bcrypt.hash(password , 12)
}

export default hashPassword