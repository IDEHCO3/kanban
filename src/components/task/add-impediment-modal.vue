<template>
  <v-card >
    <v-card-title class="green white--text" style="font-size: 20px; padding: 10px;">
      Adicionar Impedimento
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field label="Nome" required v-model="impediment.name"></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field label="Descrição" required v-model="impediment.description"></v-text-field>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_created"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data do impedimento" v-model="impediment.created_date" prepend-icon="event" readonly></v-text-field>
              <v-date-picker  v-model="impediment.created_date" no-title scrollable actions>
              </v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_resolution"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data da solução" v-model="resolution_date" prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="resolution_date" no-title scrollable actions>
              </v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-select label="Sprint" autocomplete v-model="impediment.sprint" :items="sprints" item-text="code" @select="selectedSprint"></v-select>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round  class="blue" @click="createImpediment">
        Confirmar
      </v-btn>
      <v-btn round  class="red lighten-2" @click="close">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'add-impediment-modal',
  data () {
    return {
      impediment: {
        name: '',
        description: '',
        created_date: '',
        sprint: null,
        task: ''
      },
      resolution_date: null,
      temp: {
        sprint: ''
      },
      menu_created: false,
      menu_resolution: false
    }
  },
  methods: {
    createImpediment () {
      this.impediment.sprint = this.temp.sprint
      if (this.resolution_date) this.impediment.resolution_date = this.resolution_date
      axios.post('impediment-list/', this.impediment).then(res => {
        this.$store.dispatch('GETTASKS')
        this.$emit('close')
      }).catch(error => console.log(error))
    },
    close () {
      this.impediment = {
        name: '',
        description: '',
        created_date: '',
        sprint: null,
        task: null
      }
      this.resolution_date = null
      this.$emit('close')
    },
    selectedSprint () {
      if (this.impediment.sprint.id !== null) {
        this.temp.sprint = `${axios.defaults.baseURL}sprint-list/${this.impediment.sprint.id}/`
      }
    }
  },
  computed: {
    ...mapGetters({
      sprints: 'getSprints'
    })
  }
}
</script>
<style scoped>
</style>
