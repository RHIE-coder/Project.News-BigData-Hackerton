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

module.exports =  mongoose.model('member', member_schema);