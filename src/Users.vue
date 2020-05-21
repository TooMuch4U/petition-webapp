<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="$route.params.userId">
      <div id="user">

        <router-link :to="{ name: 'users'}">
          Back to Users
        </router-link>

        <br /><br />

        <table>
          <tr>
            <th>User ID</th>
            <th>Username</th>
          </tr>
          <tr>
            <td>{{ $route.params.userId }}</td>
            <td>{{ getSingleUser($route.params.userId).username }}</td>
          </tr>
        </table>

        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#deleteUserModal">
          Delete
        </button>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal">
          Edit
        </button>

      </div>
      <!-- Delete Modal-->
      <div class="modal fade" id="deleteUserModal" tabindex="-1" role="dialog" aria-labelledby="deleteUserModalLabel"
           aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteUserModalLabel">Delete User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="deleteUser($route.params.userId)">
                Delete User
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>

            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel"
           aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">

            <form v-on:submit="editUser($route.params.userId)">
              <div class="form-group row">
                <label for="staticId" class="col-sm-2 col-form-label">User Id</label>
                <div class="col-sm-10">
                  <input type="text" readonly class="form-control-plaintext" id="staticId" v-bind:value="$route.params.userId">
                </div>
              </div>
              <div class="form-group row">
                <label for="inputName" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                  <input type="text" v-model="new_username" class="form-control" id="inputName" v-bind:placeholder="getSingleUser($route.params.userId).username">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>

    <div v-else>
      <div id="users">
        <table>
          <tr v-for="user in users">
            <td>{{ user.username }}</td>
            <td><router-link :to="{ name: 'user', params: { userId: user.user_id }}">View</router-link></td>
          </tr>
        </table>
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
      users: [],
      new_username: ""
    }
  },
  mounted: function() {
    this.getUsers();
  },
  methods: {
    getUsers: function() {
      this.$http.get('http://localhost:8080/api/users')
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
    },
    getSingleUser: function(id) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].user_id == id) {
          return this.users[i];
        }
      }
    },
    deleteUser: function(user_id) {
      this.$http.get('http://localhost:8080/api/users/1');
      this.$http.delete('http://localhost:8080/api/users/' + user_id)
        .then((response) => {
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].user_id == user_id) {
              this.users.splice(i, 1);
            }
          }

          this.$router.push('/users').catch((err) => {});

        }).catch((error) => {
         this.error = error;
         this.errorFlag = true;
      });
    },
    editUser: function(user_id) {
      if (this.new_username == "") {
        alert("Username can't be empty")
      } else {
        this.$http.put('http://localhost:8080/api/users/' + user_id, {username: this.new_username})
          .then((response) => {

          }).catch((error) => {
          this.error = error;
          this.errorFlag = true;
        })
      }
    }

  }
};
</script>

