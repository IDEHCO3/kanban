<template>
  <div class="home">
    <img src="@/../static/kanban_background.png" alt="">
    <h2 class="black--text">Visualize e planeje seus projetos, tarefas, atividades etc! <br></h2>
    <span class="version">Alpha Version</span>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style>
  .home {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .version {
    position: absolute;
    bottom: 15px;
    right: 20px;
    color: #FFF;
  }
  img {
    position: relative;
    height: 900px;
    width: auto;
  }
  h2 {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style>
