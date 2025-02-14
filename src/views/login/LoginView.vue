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

          <div class="login-rows">
            <button class="login-button" :disabled="!isValid" @click.prevent="submitLogin">Login</button>
            <button v-if="!isAuthenticated" @click="submitLogin">Forgot Password?</button>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>


<script src="./LoginView.ts" />
<style src="./LoginView.scss" />
