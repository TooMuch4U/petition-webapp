<template>
  <div>
    <navbar :key="componentKey"/>
    <div id="app">

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  export default {
    name: 'app',
    components: {
      navbar
    },
    data () {
      return {
        componentKey: 0
      };
    },
    methods: {
      forceRerender() {
        this.componentKey += 1;
      }
    },
    events: {
      eventName: function(data) {
        // do stuff
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .green-color {
    background-color: #42b983;
  }

</style>
