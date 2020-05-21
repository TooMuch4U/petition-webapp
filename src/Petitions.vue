<template>
    <div>


    <div id="petitions" class="container" >
        <div class="row">
            <div class="col-12">
                <h2>Petitions</h2>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createPetitionModal">
                    Create Petition
                </button>
            </div>
        </div>

        <div class="row text-left" v-for="petition in petitions">
            <div class="col-2"></div>
            <div class="col-2 border-top">
                <img class="img-fluid" :src="'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'">
            </div>
            <div class="col-6 border-top ">

                <h5><router-link :to="{ name: 'petition', params: { id: petition.petitionId }}">{{ petition.title }}</router-link></h5>
                <p><strong>Author:</strong> {{ petition.authorName }}<br>
                    <strong>Category:</strong> {{ petition.category }}<br>
                <strong>Signatures:</strong> {{ petition.signatureCount }}</p>

            </div>
            <div class="col-2"></div>
        </div>
    </div>

        <div class="modal fade" id="createPetitionModal" tabindex="-1" role="dialog" aria-labelledby="createPetitionLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div v-if="$cookies.get('token')">
                        <div class="modal-header">
                            <h5>Create Petition</h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group row">
                                <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
                                <div class="col-sm-10">
                                    <input type="text" v-model="newTitle" class="form-control" id="inputTitle" placeholder="title">
                                </div>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Cancel
                            </button>
                            <button v-on:click="createPetition" class="btn btn-primary">Submit</button>
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
    export default {
        data (){
            return {
                error: "",
                errorFlag: false,
                petitions: [],
                petition: []
            }
        },
        mounted: function() {
            this.getPetitions();
        },
        methods: {
            getPetitions: function() {
                this.$http.get('http://localhost:4941/api/v1/petitions')
                    .then((response) => {
                        this.petitions = response.data;
                    })
                    .catch((error) => {
                        this.error = error;
                        this.errorFlag = true;
                    });
            }
        }
    };
</script>

