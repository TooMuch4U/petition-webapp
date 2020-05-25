<template>
    <div>
        <div id="login" class="container" v-if="$route">

            <div class="row" v-if="$cookies.get('token') == null">
                <div class="col-6 offset-3">
                    <h4>Login</h4>
                    <div class="alert alert-danger" v-if="errorFlag">
                        {{ this.error }}
                    </div>

                        <div class="form-group row">
                            <label for="email" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="email" v-model="email" placeholder="example@email.com">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="Password">
                            </div>
                        </div>
                        <div class="container">
                            <div class="row ">
                                <div class="col-6 float-left no-gutters">
                                    <p class="float-left">Don't have an account? <router-link :to="{ name: 'register' }">Register</router-link></p>
                                </div>
                                <div class="col-6 float-right no-gutters">
                                    <button v-on:click="userLogin()" class="btn btn-primary float-right">Sign in</button>
                                </div>

                            </div>
                        </div>


                </div>
            </div>

            <div v-else>
                <div class="col-6 offset-3">
                    <h4>Login</h4>
                    <p class="float-left">You are already logged in. Would you instead like to logout? <router-link :to="{ name: 'logout' }">Logout</router-link></p>

                </div>
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
                email: "",
                password: "",
                res: ""
            }
        },
        mounted: function() {

        },
        methods: {
            userLogin: function() {
                if (!this.validEmail(this.email)) {
                    alert("You must enter a valid email first!")
                }
                else if (this.password == '') {
                    alert("You must enter a password")
                }
                else {
                    this.$http.post('http://localhost:4941/api/v1/users/login', { email: this.email, password: this.password})
                        .then((response) => {
                            this.$cookies.set('token', response.data.token);
                            this.$cookies.set('userId', response.data.userId);
                            this.$parent.forceRerender();
                            this.$router.push('/').catch((err) => {});
                        })
                        .catch((err) => {
                            this.error = err.response.statusText;
                            this.errorFlag = true;
                        });
                }
            },
            validEmail: function (email) {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }

    };
</script>

