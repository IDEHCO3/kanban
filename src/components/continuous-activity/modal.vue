<template>
  <v-card class="blue-grey darken-3 elevation-4">
    <v-card-title class="blue black--text" style="font-size: 20px; padding: 10px;">
      {{ continuousActivity.name === '' ? 'Nova Atividade Contínua' : 'Editar Atividade Contínua' }}
    </v-card-title>
    <v-card-text v-if="typeDominio">
      <v-container fluid>
        <v-layout row wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome da Atividade Contínua" v-model="continuousActivity.name" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select label="Tipo" v-model="continuousActivity.type" :items="typeDominio" item-text="dominio" item-value="id"  required></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="createOrContinuousActivity">
        confirmar
      </v-btn>
      <v-btn round class="red lighten-2" @click="close">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ContinuousActivity',
  data () {
    return {
      continuousActivity: {
        id: null,
        name: '',
        type: null
      },
      typeDominio: null
    }
  },
  methods: {
    close () {
      this.continuousActivity.id = null
      this.continuousActivity.name = ''
      this.continuousActivity.type = null
      this.$emit('close')
    },
    createOrContinuousActivity () {
      this.continuousActivity.id === null
        ? axios.post('type-continuous-activity-list/', this.continuousActivity).then(response => {
          this.$store.dispatch('GETCONTINUOUS')
          this.$emit('close')
        }).catch(error => console.log(error))
        : axios.put(`type-continuous-activity-list/${this.continuousActivity.id}/`, this.continuousActivity).then(response => {
          this.$store.dispatch('GETCONTINUOUS')
          this.$emit('close')
        }).catch(error => console.log(error))
    }
  },
  created () {
    axios.get('type-continuous-activity-list/type-dominio-list/').then(res => {
      this.typeDominio = res.data
    }).catch(error => console.log(error))
  }
}
</script>
<style scoped>
</style>
