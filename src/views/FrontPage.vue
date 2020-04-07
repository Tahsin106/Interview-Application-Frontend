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
        <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
        </template>-->
        <v-card>
          <v-card-title class="justify-center">
            <div class = "mt-3">
             <v-icon large color="indigo darken-3">mdi-message-text</v-icon>
            <span class="headline mt-4 font-regular ml-2">Join Interview</span>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" :lazy-validation="lazy">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="username" label="Name*" :rules="nameRules" :counter="15" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="joinCode" label="Room Code Number*" :rules="passRules" :counter="10" type="password" required ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
    
                  <v-select
                    v-model="role"
                    :items="['Interviewer', 'Candidate']"
                    :rules="[v => !!v || 'Role is required']"
                    label="Role"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <small>*indicates required field</small>
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
import {hostname} from '../assets/variables'

export default {
  name: "FrontPage",
  data: () => ({
    username:null,
    joinCode:null,
    dialog: false,
    role: null,
    valid: true,
    nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 15) || 'Name must be less than 15 characters',
    ],
    passRules:[
        v => !!v || 'Code is required',
        v => (v && v.length <= 10) || 'Code must be less than 10 characters',
    ]
  }),
  methods: {
    joinClicked() {
      this.dialog = true;
      //this.$router.push("/home");
    },
    joinFormButton(){
      this.dialog = false;
      localStorage.setItem('username',this.username);
      localStorage.setItem('joinCode',this.joinCode);
      localStorage.setItem('role',this.role); 
      this.$router.push('/home');
    }
    // validateForm() {
    //     this.$refs.form.validate();
    // }
  },
  created(){
   console.log('this: '+hostname);
  }
};
</script>
