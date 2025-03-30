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
  console.log(response.data);
});
