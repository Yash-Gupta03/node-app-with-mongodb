// Function invoked after the form is submittedform
const signupbtn = document.getElementById('signupbtn');


async function signupdata() {

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // Making values in the form null after submitting the form
  document.getElementById("name").value = null;
  document.getElementById("email").value = null;
  document.getElementById("password").value = null;

  // Creating object of the data
  const obj = {
    name: name,
    email: email,
    password: password,
  };

  // Post request to the server to store user details
  try{
    const response =  await axios.post("http://localhost:3000/user/sign-up", obj)
    if(response.status == 200){
      console.log(response.data.message);
      const message = response.data.message;
      alert(message);
    }else if(response.status == 201){
      alert(response.data.message);
      window.location.href = "login.html";
    }
    
  }catch(error){
    alert(error);
    console.log(error);
  }
  
}

signupbtn.addEventListener('click', signupdata)