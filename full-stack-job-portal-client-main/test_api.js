const axios = require('axios');

async function test() {
    try {
        console.log("Sending request...");
        const response = await axios.post('http://localhost:3000/api/v1/auth/recruiter-register', {
            username: 'Test Recruiter',
            companyName: 'Test Co',
            email: 'testrec1873@gmail.com',
            password: 'TestPassword111'
        });
        console.log('SUCCESS', response.data);
    } catch (e) {
        console.log('ERROR STATUS:', e.response?.status);
        console.log('ERROR DATA:', e.response?.data);
        console.error(e.message);
    }
}

test();
