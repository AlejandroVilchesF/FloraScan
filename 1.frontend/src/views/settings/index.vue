<template>
  <div>
    <BlockFull title="Credentials" class="mb-2">
      <template v-slot:content>
          <div class="row">
            <div class="col-12 col-md-4">
              <Input v-model="username" label="Username" id="test-user" type="text" icon="fas fa-user"></Input>
            </div>
            <div class="col-12 col-md-4">
              <Input v-model="password" label="Password" id="test-password" type="password" icon="fas fa-key"></Input>
            </div>
          </div>
      </template>
    </BlockFull>
    <BlockFull title="Email service" class="mb-2">
      <template v-slot:content>
        <div>
          <h6 class="text-primary">Test email</h6>
          <div class="row">
            <div class="col-12 col-md-4">
              <Input v-model="message" label="Message" id="test-message" type="text" icon="fas fa-envelope"></Input>
            </div>
            <div class="col-12 col-md-4">
              <Input v-model="recipient" label="Recipient" id="test-recipient" type="text" icon="fas fa-address-book"></Input>
            </div>
          </div>
          <div class="d-flex justify-content-start">
            <button class="btn btn-success me-2" @click="sendMail" :disabled="isBusy">
              <i class="fas fa-envelope"></i>
              <span>{{ ' Send mail' }}</span>
            </button>
            <Spinner v-if="isSending"></Spinner>
          </div>
        </div>
      </template>
    </BlockFull>    
  </div>
</template>

<script>
import Input from '../../components/commons/Input.vue';
import BlockFull from '../../components/commons/BlockFull.vue';
import MailerService from '../../services/MailerService';

import Spinner from '../../components/commons/Spinner.vue';
export default {
  name: "settings",
  data() {
    return {
      message: null,
      recipient: null,
      username: null,
      password: null,
      isSending: false,
      isResetting: false,
      isChecking: false,
      isSaving: false,
      isDeleting: false
    };
  },
  components: {
    Input,
    BlockFull,
    Spinner
  },
  mounted() {},
  computed: {
    isBusy: function(){
      return this.isSending || this.isResetting || this.isChecking || this.isSaving || this.isDeleting;
    }
  },
  methods: {
    async sendMail(){
      this.isSending = true;
      try{
        await MailerService.sendTestEmail(this.username, this.password, this.recipient, this.message);
        this.isSending = false;
        this.resetCredentials();
      }catch(err){
        this.isSending = false;
        console.log(err);
        this.resetCredentials();
      }
    },
    resetCredentials(){
      this.username = null;
      this.password = null;
    }
  },
  
};
</script>