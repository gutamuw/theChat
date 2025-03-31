import "./style.css";
import axios from "axios";

const form = document.getElementById("registerForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted");
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const response = await axios.post(
    "http://localhost:3000/register",
    {
      name: name,
      email: email,
      password: password,
    },
    {
      withCredentials: true,
    }
  );
  if(response.status === 200) {
    alert("User created, you will be redirected to login page");
    location.href = "login.html";
  } else {
    alert("Something went wrong, try again");
  }
  console.log(response.data);
});
