const db = require('./models')

const testUser = async () => {
    try {
        const newUser = await db.User.create({
            name: 'Tae',
            email: 'tae@tae.gov',
            password: 'password1234'
        })
    } catch (err) {
        console.log(err)
    }
}

testUser()