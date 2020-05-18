<template>
  <div class="header-container">
    <img class="header-icon__left" src="@/assets/images/leftIcon.png">
    <div>{{title}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: document.title

    }
  }
}
</script>
<style lang='less' scoped>
.header-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #ffffff;
  padding: 0 32px;
  box-sizing: border-box;

  .header-icon__left{
    position: absolute;
    left: 32px;
    width: 40px;
    height: 40px;
  }
}
</style>
