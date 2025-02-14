export default {
    name: 'LoginView',
    data() {
      return {
        username: "",
        password: "",
        isAuthenticated: false,
        isValid: false,
        usernameRules: [
          v => !!v || "Username is required"
        ],
        passwordRules: [
          v => !!v || "Password is required",
          v => (v && v.length >= 8) || "Password must be at least 8 characters"
        ]
      };
    },
    methods: {
      submitLogin() {
        if (this.$refs.form.validate()) {
          this.isAuthenticated = true;
          this.$emit('authenticate', this.isAuthenticated);
        }
      },
    }
  }