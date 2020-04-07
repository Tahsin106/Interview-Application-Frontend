<template>
  
  <v-app id="inspire">

    <div>
      <v-app-bar color="indigo" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Cefalo Interview System</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn> -->

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-menu left bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="n in 1" :key="n" @click="logoutButton">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>

    <v-navigation-drawer width="310" class="mx-auto" v-model="drawer" absolute temporary>
      <v-toolbar color="indigo" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Active Users</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list three-line>
        <template v-for="(item, index) in items">
          <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>

          <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

          <v-list-item v-else :key="item.title">
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <v-list-item-title v-text="item.role"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon class = "mr-10" color="green">mdi-circle</v-icon>
            </v-list-item-icon>

          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    

    <router-view></router-view>

    <!-- <v-content>
      <FrontPage />
    </v-content> -->
    
  </v-app>

  
</template>

<script>
//import FrontPage from "./components/FrontPage";

export default {
  name: "App",

  components: {
  },

  data() {
    return {
      drawer: "false",
      joinCode: '01688',
      role: null,
      items: [
        { header: "Online" },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: "Ferdous Mahmud",
          role: "Interviewer"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: "Raihan Ullah",
          role: "Interviewer"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: "Uttom Akash",
          role: "Interviewer"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: "Nafis Fuad",
          role: "Candidate"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: "Ibnul Tahsin",
          role: "Interviewer"
        }
      ]
    };
  },
  created() {
    this.drawer = false;
    //localStorage.setItem('joinCode','01688');
    //localStorage.setItem('role','Interviewer');    
  },
  methods:{
    submitClicked(){
        
    },
    logoutButton(){
      localStorage.removeItem('username');
      localStorage.removeItem('joinCode');
      localStorage.removeItem('role');
      this.$router.push('/');
    }
  }
};
</script>
