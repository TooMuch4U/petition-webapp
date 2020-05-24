<template>
    <div>


        <div id="petition" class="container" v-if="petition != null">
            <div v-if="errorFlag" style="color: red;">
                {{ error }}
            </div>

            <div class="row">
                <div class="col-2"></div>
                <div class="col-10"><p class="text-left"><router-link :to="{ name: 'petitions' }">Back</router-link></p></div>

            </div>
            <div class="row">
                <div class="col-2"></div>

                <div class="col-8">
                    <h2 class="m-2">
                        {{ petition.title }}

                    </h2>
                </div>

                <div class="col-2"></div>
            </div>
            <div class="row" v-if="$cookies.get('userId') == petition.authorId && $cookies.get('token') != null">
                <div class="col-2"></div>

                <div class="col-8 border-top py-2">
                    <button type="button" v-on:click="setupEdit" class="btn btn-primary float-left mx-1" data-toggle="modal"
                            data-target="#editPetitionModal">Edit Petition</button>
                    <button type="button" v-on:click="setupDelete" class="btn btn-danger float-left" data-toggle="modal"
                            data-target="#deletePetitionModal">Delete</button>
                </div>

                <div class="col-2"></div>
            </div>

            <div class="row">
                <div class="col-2"></div>

                <div class="col-2 border-top">
                    <img v-if="authorImage.isLoaded" class="img-fluid" :src="authorImage.photo">

                </div>

                <div class="col-6 border-top">
                    <p class="text-left"><strong>Name:</strong> {{ petition.authorName }} <br>
                        <strong>City:</strong> {{ petition.authorCity }} <br>
                        <strong>Country:</strong> {{ petition.authorCountry }}
                    </p>
                </div>

                <div class="col-2"></div>
            </div>

            <div class="row">
                <div class="col-2">

                </div>
                <div class="col-5">

                    <p class="text-left"><strong>Signatures:</strong> {{ petition.signatureCount }} <br>
                        <strong>Category:</strong> {{ petition.category }} <br>
                        <strong>Created:</strong> {{ petition.createdDate }} <br>
                        <strong>Closing:</strong> {{ petition.closingDate }}
                    </p>
                </div>
                <div class="col-3 float-right">
                    <img class="img-fluid" :src="petitionPhoto.photo" v-if="petitionPhoto.isLoaded">
                </div>


                <div class="col-2">

                </div>
            </div>

            <div class="row">
                <div class="col-2">

                </div>

                <div class="col-8">

                    <p class="text-left">{{ petition.description }}</p>
                </div>

                <div class="col-2">

                </div>
            </div>

            <div class="row">
                <div class="col-2"></div>

                <div class="col-8">

                    <h3>Signatories
                        <button v-if="$cookies.get('token') == null || !isSigned" type="button"
                                class="btn btn-primary float-right" data-toggle="modal"
                                data-target="#signPetitionModal">Sign Petition</button></h3>
                </div>

                <div class="col-2"> </div>
            </div>

            <div v-if="imagesLoaded" class="row" v-for="user in signatures">
                <div class="col-2"></div>

                <div class="col-1 border-top">
                    <img :src="user.photo" class="img-fluid">
                </div>
                <div class="col-7 border-top">
                    <button v-if="$cookies.get('userId') == user.signatoryId" type="button"
                            class="btn btn-secondary float-right" data-toggle="modal"
                            data-target="#signPetitionModal">Delete</button>
                    <p class="text-left"><strong>Name:</strong> {{ user.name }}<br>
                    <strong>City:</strong> {{ user.city }}<br>
                        <strong>Country:</strong> {{ user.country }}</p>

                </div>

                <div class="col-2"> </div>
            </div>
            <div v-else>
                <p>Loading...</p>
            </div>

        </div>

        <div class="modal fade" id="signPetitionModal" tabindex="-1" role="dialog" aria-labelledby="createPetitionLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">

                    <div :key="updater" v-if="$cookies.get('token') == null">
                        <div class="modal-header">
                            <h5>Create Petition</h5>
                        </div>
                        <div class="modal-body">
                            <p>You must be logged in to sign a petition.
                                <router-link data-dismiss="modal" :to="{ name: 'login' }">Login</router-link></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>

                    <div v-else-if="!isSigned">
                        <div class="modal-header">
                            <h5>Sign Petition</h5>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to sign this petition?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Cancel
                            </button>
                            <button v-on:click="signPetition" data-dismiss="modal" class="btn btn-primary">Sign</button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="modal-header">
                            <h5>Remove Signature</h5>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to remove your signature from this petition?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Cancel
                            </button>
                            <button v-on:click="removeSignature" data-dismiss="modal" class="btn btn-danger">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="editPetitionModal" tabindex="-1" role="dialog" aria-labelledby="editPetitionLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header ">
                        <h5>Edit Petition</h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" v-if="editErrorFlag">
                            {{ this.editError }}
                        </div>
                        <div class="form-group row">
                            <label for="inputTitle" class="col-sm-4 col-form-label">Title</label>
                            <div class="col-sm-8">
                                <input type="text" v-model="newTitle" class="form-control" id="inputTitle">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputDescription" class="col-sm-4 col-form-label">Description</label>
                            <div class="col-sm-8">
                                <textarea  v-model="newDesc" class="form-control" id="inputDescription" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputCategory" class="col-sm-4 col-form-label">Category<span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <select v-model="newCat" class="form-control" id="inputCategory">
                                    <option v-for="cat in categories" :value="cat.name">
                                        {{ cat.name }}
                                    </option>
                                </select>

                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="inputDate" class="col-sm-4 col-form-label">Closing Date</label>
                            <div class="col-sm-8">
                                <input class="form-control" v-model="newDate" type="datetime-local" id="inputDate">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="customFile" class="col-sm-4 col-form-label">Hero Photo</label>
                            <div class="custom-file col-sm-7 offset-1">

                                <input type="file" class="custom-file-input"  accept="image/jpg image/jpeg image/png image/gif" @change="fileSelected" id="customFile">
                                <label class="custom-file-label">{{ newFileName }}</label>
                            </div>
                        </div>
                        <div v-if="newPhoto != null" class="form-group row">
                            <label for="customFile" class="col-sm-3 col-form-label"></label>
                            <div class="custom-file col-sm-3 offset-1">

                                <img :src="newPhoto" class="img-fluid h-100">
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
            </div>
        </div>
        <div class="modal fade" id="deletePetitionModal" tabindex="-1" role="dialog" aria-labelledby="deletePetitionLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header ">
                        <h5>Delete Petition</h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" v-if="deleteErrorFlag">
                            {{ this.deleteError }}
                        </div>

                        <p>Are you sure you want to delete this petition?</p>


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Cancel
                        </button>
                        <button v-on:click="deletePetition" class="btn btn-danger">Delete</button>
                    </div>

                </div>
            </div>
        </div>
    </div>



