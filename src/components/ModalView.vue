<template>
  <div id="modal-window-outer" v-bind:class="{ 'show-modal': isOpen }">
    <div id="modal-window-inner">
      <p class="modal-close-x" v-on:click="closeModal">X</p>
      <p class="modal-message"></p>
      <button v-on:click="closeModal">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  name:"ModalView",
  data: function(){
    return {
      isOpen:false
    }
  },
  methods: {
    closeModal:function(){
      console.log('closeModal:' + this.isOpen);
      this.isOpen = false;
      console.log(this.isOpen);
    }
  }
}
</script>

<style>
#modal-window-outer {
  display:none;
  z-index: 11;
  position: fixed;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.4);
  left:0;
  top:0;
}
#modal-window-inner {
  position:absolute;
  width:80%;
  height:auto;
  top:90px;
  background:white;
  border-radius: 5px;
}
.modal-close-x {
  position:absolute;
  top:0;
  right:0;
}
.show-modal {
  display:block;
}
</style>
