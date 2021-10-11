const userCreation= async () => {
    const validUser={
        name: 'JestUser',
        surname: "JestSurname",
        email: "JestEmail@test.com",
        password: '123456'
    }
    const response = await request.post('/user/register').send(validUser)
    
    expect(response.status).toBe(201)
    expect(response.body._id).toBeDefined()
    
}

const tests = {
    userCreation:userCreation
}

export default tests