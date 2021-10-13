const validMe = {
        name: 'JestUser',
        surname: "JestSurname",
        email: "JestEmail@test.com"
      }

const validUser={
        name: 'JestUser',
        surname: "JestSurname",
        email: "JestEmail@test.com",
        password: '123456'
}
const invalidUser = {
        name:'jestUser',
}

const validLogin = {
        name:'jestUser',
        email:'jest@gmail.com'
}

const invalidLogin = {
        name:'jestUser',
}

const validUserCreation= async() => {
    const response = await request.post('/user/register').send(validUser)
    expect(response.status).toBe(201)
    expect(response.body._id).toBeDefined()
}

const invalidUserCreation = async() =>{
    const response = await request.post('/user/register').send(invalidUser)
    expect(response.status).toBe(401) 
}

const validUserLogin = async() =>{ 
    const response = await request.post('/user/login').send(validLogin)
    expect(response.status).toBe(200)
}

const invalidUserLogin = async() =>{
    const response = await request.post('/user/login').send(invalidLogin)
    expect(response.status).toBe(404)
}

const getUserMe = async() =>{
    const response = await request.get('/user/me')
    expect(response.status).toBe(200)
} 
const updateUserMe = async() =>{
    const response = await request.put('/user/me')
    expect(response.body).toEqual(validMe)
    expect(typeof response.body.name,response.body.email,response.body.password).toBe('string')
}
const deleteUserMe = async() =>{
    const response = await request.delete('/user/me')
    expect(response.status).toBe(204)
}

const tests = {
    userCreation:validUserCreation,
    invalidUserCreation:invalidUserCreation,
    validUserLogin:validUserLogin,
    invalidUserLogin:invalidUserLogin,
    getUserMe:getUserMe,
    updateUserMe:updateUserMe,
    deleteUserMe:deleteUserMe
}

export default tests