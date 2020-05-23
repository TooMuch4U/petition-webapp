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

            <div class="row">
                <div class="col-2"></div>

                <div class="col-2 border-top">
                    <img class="img-fluid" :src="'http://localhost:4941/api/v1/users/' + petition.authorId + '/photo'">

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
                    <img class="img-fluid" :src="'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'">
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

            <div class="row" v-for="user in signatures">
                <div class="col-2"></div>

                <div class="col-1 border-top">
                    <img :src="getUserPhoto(user.signatoryId)" class="img-fluid">
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
    </div>



</template>

<script>
    import moment from 'moment';
    export default {
        data (){
            return {
                error: "",
                errorFlag: false,
                petition: null,
                signatures: null,
                isSigned: false
            }
        },
        mounted: function() {
            this.getOnePetition(this.$route.params.id)
            this.getSignatures(this.$route.params.id)

        },
        methods: {
            getOnePetition: function(id) {
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id)
                    .then((response) => {
                        this.petition = response.data;

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
                        this.setIsSigned()
                    })
            },
            getUserPhoto: function(userId) {

                let image = '';


                if (image == 'hi') {
                    image = '/assets/default.jpg';
                }

                return 'http://localhost:4941/api/v1/users/' + userId + '/photo';
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
            }
        }
    };
</script>

