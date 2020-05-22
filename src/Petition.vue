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
                    <h2 class="m-2">{{ petition.title }}</h2>
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

                    <h3>Signatories</h3>
                </div>

                <div class="col-2"> </div>
            </div>

            <div class="row" v-for="user in signatures">
                <div class="col-2"></div>

                <div class="col-1 border-top">
                    <img :src="getUserPhoto(user.signatoryId)" class="img-fluid">
                </div>
                <div class="col-7 border-top">

                    <p class="text-left"><strong>Name:</strong> {{ user.name }}<br>
                    <strong>City:</strong> {{ user.city }}<br>
                    <strong>Country:</strong> {{ user.country }}</p>
                </div>

                <div class="col-2"> </div>
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
                petition: null,
                signatures: {}
            }
        },
        mounted: function() {
            this.getOnePetition(this.$route.params.id)
        },
        methods: {
            getOnePetition: function(id) {
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id)
                    .then((response) => {
                        console.log(response.data);
                        this.petition = response.data;
                        this.getSignatures(this.$route.params.id)
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
                    })
            },
            getUserPhoto: function(userId) {

                let image = '';


                if (image == 'hi') {
                    image = '/assets/default.jpg';
                }

                return 'http://localhost:4941/api/v1/users/' + userId + '/photo';
            }
        }
    };
</script>