</template>

<script>
    import moment from 'moment';
    export default {
        data (){
            return {
                error: "",
                editError: "",
                editErrorFlag: false,
                errorFlag: false,
                categories: null,
                petition: null,
                signatures: null,
                isSigned: false,
                petitionPhoto: {
                    isLoaded: false,
                    photo: null
                },
                defaultPhoto: require("./assets/default.jpg"),
                imagesLoaded: false,
                authorImage: {
                    isLoaded: false,
                    photo: null
                },
                newCat: null,
                newTitle: null,
                newPhoto: null,
                newPhotoBinary: null,
                newFileName: null,
                newFileType: null,
                newDesc: null,
                newDate: null,
                catDict: {},
                deleteErrorFlag: false,
                deleteError: ""
            }
        },
        mounted: function() {
            this.getOnePetition(this.$route.params.id);
            this.setPetitionPhoto(this.$route.params.id, this.petitionPhoto);
            this.getSignatures(this.$route.params.id);
            this.getCategories();

        },
        methods: {
            getOnePetition: function(id) {
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id)
                    .then((response) => {
                        this.petition = response.data;
                        this.setUserPhoto(response.data.authorId, this.authorImage)
                    })
                    .catch((error) => {
                        console.log(error);
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getSignatures: function(id) {
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id + '/signatures')
                    .then((response) => {
                        this.signatures = response.data;
                        this.setIsSigned();
                        this.setSignaturePhotos()
                    })
            },
            setIsSigned: function() {
                this.isSigned = false;
                for (let i = 0; i < this.signatures.length; i++) {
                    if (this.signatures[i].signatoryId == this.$cookies.get('userId')) {
                        this.isSigned = true;
                    }
                }

            },
            signPetition: function() {
                let userId = this.$cookies.get("userId");
                let token = this.$cookies.get('token');
                if (this.petition.authorId != userId) {
                    this.$http.post(`http://localhost:4941/api/v1/petitions/${this.$route.params.id}/signatures`,
                        {},
                        { headers: {"X-Authorization": token}})
                        .then((response) => {
                            let now = moment();
                            let nowString = now.format();
                            this.$http.get(`http://localhost:4941/api/v1/users/${userId}`)
                                .then((response) => {

                                    this.signatures.push({
                                        "signatoryId": userId,
                                        "name": response.data.name,
                                        "city": response.data.city,
                                        "country": response.data.country,
                                        "signedDate": nowString
                                    });
                                    this.isSigned = true;
                                }).catch((err) => {})

                        })
                        .catch((err) => {
                            alert(err)
                        })
                }
                else {
                    alert("You can't remove your signature from your own petition!")
                }
            },
            removeSignature: function() {
                let userId = this.$cookies.get("userId");
                let token = this.$cookies.get("token");
                if (this.petition.authorId != userId) {
                    if (this.checkDate()) {
                        this.$http.delete(`http://localhost:4941/api/v1/petitions/${this.$route.params.id}/signatures`,
                            { headers: {"X-Authorization": token}})
                            .then((response) => {
                                let sig;
                                for (let i = 0; i < this.signatures.length; i++) {
                                    sig = this.signatures[i];
                                    if (sig.signatoryId == userId) {
                                        this.signatures.splice(i, 1);
                                    }
                                }
                                this.setIsSigned();

                            })
                            .catch((err) => {
                                alert(err)
                            })
                    }
                    else {
                        alert('You cant remove your signature from a petition that has closed')
                    }
                }
                else {
                    alert("You can't remove your signature from your own petition!")
                }
            },
            checkDate: function() {
                let petDateString = this.petition.closingDate;
                if (petDateString != null) {
                    let now = moment();
                    let petDate = moment(petDateString, moment.ISO_8601);
                    if (petDate.diff(now) > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            },
            setSignaturePhotos: function() {
                let that = this;
                let defCount = 0;
                let asyncCount = 0;
                let asyncFinish = 0;
                for (let i = 0; i < this.signatures.length; i++) {
                    let userId = this.signatures[i].signatoryId;
                    this.$http.get(`http://localhost:4941/api/v1/users/${userId}/photo`, { responseType: "blob"})
                        .then((response) => {
                            asyncCount++;
                            let reader = new FileReader();
                            reader.onloadend = function() {
                                that.signatures[i].photo = reader.result;
                                asyncFinish++;
                                if ((asyncFinish + defCount) == that.signatures.length) {
                                    that.imagesLoaded = true;
                                }
                            };
                            reader.readAsDataURL(response.data);
                        }).catch((err) => {
                            that.signatures[i].photo = this.defaultPhoto;
                            defCount++;
                            if ((asyncFinish + defCount) == this.signatures.length) {
                                that.imagesLoaded = true;
                            }
                        });
                }

            },
            setUserPhoto: function(userId, imageTuple) {
                let that = this;
                this.$http.get(`http://localhost:4941/api/v1/users/${userId}/photo`, { responseType: "blob"})
                    .then((response) => {
                        let reader = new FileReader();
                        reader.onloadend = function() {
                            imageTuple.photo = reader.result;
                            imageTuple.isLoaded = true;
                        };
                        reader.readAsDataURL(response.data);
                    }).catch((err) => {
                        imageTuple.photo = this.defaultPhoto;
                        imageTuple.isLoaded = true;
                    });
            },
            getCategories: function() {
                this.$http.get('http://localhost:4941/api/v1/petitions/categories')
                    .then((response) => {
                        this.categories = response.data;
                        for (let i = 0; i < this.categories.length; i++) {
                            this.catDict[this.categories[i].name] = this.categories[i].categoryId
                        }
                    }).catch((err) => {});


            },
            setPetitionPhoto: function(petId, imageTuple) {
                this.$http.get(`http://localhost:4941/api/v1/petitions/${petId}/photo`, { responseType: "blob"})
                    .then((response) => {
                        let reader = new FileReader();
                        reader.onloadend = function() {
                            imageTuple.photo = reader.result;
                            imageTuple.isLoaded = true;
                        };
                        reader.readAsDataURL(response.data);
                    }).catch((err) => {
                    imageTuple.photo = this.defaultPhoto;
                    imageTuple.isLoaded = true;
                });
            },
            setupEdit: function() {
                this.newTitle = this.petition.title;
                this.newCat = this.petition.category;
                this.newDesc = this.petition.description;
                this.newDate = this.petition.closingDate;
                this.newPhoto = this.petitionPhoto.photo;
                this.newFileName = null;
                this.newFileType = null;
                this.editError = "";
                this.editErrorFlag = false;
            },
            fileSelected: function() {
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
                this.newFileName = event.target.files[0].name;
                this.newFileType = event.target.files[0].type;
            },
            setupDelete: function() {
                this.deleteError = "";
                this.deleteErrorFlag = false;
            },
            deletePetition: function() {
                let petId = this.$route.params.id;
                let token = this.$cookies.get('token');
                this.$http.delete(`http://localhost:4941/api/v1/petitions/${petId}`,
                    { headers: { "X-Authorization": token }})
                    .then((response) => {
                        $('#deletePetitionModal').modal('hide');
                        this.$router.push({ name: 'petitions'});
                    })
                    .catch((err) => {
                        this.deleteError = err.response.statusText;
                        this.deleteErrorFlag = true;
                    });
            },

            makeChanges: function() {
                let newData = {};

                if (this.newTitle != this.petition.title) {
                    if (this.newTitle != null && this.newTitle != "") {
                        newData.title = this.newTitle;
                    }
                    else {
                        this.editError = "The title field can't be empty!";
                        this.editErrorFlag = true;
                        return
                    }
                }
                if (this.newDesc != this.petition.description) {
                    if (this.newDesc != null && this.newDesc != "") {
                        newData.description = this.newDesc;
                    }
                    else {
                        this.editError = "The description field can't be empty!";
                    }
                }
                if (this.newCat != this.petition.category) {
                    newData.categoryId = this.catDict[this.newCat];
                }
                if (this.newDate != this.petition.closingDate) {
                    newData.closingDate = this.newDate;
                }

                let petId = this.$route.params.id;
                let token = this.$cookies.get('token');
                if (Object.keys(newData).length > 0) {
                    this.$http.patch(`http://localhost:4941/api/v1/petitions/${petId}`, newData,
                        { headers: { "X-Authorization": token }})
                        .then((response) => {
                            this.petition.title = (newData.title != null ? newData.title : this.petition.title);
                            this.petition.description = (newData.description != null ? newData.description : this.petition.description);
                            this.petition.closingDate = (newData.closingDate != null ? newData.closingDate : this.petition.closingDate);
                            this.petition.category = (newData.categoryId != null ? this.newCat : this.petition.category);

                            if (this.newPhoto != this.petitionPhoto.photo) {
                                this.$http.put(`http://localhost:4941/api/v1/petitions/${petId}/photo`, this.newPhotoBinary,
                                    { headers: {
                                            "X-Authorization": token,
                                            "Content-Type": this.newFileType }})
                                    .then((response) => {
                                        this.petitionPhoto.photo = this.newPhoto;
                                        $('#editPetitionModal').modal('hide');
                                    }).catch((err) => {
                                    this.editError = err.response.statusText;
                                    this.editErrorFlag = true;
                                })
                            }
                            else {
                                $('#editPetitionModal').modal('hide');
                            }
                        })
                        .catch((err) => {
                            this.editError = err.response.statusText;
                            this.editErrorFlag = true;

                        })
                }
                else if (this.newPhoto != this.petitionPhoto.photo) {
                    this.$http.put(`http://localhost:4941/api/v1/petitions/${petId}/photo`, this.newPhotoBinary,
                        { headers: {
                                "X-Authorization": token,
                                "Content-Type": this.newFileType }})
                        .then((response) => {
                            this.petitionPhoto.photo = this.newPhoto;
                            $('#editPetitionModal').modal('hide');
                        }).catch((err) => {
                            this.editError = err.response.statusText;
                            this.editErrorFlag = true;
                        })
                }
                else {
                    $('#editPetitionModal').modal('hide');
                }
            },





        }
    };
</script>

