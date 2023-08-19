async function forgetpassworddata(event){
    event.preventDefault();
    const email = document.getElementById('email').value;

    const res = await axios.post('http://localhost:3000/password/forgotpassword', {email});
    if(res.response == 200){
        alert('Mail sent');
    }
    }