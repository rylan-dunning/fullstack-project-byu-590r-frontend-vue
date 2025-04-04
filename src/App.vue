<script lang="ts">
import { RouterLink, RouterView } from "vue-router"
import LoginView from "./views/login/LoginView.vue"
import { mapState } from "vuex"
import { ref } from "vue"

export default {
    setup() {
        const theme = ref("dark")
        function changeTheme() {
            theme.value = theme.value === "light" ? "dark" : "light"
        }
        return { theme, changeTheme }
    },
    name: "App",
    components: {
        LoginView,
        RouterLink,
        RouterView
    },

    data: function () {
        return {
            profileDialog: false,
            profileIsUploading: false,
            verificationEmailLoading: false,
            showEmailNotVerifiedDialog: false,
            showChangeEmailTextField: false,
            changeEmail: false,
            successVerificationMessage: '',
            changeEmailRules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
            profile:
            {
                avatar: '',
                name: '',
                title: '',
                icon: 'mdi-account-circle',
                color: 'info'
            },
            profilePictureImage: '',
            emailOfVerification: ''
        }
    },

    computed: {
        ...mapState({
            user() {
                return this.$store.state.user.user
            },
            auth() {
                return this.$store.state.auth
            },
            authUser() {
                return this.auth.user
            },
            isAuthenticated() {
                return (
                    this.auth.status.loggedIn &&
                    this.authUser.token !== undefined
                )
            },
            title() {
                return "Welcome " + this.authUser.name + "!"
            },
            avatarURL() {
                return this.auth.user.avatar
            },
            profilePictureChangeLabel() {
                return "Profile picture change"
            }
        })
    },
    updated() {
        if (this.isAuthenticated) {
            this.$router.push({ name: "home" })
        }
    },
    created() {
            console.log(this.authUser)
            if (this.authUser) {
                this.getCurrentUser();
            }
        },
    methods: {
        logout() {
            this.$store.dispatch("auth/logout")
        },
        checkAuth(auth) {
            console.log("Authenticated!", auth)
        },
        onAvatarChange(e) {
            var image = e.target.files || e.dataTransfer.files;

            if (!image.length)
                return;
            this.profileIsUploading = true;
            this.$store.dispatch("user/uploadAvatar", image[0])//, { root: true })
            .then(
                (response) => {
                    this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
                    this.profileIsUploading = false;
                },

            ).catch((error) => {
                alert('Error. Try again');
                this.profileIsUploading = false;
            });
        },
        
        removeAvatar() {
            this.profileIsUploading = true;
            this.$store.dispatch("user/removeAvatar").then(
                (response) => {
                    this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
                    this.profileIsUploading = false;
                },

            ).catch((error) => {
                console.log(error);
                alert('Error. Try again');
                this.profileIsUploading = false;
            });
        },
        getCurrentUser() {
            console.log("I'm here!")
            this.profile.name = this.authUser.name;

            this.profile.title = this.title;
            this.$store.dispatch("user/getUser").then(
                (response) => {
                    if (response.avatar) {
                        this.$store.commit("auth/uploadAvatarSuccess", response.avatar);

                    }
                }
            )
        },
    }
}
</script>
<template>
    <v-app :theme="theme">
        <v-app-bar :title="authUser.name === undefined ? '' : title" v-if="isAuthenticated">
            <v-spacer></v-spacer>
            <v-btn to="/home" default>Home</v-btn>
            <v-btn to="about">About</v-btn>
            <v-btn to="/video-games">Video Games</v-btn>
            <v-btn :prepend-icon="theme === 'light'
                ? 'mdi-weather-sunny'
                : 'mdi-weather-night'
                " @click="changeTheme">Toggle Theme</v-btn>
                
            <!-- Avatar Menu -->
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-avatar
                        v-bind="props"
                        size="40"
                        class="ml-4 mr-2"
                        style="cursor: pointer;"
                    >
                        <v-img
                            v-if="avatarURL"
                            :src="avatarURL"
                            alt="Profile Picture"
                        ></v-img>
                        <v-icon v-else>mdi-account-circle</v-icon>
                    </v-avatar>
                </template>
                <v-list>
                    <v-list-item @click="profileDialog = true">
                        <v-list-item-title>Change Profile Picture</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout()">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            
            <v-btn @click="logout()">Logout</v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <div v-if="isAuthenticated">
                    <RouterView />
                </div>
                <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
            </v-container>
        </v-main>
        
        <!-- Profile Dialog -->
        <v-dialog v-model="profileDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span>{{ profilePictureChangeLabel }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="profileDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row justify="center" class="mt-2">
                        <v-avatar size="100">
                            <v-img
                                v-if="avatarURL"
                                :src="avatarURL"
                                alt="Profile Picture"
                            ></v-img>
                            <v-icon v-else size="100">mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-row>
                    <v-row class="mt-4">
                        <v-col>
                            <v-file-input
                                label="Select Image"
                                prepend-icon="mdi-camera"
                                @change="onAvatarChange"
                                accept="image/*"
                                :loading="profileIsUploading"
                                name="image"
                            ></v-file-input>
                        </v-col>
                    </v-row>
                    <v-row v-if="avatarURL">
                        <v-col>
                            <v-btn 
                                color="error" 
                                block 
                                @click="removeAvatar"
                                :loading="profileIsUploading"
                            >
                                Remove Avatar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>