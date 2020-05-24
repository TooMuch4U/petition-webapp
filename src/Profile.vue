<template>
    <div>
        <div id="profile" v-if="user" class="container">
            <div v-if="$cookies.get('token') != null">
                <div class="row text-center">
                    <div class="col-6 offset-3">
                        <h3>Profile</h3>
                        <div class="alert alert-success" v-if="successFlag">
                            Password updated successfully
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2"></div>
                    <img v-if="curPhoto" class="img-fluid col-2" :src="curPhoto">
                    <img v-else class="img-fluid col-2" :src="defaultPhoto">
                    <div class="col-6 text-left">

                        <p> Name: {{ user.name }}<br/>
                            Email: {{ user.email }}<br/>
                            City: {{ user.city  }}<br/>
                            Country: {{ user.country }}</p>
                        <button type="button" class="btn btn-primary float-left" v-on:click="setupModal" data-toggle="modal" data-target="#editProfileModal">
                            Edit Profile
                        </button>
                    </div>
                    <div class="col-2"></div>
                </div>

            </div>

            <div class="row" v-else>
                <div class="col-6 offset-3">
                    <h3>Profile</h3>
                    <p class="float-left">You first need to log in to view your profile. Would you like to login? <router-link :to="{ name: 'login' }">Login</router-link></p>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editProfileModal" tabindex="-1" role="dialog" aria-labelledby="editProfileLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div v-if="$cookies.get('token')">
                        <div class="modal-header ">
                            <h5>Edit Profile</h5>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger" v-if="errorFlag">
                                {{ this.error }}
                            </div>
                            <div class="form-group row">
                                <label for="inputName" class="col-sm-4 col-form-label">Name</label>
                                <div class="col-sm-8">
                                    <input type="text" v-model="newName" class="form-control" id="inputName">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputEmail" class="col-sm-4 col-form-label">Email</label>
                                <div class="col-sm-8">
                                    <input type="text" v-model="newEmail" class="form-control" id="inputEmail">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputCity" class="col-sm-4 col-form-label">City</label>
                                <div class="col-sm-8">
                                    <input type="text" v-model="newCity" class="form-control" id="inputCity" >
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputCountry" class="col-sm-4 col-form-label">Country</label>
                                <div class="col-sm-8">
                                    <input type="text" v-model="newCountry" class="form-control" id="inputCountry" >
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="customFile" class="col-sm-4 col-form-label">User Photo</label>
                                <div class="custom-file col-sm-7 offset-1">

                                    <input type="file" class="custom-file-input"  accept="image/jpg image/jpeg image/png image/gif" @change="fileSelected" id="customFile">
                                    <label class="custom-file-label">{{ fileName }}</label>
                                </div>
                            </div>
                            <div v-if="newPhoto != null" class="form-group row">
                                <label for="customFile" class="col-sm-3 col-form-label"></label>
                                <div class="custom-file col-sm-3 offset-1">

                                    <img :src="newPhoto" class="img-fluid h-100">
                                </div>
                                <button v-on:click="deletePhoto" class="btn btn-danger ml-5">Remove</button>
                            </div>
                            <div class="form-group row">
                                <label for="inputPassword" class="col-sm-4 col-form-label">New Password</label>
                                <div class="col-sm-8">
                                    <input type="password" v-on:input="passwordChanged" v-on:cancel="passwordChanged"  @change="passwordChanged" v-model="newPassword" class="form-control" id="inputPassword" >
                                </div>
                            </div>
                            <div class="form-group row" v-if="!curPasswordHidden">
                                <label for="inputCurPassword" class="col-sm-4 col-form-label">Current Password</label>
                                <div class="col-sm-8">
                                    <input type="password" v-model="curPassword" class="form-control" id="inputCurPassword" >
                                </div>
                            </div>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Cancel
                            </button>
                            <button v-on:click="makeChanges" class="btn btn-primary">Confirm</button>
                        </div>

                    </div>

                    <div v-else>
                        <div class="modal-header">
                            <h5>Create Petition</h5>
                        </div>
                        <div class="modal-body">
                            <p>You must be logged in to make a petition.
                                <router-link data-dismiss="modal" :to="{ name: 'login' }">Login</router-link></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data (){
            return {
                successFlag: false,
                user: null,
                curPhoto: null,
                error: '',
                errorFlag: false,
                newPhoto: null,
                newPhotoBinary: null,
                newName: null,
                newEmail: null,
                newCity: null,
                newCountry: null,
                newPassword: null,
                curPassword: null,
                fileName: null,
                fileType: null,
                curPasswordHidden: true,
                defaultPhoto: require("./assets/default.jpg")

            }
        },
        mounted: function() {
            this.getUserInfo();
        },
        methods: {
            deletePhoto: function() {},
            makeChanges: function() {
                let newData = {};
                // Check and set name
                if (this.newName != this.user.name) {
                    if (this.newName != '' && this.newName != null) {
                        newData.name = this.newName;
                    }
                    else {
                        this.error = "The name field can't be empty!";
                        this.errorFlag = true;
                        return
                    }
                }

                if (this.newEmail != this.user.email) {
                    if (this.validEmail(this.newEmail)) {
                        newData.email = this.newEmail;
                    }
                    else {
                        this.error = 'You must enter a valid email!';
                        this.errorFlag = true;
                        return
                    }
                }

                if (this.newCity != this.user.city) {
                    newData.city = this.newCity;
                }

                if (this.newCountry != this.user.country) {
                    newData.country = this.newCountry;
                }

                if (this.newPassword != null && this.newPassword != '') {
                    if (this.curPassword != null && this.curPassword != '') {
                        newData.password = this.newPassword;
                        newData.currentPassword = this.curPassword
                    }
                    else {
                        this.error = "Current password must be provided when the password is being changed!";
                        this.errorFlag = true;
                        return
                    }
                }

                // If anything new for text data
                let userId = this.$cookies.get('userId');
                let token = this.$cookies.get('token');
                if (Object.keys(newData).length > 0) {
                    this.$http.patch(`http://localhost:4941/api/v1/users/${userId}`, newData,
                        { headers: {"X-Authorization": token }})
                        .then((response) => {
                            this.user.name = (newData.name != null ? newData.name : this.user.name);
                            this.user.email = (newData.email != null ? newData.email : this.user.email);
                            this.user.city = (newData.city != null ? newData.city : this.user.city);
                            this.user.country = (newData.country != null ? newData.country : this.user.country);

                            if (newData.password != null) {
                                this.successFlag = true;
                            }
                            else {
                                this.successFlag = false;
                            }

                            if (this.newPhoto != this.curPhoto) {
                                if (this.newPhoto == null) {
                                    this.$http.delete(`http://localhost:4941/api/v1/users/${userId}/photo`,
                                        { headers: { "X-Authorization": token }})
                                        .then((response) => {
                                            this.setPhotoDefault();
                                            $('#editProfileModal').modal('hide');
                                        })
                                        .catch((error) => {
                                            this.error = `Deleting photo failed: ${error.response.statusText}`;
                                            this.errorFlag = true;
                                        });

                                }
                                else {
                                    // Upload new photo
                                    this.$http.put(`http://localhost:4941/api/v1/users/${userId}/photo`,
                                        this.newPhotoBinary,
                                        { headers: { "X-Authorization": token,
                                                "Content-Type": this.fileType}})
                                        .then((response) => {
                                            this.curPhoto = this.newPhoto;
                                            $('#editProfileModal').modal('hide');

                                        })
                                        .catch((error) => {
                                            this.error = `Setting photo failed: ${error.response.statusText}`;
                                            this.errorFlag = true;
                                        })
                                }
                            } else {
                                $('#editProfileModal').modal('hide');
                            }

                        })
                        .catch((err) => {
                            this.error = err.response.statusText;
                            this.errorFlag = true;
                        })
                }
                else {
                    // Photo might be edited
                    if (this.newPhoto != this.curPhoto) {
                        if (this.newPhoto == null) {
                            this.$http.delete(`http://localhost:4941/api/v1/users/${userId}/photo`,
                                { headers: { "X-Authorization": token }})
                                .then((response) => {
                                    this.setPhotoDefault();
                                    $('#editProfileModal').modal('hide');
                                })
                                .catch((error) => {
                                    this.error = `Deleting photo failed: ${error.response.statusText}`;
                                    this.errorFlag = true;
                                });

                        }
                        else {
                            // Upload new photo
                            this.$http.put(`http://localhost:4941/api/v1/users/${userId}/photo`,
                                this.newPhotoBinary,
                                { headers: { "X-Authorization": token,
                                        "Content-Type": this.fileType}})
                                .then((response) => {
                                    this.curPhoto = this.newPhoto;
                                    $('#editProfileModal').modal('hide');
                                })
                                .catch((error) => {
                                    this.error = `Setting photo failed: ${error.response.statusText}`;
                                    this.errorFlag = true;
                                })
                        }
                    } else {
                        $('#editProfileModal').modal('hide');
                    }
                    this.successFlag = false;
                }




            },
            getUserInfo: function() {
                let that = this;
                let token = this.$cookies.get('token');
                let userId = this.$cookies.get('userId');
                if (token != null) {
                    this.$http.get(`http://localhost:4941/api/v1/users/${userId}`,
                        { headers: { "X-Authorization": token }})
                        .then((response) => {
                            this.user = response.data;
                            this.newName = this.user.name;
                            this.newEmail = this.user.email;
                            this.newCity = this.user.city;
                            this.newCountry = this.user.country;
                        })
                        .catch((error) => {
                            this.errorFlag = true;
                            this.error = error;
                        })
                    this.$http.get(`http://localhost:4941/api/v1/users/${userId}/photo`, { responseType: "blob"})
                        .then((response) => {

                            var reader = new FileReader();
                            reader.onloadend = function() {
                                that.curPhoto = reader.result;
                                that.newPhoto = reader.result;
                            };
                            reader.readAsDataURL(response.data);



                        }).catch((err) => {
                            this.setPhotoDefault();
                    })

                }
            },
            fileSelected: function(event) {
                let that = this;
                let file = document
                    .querySelector('input[type=file]')
                    .files[0];
                let reader = new FileReader();
                reader.onloadend = function(e) {
                    that.newPhoto = e.target.result;
                };
                reader.readAsDataURL(file);

                let reader2 = new FileReader();
                reader2.onloadend = function(e) {
                    that.newPhotoBinary = e.target.result;
                };
                reader2.readAsArrayBuffer(file);
                this.fileName = event.target.files[0].name;
                this.fileType = event.target.files[0].type;
            },
            deletePhoto: function() {
                this.newPhoto = null;
                this.fileName = null;
                this.fileType = null;
            },
            setupModal: function() {
                this.newPhoto = this.curPhoto;
                this.newName = this.user.name;
                this.newEmail = this.user.email;
                this.newCity = this.user.city;
                this.newCountry = this.user.country;
                this.newPassword = null;
                this.curPassword = null;
                this.curPasswordHidden = true;
            },
            passwordChanged: function() {
                if (this.newPassword == '' || this.newPassword == null) {
                    this.curPasswordHidden = true;
                }
                else {
                    this.curPasswordHidden = false;
                }
            },
            validEmail: function (email) {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            setPhotoDefault: function() {
                this.curPhoto = null;
            }
        }
    }
</script>

<style scoped>

</style>