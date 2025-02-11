export default {
    name: 'LoginView',
    emits: ['authenticate'],
    data: function () {
        return {
            isAuthenticated: false
        }
    },
    methods: {
        submitLogin() {
            this.isAuthenticated = true;
            this.$emit('authenticate', this.isAuthenticated)
        }
    }
}