<template>
    <div>


    <div id="petitions" class="container" >
        <div class="row">
            <div class="col-8 offset-2">
                <h2>
                    Petitions
                    <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#createPetitionModal">
                        Create Petition
                    </button>

                </h2>

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
                                <label for="inputTitle" class="col-sm-3 col-form-label">Title<span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <input type="text" v-model="newTitle" class="form-control" id="inputTitle" placeholder="title">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputCategory" class="col-sm-3 col-form-label">Category<span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <select v-model="newCategory" class="form-control" id="inputCategory">
                                        <option v-for="cat in categories" :value="cat.categoryId">
                                            {{ cat.name }}
                                        </option>
                                    </select>

                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputDescription" class="col-sm-3 col-form-label">Description<span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <textarea id="inputDescription" v-model="newDescription" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputDate" class="col-sm-3 col-form-label">Closing Date</label>
                                <div class="col-sm-9">
                                    <input class="form-control" v-model="newDate" type="datetime-local" value="2011-08-19T13:45:00" id="inputDate">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputDate" class="col-sm-3 col-form-label">Hero Photo<span class="text-danger">*</span></label>
                                <div class="custom-file col-sm-9">

                                    <input type="file" class="custom-file-input"  accept="image/jpg image/jpeg image/png image/gif" @change="fileSelected" id="customFile">
                                    <label class="custom-file-label">{{ fileName }}</label>
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
    import moment from 'moment';
    export default {
        data (){
            return {
                error: "",
                errorFlag: false,
                petitions: [],
                petition: [],
                categories: null,
                newTitle: null,
                newDescription: null,
                newCategory: null,
                newImage: null,
                imageType: null,
                newDate: null,
                fileName: ''
            }
        },
        mounted: function() {
            this.getPetitions();
            this.getCategories();
        },
        methods: {
            fileSelected: function(event) {
                console.log(event.target);
                this.newImage = event.target.files[0];
                this.fileName = event.target.files[0].name;
                this.imageType = event.target.files[0].type;
            },
            getPetitions: function() {
                this.$http.get('http://localhost:4941/api/v1/petitions')
                    .then((response) => {
                        this.petitions = response.data;
                    })
                    .catch((error) => {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getCategories: function() {
                this.$http.get('http://localhost:4941/api/v1/petitions/categories')
                    .then((response) => {
                        this.categories = response.data;
                    }).catch((err) => {});


            },
            uploadImage: function(petId) {
                this.$http.put(`http://localhost:4941/api/v1/petitions/${petId}/photo`,
                    this.newImage,
                    { headers: {
                        "X-Authorization": this.$cookies.get('token'),
                            "Content-Type": this.imageType }})
                    .then((response) => {}).catch((err) => {})
            },
            checkDate: function() {
                if (this.newDate != null) {
                    let now = moment();
                    let selectedDate = moment(this.newDate, moment.ISO_8601);
                    if (selectedDate.diff(now) > 0) {
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
            createPetition: function() {
                if (this.newTitle == null || this.title == '') {
                    alert('You need to enter a title first');
                }
                else if (this.newCategory == null) {
                    alert('You need to enter a title first');
                }
                else if (this.newImage == null) {
                    alert('You need to add an image first');
                }
                else if (!this.checkDate(this.newDate)) {
                    alert('The closing date must be in the future');
                }
                else {
                    let data = {
                        title: this.newTitle,
                        description: this.newDescription,

                        categoryId: this.newCategory
                    };
                    if (this.newDate != null) {
                        data.closingDate = this.newDate.replace('T', ' ')
                    }
                    this.$http.post('http://localhost:4941/api/v1/petitions',
                        data,
                        { headers: {"X-Authorization": this.$cookies.get('token')}})
                        .then((response) => {
                            let petId = response.data.petitionId;
                            this.uploadImage(petId);
                            this.$http.post(`http://localhost:4941/api/v1/petitions/${petId}/signatures`, {},
                                { headers: {
                                        "X-Authorization": this.$cookies.get('token')}})
                                .then((response) => {
                                    $('#createPetitionModal').modal('hide');
                                    this.$router.push({name: 'petition', params: { id: petId }});
                                })
                                .catch((err) => {});

                        }).catch((err) => {

                    });

                }
            }
        }
    };
</script>

