<template>
    <div id="logout" class="container">
        <div class="row" v-if="$cookies.get('token') != null">
            <div class="col-6 offset-3">
                <h3>Logout</h3>
                <div class="alert alert-danger" v-if="errorFlag">
                    {{ this.error }}
                </div>
                <p>You are currently logged in as {{ name }}.</p>
                <button v-on:click="userLogout()" class="btn btn-primary float-right">Logout</button>

            </div>
        </div>
        <div class="row" v-else>
            <div class="col-6 offset-3">
                <h3>Logout</h3>
                <p class="float-left">You are already logged out. Would you instead like to login? <router-link :to="{ name: 'login' }">Login</router-link></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                error: "",
                errorFlag: false,
                name: ''
            }
        },
        mounted: function() {
            this.getName()
        },
        methods: {
            getName: function() {
                this.$http.get('http://localhost:4941/api/v1/users/' + this.$cookies.get('userId'))
                    .then((response) => {
                        this.name = response.data.name;
                    }).catch((error) => {})
            },
            userLogout: function() {
                this.$http.post('http://localhost:4941/api/v1/users/logout', {},
                    { headers: {"X-Authorization": this.$cookies.get('token')}})
                    .then((response) => {
                        this.$cookies.remove('token');
                        this.$cookies.remove('userId');
                        this.$parent.forceRerender();
                        this.$router.push('/login');
                    })
                    .catch((error) => {
                        this.error = error;
                        this.errorFlag = true;
                    })

            }
        }

    };


</script>
