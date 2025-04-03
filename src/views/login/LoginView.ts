export default {
  name: 'LoginView',
  data() {
    return {
      username: "",
      password: "",
      isAuthenticated: false,
      isForgotPasswordDialogOpen: false,
      isRegisterNewUserDialogOpen: false,
      isLoading: false,
      warningMessage: "",
      errorMessage: "",
      successMessage: "",
      isValid: false,
      hardcodedUsername: "admin",
      hardcodedPassword: "password123",
      usernameRules: [
        v => !!v || "Username is required"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 8) || "Password must be at least 8 characters"
      ],
      // Add registration-related data
      newUserFirstName: "",
      newUserLastName: "",
      newUserEmail: "",
      newUserPassword: "",
      newUserConfirmPassword: "",
      registerFormIsLoading: false,
      isRegisterFormValid: false, // Optional: for form validation
    };
  },
  methods: {
    submitLogin() {
      if (!this.isValid) { // Changed from isFormValid to isValid to match data
        return;
      }
      const user = {
        email: this.username, // Assuming username is used as email here
        password: this.password
      };
      this.errorMessage = ''; // Changed from errorMsg to match data
      this.isLoading = true;
      this.$store.dispatch("auth/login", user).then(
        () => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    forgotPassword() {
      console.log("Forgot Password Clicked");
    },
    submitRegister() {
      // Optional: Add validation logic here
      if (this.newUserPassword !== this.newUserConfirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const register = {
        name: `${this.newUserFirstName} ${this.newUserLastName}`, // Combine first and last name
        email: this.newUserEmail,
        password: this.newUserPassword,
        c_password: this.newUserConfirmPassword
      };

      this.registerFormIsLoading = true;
      this.$store.dispatch("auth/register", register).then(
        () => {
          alert('Success!');
          this.registerFormIsLoading = false;
          this.isRegisterNewUserDialogOpen = false; // Changed from registerDialog to match data
          // Optionally reset form fields
          this.newUserFirstName = "";
          this.newUserLastName = "";
          this.newUserEmail = "";
          this.newUserPassword = "";
          this.newUserConfirmPassword = "";
        },
        (error) => {
          this.registerFormIsLoading = false;
          alert('Error: ' + (error.message || "Registration failed"));
        }
      );
    },
  }
};