const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

userSchema.pre('save', function(next){
    var user = this;
    //비밀번호를 변경할 때만
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return nect(err)
                user.password = hash
                next()
            })
        })
    }
})

const User = mongoose.model('User', userSchema)

module.exports={User}