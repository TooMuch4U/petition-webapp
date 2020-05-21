<template>
  <div>
    Home page<br>
    <router-link :to="{ name: 'petitions' }">Petitions</router-link><br>
    <router-link :to="{ name: 'login' }">Login</router-link><br>
    <router-link :to="{ name: 'register' }">Register</router-link><br>
    <router-link :to="{ name: 'logout' }">Logout</router-link><br>
  </div>
</template>
