<template>
  <v-app id="inspire">
    <div>
      <v-app-bar color="indigo" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Cefalo Interview System</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu left bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item  v-for="n in 1" :key="n" @click="logoutButton">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>

    <v-navigation-drawer width="310" class="mx-auto" v-model="drawer" absolute temporary>
      <v-toolbar color="indigo" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="ml-3">Room Users</v-toolbar-title>

        <v-spacer></v-spacer>
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
              <v-icon class="mr-10" color="green">mdi-circle</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>

    <!-- <v-content>
      <FrontPage />
    </v-content>-->
  </v-app>
</template>


<script>
//import FrontPage from "./components/FrontPage";
//import io from "socket.io-client";
import { hostname, socket } from "./assets/variables";
import axios from "axios";

export default {
  name: "App",
  
  components: {},

  data() {
    return {
      drawer: "false",
      joinCode: "",
      role: null,
      items: []
    };
  },
  created() {
    this.drawer = false;
  },
  mounted() {
    //this.socket = io.connect(hostname);
    
    var roomCode = localStorage.getItem("joinCode");

    socket.emit("join-connect", {
       roomCode: roomCode
    });

    socket.on("online-users", data => {
      this.items = [];

      if(localStorage.getItem('username')){
      data.forEach(item => {
        this.items.push({
          avatar: "https://p7.hiclipart.com/preview/123/735/760/computer-icons-physician-login-medicine-user-avatar.jpg",
          title: item.username,
          role: item.role
        });
        this.items.push({ divider: true, inset: true });
      });
      }
    });
  },
  methods: {
    submitClicked() {},
    logoutButton() {
      this.items = [];
      if(!localStorage.getItem("username")) return;

      const username = localStorage.getItem("username");
      const joinCode = localStorage.getItem("joinCode");
      const role = localStorage.getItem("role");

      axios
        .get(
          hostname +
            "/logout?username=" +
            username +
            "&code=" +
            joinCode +
            "&role=" +
            role
        )
        .then(() => {
          //localStorage.removeItem("username");
          //localStorage.removeItem("joinCode");
          //localStorage.removeItem("role");
          this.$router.push("/");
        });
    }
  }
};
</script>
