const axios = require('axios')
const { expect } = require('chai')
const fs = require('fs')
const envVariables = require('./env.json')
const { randomId } = require('./randomId')
const { faker } = require('@faker-js/faker');

describe("User API Automation", async () => {
    it("User can do login successfully", async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/login`, {
            "email": "joel.hubert@example.com",
            "password": "1234"
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        var token = data.token;
        envVariables.token = token;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables))

    })

    it("User can not do login with wrong email", async () => {
        try{
            var response = await axios.post(`${envVariables.baseUrl}/user/login`, {
                "email": "jo@example.com",
                "password": "1234"
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                console.log(data);
                expect(data.message).contains('User not found')

        }catch(err)
        {
            console.log(err.response.data)
            expect(err.response.data.message).contains('User not found')

        }
       

       
        

    })


    it("User can not do login with wrong password", async () => {
       try{
         var { data } = await axios.post(`${envVariables.baseUrl}/user/login`, {
            "email": "joel.hubert@example.com",
            "password": "12"
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        console.log(data);
        expect(data.message).contains('Password incorrect') 
       }catch(err)
       {
           console.log(err.response.data)
           expect(err.response.data.message).contains('Password incorrect')

       }

    })

    it("User can view list if having proper authorization", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token
            }
        })
      var id = data.users[0].id;
        console.log(id);
    })
    it("Get User List if user does not input token", async () => {
     try{var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
               
            }
        })
        console.log(data);
        expect(data.message).contains('No Token Found!')
    }catch(err)
    {
        console.log(err.response.data)
        expect(err.response.data.error.message).contains('No Token Found!')
    }

    
    })

    it("Get User List if user input wrong token", async () => {
       try{ var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "12345"
            }
        })
        console.log(data);
        expect(data.message).contains('Token expired!')
    }catch(err)
    {
        console.log(err.response.data)
        expect(err.response.data.error.message).contains('Token expired!')

    }
    })

    it('Create new users', async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/create`, {
            "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
            "email": `test${randomId(100000, 999999)}@test.com`,
            "password": "123456",
            "phone_number": `01501${randomId(100000, 9999999)}`,
            "nid": "123456789",
            "role": "Customer"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data);
        expect(data.message).contains('User created successfully')
        envVariables.id = data.user.id;
        envVariables.name = data.user.name;
        envVariables.email = data.user.email;
        envVariables.phoneNumber = data.user.phone_number;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables));
    })

    it("User can Search using a valid id", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/search?id=${envVariables.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data.user.name);
        expect(data.user.name).contains(`${envVariables.name}`)
    })

    it("Update whole user info", async () => {
        var { data } = await axios.put(`${envVariables.baseUrl}/user/update/${envVariables.id}`,{
            "name": envVariables.name,
            "email": envVariables.email,
            "password": "12345678",
            "phone_number":envVariables.phoneNumber,
            "nid": envVariables.nid,
            "role": "User"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        
        console.log(data);
        expect(data.message).contains('User updated successfully')
    
    
    })
    it("Update specific user info", async () => {
        var { data } = await axios.patch(`${envVariables.baseUrl}/user/update/${envVariables.id}`,{
            "role": "Student"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })

        console.log(data);
        expect(data.message).contains('User updated successfully')
       
        
    })
    it("Delete user info", async () => {
        var { data } = await axios.delete(`${envVariables.baseUrl}/user/delete/${envVariables.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data)
        expect(data.message).contains('User deleted successfully')
    
    
    })

    it("Already for deleted user", async () => {
        try{
            var { data } = await axios.delete(`${envVariables.baseUrl}/user/delete/${envVariables.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data)
        expect(data.message).contains('User not found')
    }catch(err)
    {
        console.log(err.response.data)
        expect(err.response.data.message).contains('User not found')

    }
    
    
    })

    it("Search the deleted user", async () => {
       try{ var { data } = await axios.get(`${envVariables.baseUrl}/user/search/?id=${envVariables.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data)
        expect(data.user).equals(null)
    }catch(err)
    {
        console.log(err.response.data.user)
        expect(err.response.data.user).equals(null)

    }
        
    
    
    })
    

})



