const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,  //공백 제거
        unique: 1
    }, 
    password: {
        type: String,
        minlength: 5
    }, 
    lastname: {
        type: String,
        maxlength: 50
    }, 
    role: { //관리자, 사용자 구분
        type: Number,
        default: 0  //사용자
    },
    image: String, 
    token: {    //유효성 관리
        type: String
    }, 
    tokenExp: { //토큰이 사용할 수 있는 기한
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports={User}