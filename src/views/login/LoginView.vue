<template>
  <div class="login-box">
    <div class="login-info">
      <v-form ref="form" v-model="isValid">
        <div class="login-form">
          <h3>Username</h3>
          <v-text-field 
            v-model="username"
            label="Username" 
            :rules="usernameRules"
            required
          ></v-text-field>

          <h3>Password</h3>
          <v-text-field 
            v-model="password"
            label="Password" 
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>

          <v-alert v-if="warningMessage" type="warning" dense>{{ warningMessage }}</v-alert>
          <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
          <v-alert v-if="successMessage" type="success" dense>{{ successMessage }}</v-alert>

          <div class="login-rows">
            <button class="login-button" v-if="!isAuthenticated" :disabled="!isValid" @click.prevent="submitLogin">Login</button>
            <button v-if="!isAuthenticated" @click="isForgotPasswordDialogOpen = true">Forgot Password?</button>
          </div>
          <hr class = "cool-hr">
          <button class="register-button" v-if="!isAuthenticated" @click="isRegisterNewUserDialogOpen = true">New User? Create an Account</button>
        </div>
      </v-form>
    </div>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="isForgotPasswordDialogOpen" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
      </template>
      <template v-slot:default="{ isActive }">
        <v-card title="Forgot Password?">
          <v-card-text>
            Please enter your email to receive reset instructions.
            <v-text-field v-model="resetEmail" label="Email" type="email"></v-text-field>
          </v-card-text>
          <div class="forgot-buttons">
            <v-btn
              text="Cancel"
              variant="text"
              @click="isActive.value = false"
            ></v-btn>
            <v-btn
              color="surface-variant"
              text="Submit"
              variant="flat"
              @click="isActive.value = false"
            ></v-btn>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="isRegisterNewUserDialogOpen" max-width="400">
      <v-card title="Register New User">
        <v-card-text>
          Please enter your details to register.
          <p> </p>
          <v-text-field v-model="newUserFirstName" label="First Name" type="text"></v-text-field>
          <v-text-field v-model="newUserLastName" label="Last Name" type="text"></v-text-field>
          <v-text-field v-model="newUserEmail" label="Email" type="email"></v-text-field>
          <v-text-field v-model="newUserPassword" label="Password" type="password"></v-text-field>
          <v-text-field v-model="newUserConfirmPassword" label="Confirm Password" type="password"></v-text-field>
        </v-card-text>
        <div class="forgot-buttons">
          <v-btn text="Cancel" variant="text" @click="isRegisterNewUserDialogOpen = false"></v-btn>
          <v-btn color="surface-variant" text="Submit" variant="flat" @click="submitRegister"></v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>


</template>


<script src="./LoginView.ts" />
<style src="./LoginView.scss" />
