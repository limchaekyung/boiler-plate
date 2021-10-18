const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        minglength: 5
    }, 
    lastname: {
        type:String,
        maxlength: 50
    },
    role : { //관리자, 사용자 구분
        type:Number,
        default: 0   //사용자
    },
    image: String,
    token : {    //유효성 관리
        type: String,
    },
    tokenExp :{ //토큰이 사용할 수 있는 기한
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;
    //비밀번호를 변경할 때만
    if(user.isModified('password')){    
        //비밀번호를 암호화 시킨다.
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword 123456  ===  암호화된 비밀번호 $2b$10$IhuSNGNpPULqlxecklY53eGevwTqwTo77csBxFDb0Oi40b3XM7we.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token =  jwt.sign(user._id.toHexString(),'secretToken')

    // user.id + 'secretToken' = token
    // -> 
    // 'secretToken' -> user._id

    user.token = token;
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는 지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
const User = mongoose.model('User', userSchema);

module.exports = { User }