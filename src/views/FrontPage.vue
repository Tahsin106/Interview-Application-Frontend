<template>
  <v-container mt-8>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/cefalo-logo.png')" class="my-5" contain height="140" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to Cefalo Interview System</h1>
        <p
          class="subheading font-weight-regular title"
        >Interactive Interview Application for Cefalo Interviewers and Candidates</p>
      </v-col>
    </v-row>

    <div align="center">
      <v-btn @click="joinClicked" color="indigo" height="40" dark>Join Now</v-btn>
    </div>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="justify-center">
            <div class="mt-3">
              <v-icon large color="indigo darken-3">mdi-message-text</v-icon>
              <span class="headline mt-4 font-regular ml-2">Join Interview</span>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="username"
                    label="Name*"
                    :rules="nameRules"
                    :counter="15"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="joinCode"
                    label="Room Code Number*"
                    :rules="passRules"
                    :counter="10"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="role"
                    :items="['Interviewer', 'Candidate', 'Admin']"
                    :rules="[v => !!v || 'Role is required']"
                    label="Role"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <small>*If you are entering as an Admin you are creating a Room with above Room Code</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-3" text @click="dialog = false">Close</v-btn>
            <v-btn :disabled="!valid" color="indigo darken-3" text @click="joinFormButton">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
//import io from "socket.io-client";
import { hostname, socket } from "../assets/variables";
import axios from "axios";

export default {
  name: "FrontPage",
  data: () => ({
    username: null,
    joinCode: null,
    dialog: false,
    role: null,
    valid: true,
    socket: null,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 15) || "Name must be less than 15 characters"
    ],
    passRules: [
      v => !!v || "Code is required",
      v => (v && v.length <= 10) || "Code must be less than 10 characters"
    ]
  }),
  methods: {
    joinClicked() {
      this.dialog = true;
    },
    joinFormButton() {
      this.dialog = false;
      localStorage.setItem("username", this.username);
      localStorage.setItem("joinCode", this.joinCode);
      localStorage.setItem("role", this.role);

      const username = localStorage.getItem("username");
      const joinCode = localStorage.getItem("joinCode");
      const role = localStorage.getItem("role");

      axios
        .get(
          hostname +
            "/join_room?username=" +
            username +
            "&code=" +
            joinCode +
            "&role=" +
            role
        )
        .then(() => {
          this.$router.push("/home");
        })
        .catch((err) => {
          this.$swal(err.response.data, "", "error");
        });
    }
    // validateForm() {
    //     this.$refs.form.validate();
    // }
  },
  created() {
    //console.log("this: " + hostname);
    //this.socket = io.connect(hostname);
    var roomCode = localStorage.getItem("joinCode");

    socket.emit("join-connect", {
      roomCode: roomCode
    });

    localStorage.removeItem("username");
    localStorage.removeItem("joinCode");
    localStorage.removeItem("role");
  }
};
</script>
