<template>

    <nav class="navbar navbar-expand-md navbar-dark green-color sticky-top">
        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse custom-margins" id="navbarCollapse">

            <div class="navbar-nav">
                <router-link class="nav-item nav-link active" to="/petitions">Petitions</router-link>

            </div>
            <div v-if="$cookies.get('token')" class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link active" to="/profile">Profile</router-link>
                <router-link class="nav-item nav-link active" to="/profile">/</router-link>
                <router-link class="nav-item nav-link active" to="/logout">Logout</router-link>

            </div>
            <div v-else class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link active" to="/register">Register</router-link>
                <router-link class="nav-item nav-link active" to="/register">/</router-link>
                <router-link class="nav-item nav-link active" to="/login">Login</router-link>
            </div>

        </div>
    </nav>
</template>

<script>
    export default {
        data (){
            return {
            }
        },
        mounted: function() {
        },
        methods: {

        }
    };
</script>

<style scoped>
    .custom-margins {
        max-width: 720px;
        margin-left: auto;
        margin-right: auto;
    }
</style>