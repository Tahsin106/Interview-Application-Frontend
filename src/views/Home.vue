<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-layout row class="mr-12 mt-10" wrap justify-start>
          <!-- <v-col xs0 sm0 md1></v-col> -->
          <!-- <v-col md = "1" lg = "1"></v-col> -->
          <v-flex xs0 sm0 md1></v-flex>

          <!-- Question+Code+Output -->

          <v-flex xs12 sm8 md5 class="mt-0 mr-12">
            <div style="width: 585px;">
              <v-expansion-panels dark v-model="panel" multiple>
                <v-expansion-panel>
                  <v-expansion-panel-header color="indigo">Question</v-expansion-panel-header>
                  <v-expansion-panel-content class="black--text pt-4" color="white">
                    <template v-for="(item,index) in questionBox">
                      <span :key="index">
                        {{item}}
                        <br />
                      </span>
                    </template>

                    <div class="mt-6">
                      <v-btn
                        v-if="addQuestionButtonVisible"
                        @click="editDialog = true"
                        style="margin-right: 15px"
                        bottom
                        absolute
                        focusable
                        right
                        small
                        color="indigo"
                      >
                        <span v-if="questionBox.length">Edit</span>
                        <span v-else>Add</span>
                      </v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header color="indigo">Code</v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4" color="white">
                    <div style="height:320px;width: 530px;" absolute>
                      <codemirror ref="myCm" v-model="code" :options="cmOptions"></codemirror>
                    </div>

                    <div class="mt-6">
                      <v-btn
                        v-if="!progress"
                        @click="testClick"
                        style="margin-right: 15px"
                        bottom
                        absolute
                        focusable
                        right
                        small
                        color="indigo"
                      >Run</v-btn>
                      <v-btn
                        v-else
                        style="margin-right: 15px"
                        bottom
                        absolute
                        focusable
                        right
                        small
                        color="grey"
                      >Run</v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header color="indigo">
                    Output
                    <div align="right" class="mr-3">
                      <v-progress-circular
                        size="23"
                        v-if="progress"
                        indeterminate
                        absolute
                        top
                        color="white"
                      ></v-progress-circular>
                    </div>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content class="black--text pt-4" color="white">
                    <template v-for="(item,index) in outputBox">
                      <span v-if="item" :key="index">
                        {{item}}
                        <br />
                        <br />
                        <span class="blue--text">Time: {{code_time}}s</span>
                        <br />
                        <span class="blue--text">Memory: {{code_memory}} KB</span>
                      </span>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-flex>

          <!-- Chat -->
          <v-flex xs12 sm8 md5 class="ml-12">
            <v-card height="676px" max-width="620px" class="elevation-12" color="indigo lighten-4">
              <v-toolbar dark color="indigo darken-1">
                <v-toolbar-title>Messages</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-list ref="chat" id="logs">
                  <template v-for="(item, index) in logs">
                    <v-icon v-if="!item.isSame" large color="blue" :key="'A'+index">person</v-icon>

                    <span v-if="item" :key="index">
                      <span
                        style="margin-left: -3px"
                        v-if="!item.isSame"
                        class="font-weight-bold indigo--text body-1"
                      >
                        {{item.username}}
                        <span class="grey--text body-2">{{item.time}}</span>
                      </span>
                      <p
                        v-if="!item.isHighlight"
                        class="body-1 black--text"
                        style="margin-left: 38px"
                        :style="item.isSame?'margin-top: -8px':'margin-top:-3px'"
                      >{{item.message}}</p>
                      <p
                        v-else
                        class="body-1 red--text"
                        :style="item.isSame?'margin-top: -8px':'margin-top:-3px'"
                        style="margin-left: 38px"
                      >{{item.message}}</p>
                    </span>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-row class="mb-3">
                  <v-col cols="9" class="ml-5">
                    <v-text-field
                      v-on:keyup.enter="submit"
                      @keypress="msg_color = null"
                      v-model="msg"
                      label="Message"
                      single-line
                      solo
                      :class="{ 'my-text-style': msg_color}"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="1" class="mt-1">
                    <v-btn medium dark color="indigo" @click="submit">
                      <v-icon dark>mdi-send</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- <v-text-field v-model="msg" label="Message" single-line solo-inverted></v-text-field>
                  <v-btn dark small color="indigo" type="submit">
                    <v-icon dark>mdi-send</v-icon>
                </v-btn>-->
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>

        <!-- dialog starts here -->

        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <div class="mt-3">
                  <span class="headline mt-4 font-regular ml-2">Run</span>
                </div>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="language"
                        :items="['C','C++', 'Java', 'Python 3' ,'Python 2', 'Javascript']"
                        :rules="[v => !!v || 'Language is required']"
                        label="Language"
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="inputBox"
                        clearable
                        clear-icon="mdi-close"
                        background-color="grey lighten-3"
                        color="cyan"
                        label="Input"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="indigo darken-3" text @click="dialog = false">Close</v-btn>
                <v-btn :disabled="!valid" color="indigo darken-3" text @click="runClick">Run</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <!-- Question Edit Dialog -->
        <v-row justify="center">
          <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <div class="mt-3">
                  <span
                    v-if="questionBox.length"
                    class="headline mt-4 font-regular ml-2"
                  >Edit Question</span>
                  <span v-else class="headline mt-4 font-regular ml-2">Add Question</span>
                </div>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="questionEditBox"
                      background-color="grey lighten-3"
                      color="cyan"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="indigo darken-3" text @click="editDialog = false">Close</v-btn>
                <v-btn color="indigo darken-3" text @click="questionSubmitButton">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
