const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

mongoose.connect('mongodb://localhost:27017/local',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Member = require('./schema/member')
const BucketList = require('./schema/BucketList')
const Abc = require('./schema/abc')
const Xyz = require('./schema/xyz')
const Asdf = require('./schema/asdf')
const Qwer = require('./schema/qwer')

app.set('Member', Member)
app.set('BucketList', BucketList)
app.set('Abc', Abc)
app.set('Xyz', Xyz)
app.set('Asdf', Asdf)
app.set('Qwer', Qwer)

const member = {
    username : {type : String, unique : true},
    hashed_password : String,
    name : String,
    salt : String,
    reg_date : { type : Date, default : Date.now }
}

const member_schema = mongoose.Schema(member);

member_schema.method('makeSalt', function(){
    this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
})

member_schema.method('encryptPasswordString',function(plainText){
    return crypto.createHmac('sha256', this.salt).update(plainText).digest('hex');
})

member_schema.method('makeEncryptedPassword', function(plainText){
    this.makeSalt();
    this.hashed_password = this.encryptPasswordString(plainText);
})

member_schema.method('authenticate', function(plainText){
    return this.hashed_password === this.encryptPasswordString(plainText);
})

const Member = mongoose.model('member', member_schema);

// const from_client_password = "1234"

// Member.findOne({username : 'abasb'}, (err, user)=>{
//     if(err) {console.log(err)}
//     console.log(user.authenticate(from_client_password))
// })


const new_user = new Member({
    username : 'yyyy',
    name : "yesman",
})

new_user.makeEncryptedPassword('1234');

new_user.save(err => console.log(err))

