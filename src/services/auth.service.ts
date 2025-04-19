import axios from "axios";
import API_URL from "./env";

class AuthService {
  login(user) {
    let formData = new FormData();
    formData.append("email", user.email);
    formData.append("password", user.password);
    return axios.post(API_URL + "login", formData)
      .then((response) => {
        console.log('Login Response:', response.data);
        if (response.data.data.token) { // Access nested token
          console.log(response.data.data)
          localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        return response.data.data; // Return {token, name}
      })
      .catch(error => {
        console.log('Login Error:', error.response?.data || error.message);
        throw error;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "register", {
      name: user.name,
      email: user.email,
      password: user.password,
      c_password: user.c_password,
    });
  }

  forgotPassword(forgotEmail) {
    console.log("inside service -- ", forgotEmail);
    let formData = new FormData();
    formData.append("email", forgotEmail);
    return axios
      .post(API_URL + "forgot_password", formData)
      .then((response) => {
        return response.data;
      });
  }
}

const authService = new AuthService();
export default authService;