//import io from "socket.io-client";
import { hostname, socket } from "../assets/variables";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";
import "codemirror/theme/duotone-light.css";
import axios from "axios";

export default {
  name: "Home",
  components: {
    codemirror
  },
  data() {
    return {
      img: "https://ca.slack-edge.com/T7HRW0NMA-USV4PCNQ0-g434f592e18d-72",
      sp: " ",
      msg_color: null,
      valid: true,
      addQuestionButtonVisible: false,
      dialog: false,
      editDialog: false,
      questionEditBox: null,
      progress: false,
      panel: [1],
      logs: [],
      msg: null,
      code: null,
      outputBox: [],
      questionBox: [],
      language: null,
      inputBox: null,
      code_time: "Invalid",
      code_memory: "Invalid",
      languageId: {
        C: "48",
        "C++": "52",
        Java: "62",
        "Python 3": "71",
        "Python 2": "70",
        Javascript: "63"
      },
      languageMode: {
        C: "text/x-c++src",
        "C++": "text/x-c++src",
        Java: "text/x-java",
        "Python 3": "text/x-python",
        "Python 2": "text/x-python",
        Javascript: "text/javascript"
      },
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/x-c++src",
        theme: "duotone-light",
        lineNumbers: true,
        line: true,
        readOnly: false,
        configureMouse: (cm, repeat) => {
          if (repeat == "triple") {
            //alert(cm.getLine(cm.getCursor().line).trim());
            this.msg =
              1 +
              cm.getCursor().line +
              ": " +
              cm.getLine(cm.getCursor().line).trim();
            this.msg_color = "mdi-close";
            return { unti: "word" };
          } else if (repeat == "single") {
            return { unti: "char" };
          } else if (repeat == "double") {
            return { unti: "line" };
          }
        }
      }
    };
  },
  created() {
    //var date = new Date();
    //alert(date.getHours()+": "+("0"+date.getMinutes()).slice(-2));

    if (localStorage.getItem("role") == "Candidate")
      this.cmOptions.readOnly = false;
    else this.cmOptions.readOnly = true;

    if (
      localStorage.getItem("role") == "Interviewer" ||
      localStorage.getItem("role") == "Admin"
    )
      this.addQuestionButtonVisible = true;
    else this.addQuestionButtonVisible = false;

    //this.socket = io.connect(hostname);
    console.log(hostname);
    var roomCode = localStorage.getItem("joinCode");
    socket.emit("join", {
      roomCode: roomCode
    });

    socket.emit("join-connect", {
      roomCode: roomCode
    });

    socket.on("chat", data => {
      this.logs.push(data);
      // this.who.push(data.username);
      //console.log(data);
    });

    socket.on("logs", data => {
      data.forEach(item => {
        this.logs.push(item);
      });
      // this.who.push(data.username);
      //console.log(data);
    });
  },
  methods: {
    submit() {
      if (!this.msg) return;

      var me = localStorage.getItem("username");
      var role = localStorage.getItem("role");
      var roomCode = localStorage.getItem("joinCode");

      var isSame = false;
      if (this.logs.length >= 1) {
        if (me == this.logs[this.logs.length - 1].username) isSame = true;
      }

      var date = new Date();
      var time = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

      socket.emit("chat", {
        username: me,
        message: this.msg,
        role: role,
        roomCode: roomCode,
        isHighlight: this.msg_color,
        isSame: isSame,
        time: time
      });

      this.msg = "";
      this.msg_color = null;
    },
    testClick() {
      this.dialog = true;
    },
    runClick() {
      this.dialog = false;
      this.progress = true;

      axios
        .post(
          "https://api.judge0.com/submissions/?base64_encoded=false&wait=false",
          {
            source_code: this.code,
            language_id: this.languageId[this.language],
            stdin: this.inputBox
          }
        )
        .then(res => {
          setTimeout(() => {
            axios
              .get(
                "https://api.judge0.com/submissions/" +
                  res.data.token +
                  "?base64_encoded=false"
              )
              .then(res => {
                this.progress = false;

                if (res.data.status.description == "Accepted") {
                  this.code_time = res.data.time;
                  this.code_memory = res.data.memory;
                  this.outputBox = res.data.stdout.split("\n");

                  if (this.panel.find(x => x != 2)) {
                    this.panel.push(2);
                  }
                } else {
                  this.outputBox = [];
                  this.$swal(res.data.status.description, "", "error");
                }
              })
              .catch(err => {
                this.$swal("Compile Error", "", "error");
                this.outputBox = [];
                this.progress = false;
                console.log(err);
              });
          }, 3500);
        })
        .catch(err => {
          this.progress = false;
          this.$swal("Submission Error", "", "error");
          this.outputBox = [];
          console.log(err);
        });
    },
    questionSubmitButton() {
      this.editDialog = false;
      var roomCode = localStorage.getItem("joinCode");

      socket.emit("question", {
        question: this.questionEditBox,
        roomCode: roomCode
      });

      if (!this.questionEditBox) {
        this.questionBox = [];
        return;
      }

      this.questionBox = this.questionEditBox.split("\n");
    }
    // onCmCodeChange(newCode){

    // }
  },
  watch: {
    logs() {
      setTimeout(() => {
        this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight;
      }, 0);
    }
  },
  mounted() {
    console.log(this.$refs);
    
    this.$refs.myCm.codemirror.on("keyup", () => {
      if (localStorage.getItem("role") == "Candidate") {
        var roomCode = localStorage.getItem("joinCode");
        socket.emit("code", {
          code: this.code,
          roomCode: roomCode
        });
      }
    });

    socket.on("code-rcv", data => {
      this.code = data.code;
    });

    socket.on("question-rcv", data => {
      if (data.question) this.questionBox = data.question.split("\n");
      else this.questionBox = [];

      this.questionEditBox = data.question;

      if (this.questionBox.length) {
        if (this.panel.find(x => x != 0)) this.panel.push(0);
      }
    });
  }
};
</script>

<style scoped>
#logs {
  height: 480px;
  overflow: auto;
}
.my-text-style >>> .v-text-field__slot input {
  color: red;
}
</style>