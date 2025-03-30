import "./style.css";
import axios from "axios";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const response = await axios.post(
      "http://localhost:3000/login",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log(response.data.message);
      location.href = "/home.html";
    } else {
      console.log(response.data.message);
    }
  });
}
