<template>
    <v-layout row wrap class="text-xs-center">
    <v-flex xs12 sm8 offset-sm2 justify-space-between>
      <v-card class="blue-grey darken-3">
        <v-card-title>
          <v-card-text class="title">REGISTER</v-card-text>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="register">
            <v-layout row>
              <v-flex xs5 class="mr-2">
                <v-text-field
                  label="Nome do Usuário" v-model="user.user_name" :rules="emptyField"
                  append-icon="account_box" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
              <v-flex xs7>
                <v-text-field
                  label="Nome" v-model="user.name" :rules="emptyField"
                  append-icon="fa-id-card" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  label="@email" v-model="user.email" :rules="emailRules"
                  append-icon="email" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row >
              <v-flex xs6 class="mr-2">
                <v-text-field
                  label="Senha"
                  v-model="user.password"
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="Confirmar Senha"
                  v-model="passwordConfirm"
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text mb-2"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn class="cyan--text" type="submit">Registrar</v-btn>
          </form>
          <v-dialog v-model="errorDialog" >
            <v-btn icon @click.native="errorDialog = false" dark>
              <v-icon text-xs-left>close</v-icon>
            </v-btn>
            <v-card class="blue-grey darken-3 text-xs-center">
              <div class="headline text-xs-center red--text pa-2">ERRO</div>
              <v-card-text class="blue--text">Por favor, verifique se as informações estão corretas.</v-card-text>
            </v-card>
          </v-dialog>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { Base } from '@/utils/base'

export default {
  name: 'register',
  data () {
    return {
      e1: false,
      errorDialog: false,
      emptyField: [
        v => {
          return !!v || 'Este campo é obrigatório'
        }
      ],
      emailRules: [
        v => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido'
      ],
      passwordConfirm: '',
      user: {
        continuous_activities: [],
        sprints: [],
        tasks: [],
        name: null,
        user_name: null,
        email: null,
        description: null,
        role: 'user'
      }
    }
  },
  methods: {
    lastCharIsBar (anUrl) {
      if (anUrl != null) {
        return anUrl.slice(-1) === '/'
      }
      return false
    },
    idFromUrl (anUrl) {
      if (anUrl === null) {
        return -1
      }
      let i = this.lastCharIsBar(anUrl) ? 1 : 0
      return parseInt(anUrl.split('/').reverse()[i])
    },
    register () {
      let url = 'user-list/register/'
      if (this.user.password !== this.passwordConfirm || this.user.password === null || this.user.user_name === null) {
        this.errorDialog = true
      } else {
        this.user.password = Base.encode(this.user.password)
        axios.post(url, this.user).then(response => {
          if (response.status === 201) {
            this.user.id = this.idFromUrl(response.headers['content-location'])
            this.$store.commit('login', {
              username: this.user.user_name,
              token: response.headers['x-access-token']
            })
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.$store.state.token}`
            this.$router.push('/kanban/')
          }
        }).catch(error => console.log(error))
      }
    }
  }
}
</script>

<style scoped>
  .title {
    font-family: 'Architects Daughter';
    font-size: 3em !important;
    color: #00b2cc;
  }
</style>
