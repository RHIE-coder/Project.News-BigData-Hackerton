const router = require('express').Router()

module.exports = function () {

    router.post('/login', (req, res) => {
        const username = req.body.username
        const password = req.body.password

        const Member = req.app.get('db_model_list')['member'];

        Member.findOne({ username: username }, (err, user) => {
            if (err) throw err

            if(!user)  throw Error("login fail")

            const isAuthenticated = user.authenticate(password);

            if(!isAuthenticated)  throw Error("password is not correct")

            req.session.username = user.username

            res.render('index')
        })
    })

    router.post('/signup', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        const name = req.body.name

        const Member = app.get('db_model_list')['member'];

        Member.findOne({ username: username }, (err, user) => {
            if (err) throw err

            if (user) throw Error("already exists")

            const new_user = new Member({
                username: username,
                name: name
            })
            new_user.makeEncryptedPassword(password);
            console.log(new_user)
            new_user.save(err => { if (err) throw err })
        })


        res.render('index')
    })

    router.post('/check/login', (req, res) => {

    })

    return router
}

