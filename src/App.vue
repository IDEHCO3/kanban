<template>
  <v-app dark id="app">

    <v-navigation-drawer clipped fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.title" :to="item.route" exact>
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar  color="blue-grey darken-3" app fixed dense clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-spacer></v-spacer>

      <div v-if="loggedUser" class="blue--text"> {{ loggedUser.toUpperCase() }} </div>

      <v-menu offset-x left absolute :nudge-width="100">
        <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-toolbar-title>

        <v-list>

          <v-list-tile v-if="loggedUser" to="my_account">
            <v-list-tile-title class="blue--text"> Minha Conta </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="loggedUser" @click="logout">
            <v-list-tile-title class="red--text"> Logout </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'login'" to="register">
            <v-list-tile-title class="blue--text"> Registrar </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$route.name == 'register'" to="login">
            <v-list-tile-title class="blue--text"> Login </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <main>
      <v-content>
        <v-layout justify-center style="padding: 20px">
          <router-view></router-view>
        </v-layout>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      drawer: true,
      items: [
        {title: 'Gestão de atividades', route: '/kanban/', icon: 'home', color: 'white'},
        {title: 'Projetos', route: '/kanban/project', icon: 'format_list_numbered', color: 'blue'},
        {title: 'Tarefas', route: '/kanban/task', icon: 'list', color: 'green'},
        {title: 'Sprints', route: '/kanban/sprint', icon: 'motorcycle', color: 'yellow'},
        {title: 'Tipo atividade contínua/extra etc', route: '/kanban/continuous_activity', icon: 'assignment', color: 'orange'},
        {title: 'Tarefas por usuarios', route: '/kanban/user_tasks', icon: 'account_box', color: 'teal lighten-4'}
      ]
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push('/kanban/login')
    }
  },
  computed: {
    ...mapGetters(['loggedUser'])
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
