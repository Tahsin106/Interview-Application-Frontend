<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-layout row class="mr-12 mt-10" wrap justify-space-between>
          <v-flex xs0 sm0 md1></v-flex>

          <v-flex xs12 sm8 md5 class="mt-1 mr-12">
            <div style="width: 580px;">
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

                    <div class="mt-9">
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
                      >Test</v-btn>
                      <v-btn
                        v-else
                        style="margin-right: 15px"
                        bottom
                        absolute
                        focusable
                        right
                        small
                        color="grey"
                      >Test</v-btn>
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
                      </span>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-flex>

          <!-- Chat -->
          <v-flex xs12 sm8 md5 class="ml-12">
            <v-card max-width="610px" class="elevation-12" color="indigo lighten-4">
              <v-toolbar dark color="indigo darken-1">
                <v-toolbar-title>Messages</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-list ref="chat" id="logs">
                  <template v-for="(item, index) in logs">
                    <v-subheader v-if="item" :key="index">{{item.username}}: {{item.message}}</v-subheader>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-form @submit.prevent="submit">
                  <v-layout row>
                    <v-flex class="ml-5" xs12>
                      <v-text-field v-model="msg" label="Message" single-line solo-inverted></v-text-field>
                    </v-flex>

                    <v-flex class="ml-6" xs6 order-lg2>
                      <v-btn dark class="mb-2" color="indigo" type="submit">
                        <v-icon dark>mdi-send</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>

                  <!-- <v-text-field v-model="msg" label="Message" single-line solo-inverted></v-text-field>
                  <v-btn dark small color="indigo" type="submit">
                    <v-icon dark>mdi-send</v-icon>
                  </v-btn>-->
                </v-form>
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
                  <span class="headline mt-4 font-regular ml-2">Test</span>
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
import io from "socket.io-client";
import { hostname } from "../assets/variables";
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
      valid: true,
      addQuestionButtonVisible: false,
      dialog: false,
      editDialog: false,
      questionEditBox: null,
      socket: null,
      progress: false,
      panel: [1],
      logs: [],
      msg: null,
      code: null,
      outputBox: [],
      questionBox: [],
      language: null,
      inputBox: null,
      languageId: {
        C: "48",
        "C++": "54",
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
            this.msg = cm.getLine(cm.getCursor().line).trim();
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
    if (localStorage.getItem("role") == "Candidate")
      this.cmOptions.readOnly = false;
    else this.cmOptions.readOnly = true;

    if (localStorage.getItem("role") == "Interviewer")
      this.addQuestionButtonVisible = true;
    else this.addQuestionButtonVisible = false;

    this.socket = io.connect(hostname);

    this.socket.on("chat", data => {
      this.logs.push(data);
      // this.who.push(data.username);
      //console.log(data);
    });

    this.socket.on("logs", data => {
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

      this.socket.emit("chat", {
        username: me,
        message: this.msg,
        role: role
      });

      //this.logs.push(me+': '+this.msg);
      this.msg = "";
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
          //console.log(res.data);
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
                  // console.log(res.data.stdout);
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
          }, 4000);
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

      this.socket.emit("question", {
        question: this.questionEditBox
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
    this.$refs.myCm.codemirror.on("keyup", () => {
      if (localStorage.getItem("role") == "Candidate") {
        this.socket.emit("code", {
          code: this.code
        });
      }
    });

    this.socket.on("code-rcv", data => {
      this.code = data.code;
    });

    this.socket.on("question-rcv", data => {
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
</style>