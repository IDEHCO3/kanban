<template>
  <v-layout row wrap class="text-xs-center">
    <v-flex xs12 sm8 offset-sm2 justify-space-between>
      <v-card class="blue-grey darken-3">
        <v-card-title>
          <v-card-text class="title">My Account</v-card-text>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="saveChanges">
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
            <v-layout row>
              <v-flex xs6 class="mr-2">
                <v-text-field
                  label="Senha atual"
                  v-model="oldPassword"
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="Nova Senha"
                  v-model="newPassword"
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :type="e1 ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text mb-2"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn class="cyan--text" type="submit">Salvar</v-btn>
            <v-btn class="cyan--text" @click="$router.go(-1)">Voltar</v-btn>
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
  name: 'user-account',
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
      oldPassword: '',
      newPassword: '',
      user: {}
    }
  },
  methods: {
    checkPassword () {
      return Base.encode(this.oldPassword) === this.user.password
    },
    async saveChanges () {
      if (!this.checkPassword()) {
        return this.errorDialog = true
      }
      try {
        await axios.put(`user-list/${this.user.id}/`, { ...this.user, password: Base.encode(this.newPassword) })
        const login = await axios.post('user-list/login/', {user_name: this.user.user_name, password: Base.encode(this.newPassword)})
        axios.defaults.headers.common['Authorization'] = `Bearer ${login.headers['x-access-token']}`
        this.$store.commit('login', {
          id: this.user.id,
          username: this.user.user_name,
          token: login.headers['x-access-token']
        })
        this.$store.dispatch('GETUSERS')
        this.$router.go(-1)
      } catch (error) {
        this.errorDialog = true
        console.log(error)
      }
    }
  },
  async mounted () {
    const user = await axios.get(`user-list/${this.$store.state.auth.id}/`)
    this.user = user.data
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
