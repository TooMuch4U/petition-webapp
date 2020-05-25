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

            <div class="row mb-5 mt-4">
                <div class="col-2"></div>
                <div class="col-8">
                    Share
                    <div class="social">
                        <a target="_blank" :href="'https://www.facebook.com/sharer/sharer.php?link=' + 'http://localhost:8080' + $route.fullPath" id="share-fb" class="sharer button"><i class="fa fa-2x fa-facebook-square"></i></a>
                        <a target="_blank" :href="'https://twitter.com/intent/tweet?url=' + 'http://localhost:8080' + $route.fullPath" id="share-tw" class="sharer button"><i class="fa fa-2x fa-twitter-square"></i></a>
                        <a target="_blank" :href="'mailto:?subject=Check out my petition!&body=' + 'http://localhost:8080' + $route.fullPath" id="share-em" class="sharer button"><i class="fa fa-2x fa-envelope-square"></i></a>
                    </div>
                </div>
            </div>

        </div>


        <div class="modal fade" id="signPetitionModal" tabindex="-1" role="dialog" aria-labelledby="createPetitionLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">

                    <div  v-if="$cookies.get('token') == null">
                        <div class="modal-header">
                            <h5>Sign Petition</h5>
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
                                    this.imagesLoaded = false;
                                    this.setSignaturePhotos();
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


    document.addEventListener("DOMContentLoaded", function(event) {

// Uses sharer.js
//  https://ellisonleao.github.io/sharer.js/#twitter
        var url = window.location.href;
        var title = document.title;
        var subject = "Checkout my petition";
        var via = "yourTwitterUsername";
        //console.log( url );
        //console.log( title );

//facebook
        $('#share-wa').attr('data-url', url).attr('data-title', title).attr('data-sharer', 'whatsapp');
//facebook
        $('#share-fb').attr('data-url', url).attr('data-sharer', 'facebook');
//twitter
        $('#share-tw').attr('data-url', url).attr('data-title', title).attr('data-via', via).attr('data-sharer', 'twitter');
//linkedin
        $('#share-li').attr('data-url', url).attr('data-sharer', 'linkedin');
// google plus
        $('#share-gp').attr('data-url', url).attr('data-title', title).attr('data-sharer', 'googleplus');
        // email
        $('#share-em').attr('data-url', url).attr('data-title', title).attr('data-subject', subject).attr('data-sharer', 'email');

//Prevent basic click behavior
        $( ".sharer button" ).click(function() {
            event.preventDefault();
        });


// only show whatsapp on mobile devices
        var isMobile = false; //initiate as false
// device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

        if ( isMobile == true ) {
            $("#share-wa").hide();
        }







    });
</script>

