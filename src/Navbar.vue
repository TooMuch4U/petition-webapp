<template>
    <nav class="navbar navbar-expand-md navbar-dark green-color sticky-top">
        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">

            <div class="navbar-nav">
                <router-link class="nav-item nav-link active" to="/petitions">Petitions</router-link>
                <router-link class="nav-item nav-link active" to="/register">Register</router-link>
                <router-link class="nav-item nav-link active" to="/login">Login</router-link>

            </div>
            <div class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link active" to="/logout">Logout</router-link>
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

</style>