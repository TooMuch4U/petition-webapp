<template>
    <div>
        <div id="register" class="container">

            <div class="row">
                <div class="col-6 offset-3">
                    <h4>Register</h4>
                    <div class="alert alert-danger" v-if="errorFlag">
                        <strong>Error!</strong> {{ this.error }}
                    </div>
                        <div class="form-group row">
                            <label for="name" class="col-sm-2 col-form-label">Name<span class="text-danger">*</span></label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="name" v-model="name" placeholder="john">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-sm-2 col-form-label">Email<span class="text-danger">*</span></label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="email" v-model="email" placeholder="example@email.com">
                            </div>
                        </div>
                        <div class="form-group required row">
                            <label for="inputPassword" class="col-sm-2 col-form-label">Password<span class="text-danger">*</span></label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="password">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="city" class="col-sm-2 col-form-label">City</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="city" v-model="city" placeholder="chirstchurch">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="country" class="col-sm-2 col-form-label">Country</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="country" v-model="country" placeholder="new zealand">
                            </div>
                        </div>
                        <div class="form-group row">

                            <div class="custom-file">

                                    <input type="file" class="custom-file-input"  accept="image/jpg image/jpeg image/png image/gif" @change="fileSelected" id="customFile">
                                    <label class="custom-file-label">{{ fileName }}</label>
                            </div>
                        </div>


                        <div class="container">
                            <div class="row ">
                                <div class="col-6 float-left no-gutters">
                                    <p class="float-left">Already have an account? <router-link :to="{ name: 'login' }">Login</router-link></p>
                                </div>
                                <div class="col-6 float-right no-gutters">
                                    <button v-on:click="userRegister()" class="btn btn-primary float-right">Register</button>
                                </div>

                            </div>
                        </div>


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
                email: '',
                password: '',
                name: '',
                city: null,
                country: null,
                file: null,
                imageType: null,
                fileName: 'Profile Photo',
                token: null
            }
        },
        mounted: function() {

        },
        methods: {
            fileSelected: function(event) {
                  this.file = event.target.files[0];
                  this.fileName = event.target.files[0].name;
                  this.imageType = event.target.files[0].type;
            },
            userRegister: function() {
                if (!this.validEmail(this.email)) {
                    alert("You must enter a valid email first!")
                }
                else if (this.name == '') {
                    alert("You must enter a name!")
                }
                else if (this.password == '') {
                    alert("You must enter a password")
                }
                else {
                    let userData = {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    };
                    if (this.city != null) {
                        userData.city = this.city;
                    }
                    if (this.country != null) {
                        userData.country = this.country;
                    }
                    this.$http.post('http://localhost:4941/api/v1/users/register',
                        userData)
                        .then((response) => {
                            this.userLogin();
                            this.$router.push('/').catch((err) => {});
                        })
                        .catch((err) => {
                            alert(err)
                            this.error = err;
                            this.errorFlag = true;
                        });
                }
            },
            userLogin: function() {
                this.$http.post('http://localhost:4941/api/v1/users/login', { email: this.email, password: this.password})
                    .then((response) => {
                        this.token = response.data.token;
                        this.$cookies.set('token', response.data.token);
                        this.$cookies.set('userId', response.data.userId);
                        if (this.file != null) {
                            this.uploadPhoto();
                        }
                    })
                    .catch((err) => {
                        this.error = err;
                        this.errorFlag = true;
                    });
            },
            uploadPhoto: function() {
                console.log(this.$cookies.get('token'));
                this.$http.put('http://localhost:4941/api/v1/users/' + this.$cookies.get('userId') + '/photo',
                     this.file,
                    { headers: {"X-Authorization": this.$cookies.get('token'),
                        "Content-Type": this.imageType }})
                    .then((response) => {

                    }).catch((err) => {
                        this.error = err;
                        this.errorFlag = true;
                });
            },
            validEmail: function (email) {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

        }

    };
</script>


