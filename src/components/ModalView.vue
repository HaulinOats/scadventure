<template>
  <div id="modal-window-outer" v-on:click.stop="closeModal">
    <div id="modal-window-inner" v-on:click.stop="">
      <p class="modal-message">{{modalMessage}}</p>
      <div v-if="modalConfirmation" class="confirmation-container">
        <div class="confirmation-container-inner">
          <button confirmChoice="true" v-on:click="confirmModal">OK</button>
          <button confirmChoice="false" v-on:click="confirmModal">Cancel</button>
          <div class="clearfix"></div>
        </div>
      </div>
      <div v-else class="confirmation-container">
        <div class="confirmation-container-inner">
          <button v-on:click="closeModal">OK</button>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"ModalView",
  data: function(){
    return {
      
    }
  },
  props:['modal-message', 'modal-confirmation'],
  methods: {
    closeModal:function(){
      this.$dispatch('hide-modal', false);
    },
    confirmModal:function(event){
      this.$dispatch('confirm-choice', event.target.attributes.confirmChoice.value);
    }
  }
}
</script>

<style>
#modal-window-outer {
  display:block;
  z-index: 11;
  position: fixed;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.4);
  left:0;
  top:0;
}
#modal-window-inner {
  position: absolute;
  width: 80%;
  height: auto;
  left: 10%;
  padding: 15px;
  top: 90px;
  background: white;
  border-radius: 5px;
}
.modal-message {
  font-size:22px;
  text-align: center;
  color:black;
}
.show-modal {
  display:block !important;
}
#modal-window-outer button {
}
.confirmation-container {
  width:auto;
  margin:0 auto;
}
.confirmation-container button {
  border: none;
  padding: 10px 40px;
  border-radius: 7px;
  box-shadow: 1px 1px 3px black;
  background: steelblue;
  color: white;
  outline:none;
  float:left;
  margin-left:20px;
}
.confirmation-container-inner {
  margin: 0 auto;
  display: table;
}
</style>
