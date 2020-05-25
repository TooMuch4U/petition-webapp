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

        <div class="row my-3">
            <div class="col-2"></div>
            <label for="sort" class="col-1 col-form-label">Sort By:</label>
            <div class="col-sm-2">
                <select v-model="sortBy" v-on:change="getPetitions" class="form-control" id="sort">
                    <option value="SIGNATURES_DESC">Number of signatures descending</option>
                    <option value="SIGNATURES_ASC">Number of signatures ascending</option>
                    <option value="ALPHABETICAL_DESC">Alphabetically by title, Z - A</option>s
                    <option value="ALPHABETICAL_ASC">Alphabetically by title, A - Z</option>

                </select>
            </div>
            <label for="searchCategory" class="col-1 col-form-label">Filter:</label>
            <div class="col-sm-2">
                <select v-model="filterCat" v-on:change="getPetitions" class="form-control" id="searchCategory">

                    <option disabled>Category Filter</option>
                    <option selected :value="null">All</option>
                    <option v-for="cat in categories" :value="cat.categoryId">
                        {{ cat.name }}
                    </option>
                </select>
            </div>

            <div class="col-sm-2">
                <input type="text" v-model="searchTerm" v-on:input="getPetitions" class="form-control" @keyup.enter="getPetitions" id="inputSearch" placeholder="Search">
            </div>
        </div>

        <div class="row my-2">
            <div class="col-2"></div>
            <div class="col-8">
                <button class="btn btn-outline-dark" v-if="page != 1" v-on:click="changePage(1)">1</button>
                <button class="btn btn-outline-dark" v-if="page > 2">...</button>
                <button class="btn btn-outline-dark" v-if="page > 2" v-on:click="changePage(page-1)"><</button>
                <button class="btn btn-dark" disabled >{{ page }}</button>
                <button class="btn btn-outline-dark" v-if="(numPages - page) > 1" v-on:click="changePage(page + 1)">></button>
                <button class="btn btn-outline-dark" v-if="(numPages - page) > 1">...</button>
                <button class="btn btn-outline-dark" v-if="page != numPages" v-on:click="changePage(numPages)">{{ numPages }}</button>
            </div>
            <div class="col-2"></div>
        </div>

        <div class="row text-left" v-for="petition in petitions">
            <div class="col-2"></div>
            <div class="col-2 border-top py-1">
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
        <div class="row my-2">
            <div class="col-2"></div>
            <div class="col-8">
                <button class="btn btn-outline-dark" v-if="page != 1" v-on:click="changePage(1)">1</button>
                <button class="btn btn-outline-dark" v-if="page > 2">...</button>
                <button class="btn btn-outline-dark" v-if="page > 2" v-on:click="changePage(page-1)"><</button>
                <button class="btn btn-dark" disabled >{{ page }}</button>
                <button class="btn btn-outline-dark" v-if="(numPages - page) > 1" v-on:click="changePage(page + 1)">></button>
                <button class="btn btn-outline-dark" v-if="(numPages - page) > 1">...</button>
                <button class="btn btn-outline-dark" v-if="page != numPages" v-on:click="changePage(numPages)">{{ numPages }}</button>
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
                fileName: '',
                searchTerm: null,
                filterCat: null,
                sortBy: "SIGNATURES_DESC",
                page: (this.$route.query.p == null ? 1 : parseInt(this.$route.query.p)),
                total: null,
                numPages: 1,
                allPetitions: null
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

                let queryStrings = "";
                if (this.searchTerm != null && this.searchTerm != "") {
                    queryStrings = 'q=' + this.searchTerm
                }
                if (this.filterCat != null) {
                    if (queryStrings != "") {
                        queryStrings = queryStrings + "&categoryId=" + this.filterCat;
                    }
                    else {
                        queryStrings = "categoryId=" + this.filterCat;
                    }

                }
                if (queryStrings == "") {
                    queryStrings = "sortBy=" + this.sortBy;
                } else {
                    queryStrings = queryStrings + "&sortBy=" + this.sortBy;
                }
                let url = 'http://localhost:4941/api/v1/petitions';
                if (queryStrings != '') {
                    url = url + '?' + queryStrings;
                }

                this.$http.get(url)
                    .then((response) => {
                        this.allPetitions = response.data;
                        this.total = response.data.length;
                        this.changePage(this.page);
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
            },
            changePage: function(num) {
                this.page = num;
                let count = 10;
                let start = (count * (this.page - 1));
                this.numPages = Math.ceil(this.total/count);
                this.petitions = this.allPetitions.slice(start, (start + count));
            }
        }
    };
</script>

<style>
    .btn:focus, .btn:active {
        outline: none !important;
        box-shadow: none !important;
    }
</style>