<template>
  <v-card class="blue-grey darken-3 elevation-4">
    <v-card-title class="blue black--text" style="font-size: 20px; padding: 10px;">
      {{ sprint.code === '' ? 'Novo Sprint' : 'Editar Sprint' }}
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome do Sprint" v-model="sprint.code" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Responsável" autocomplete v-model="responsible" :items="users" item-text="name" ></v-select>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="sprint.start" prepend-icon="event" readonly required ></v-text-field>
              <v-date-picker locale="pt-BR" v-model="sprint.start" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data final" v-model="sprint.end" prepend-icon="event" readonly></v-text-field>
              <v-date-picker locale="pt-BR" v-model="sprint.end" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-text-field box class="input-group--focused" multi-line label="Descrição" v-model="sprint.description"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="createOrEditSprint">
        confirmar
      </v-btn>
      <v-btn round class="red lighten-2" @click="cancel">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'sprint-modal',
  data () {
    return {
      responsible: null,
      sprint: {
        tasks: [],
        impediments: [],
        id: null,
        code: '',
        start: '',
        end: '',
        responsible: '',
        project: ''
      },
      
      menu_start: false,
      menu_end: false
    }
  },
  methods: {
    createOrEditSprint () {
      this.sprint.responsible = `${axios.defaults.baseURL}user-list/${this.responsible.id}/`
       if (!this.sprint.id_sprint)  {
          axios.post('sprint-list/', this.sprint).then(response => {
          this.$store.dispatch('GETSPRINTS')
          this.$emit('close')
        }).catch(error => console.log(error))
        }
        else {
                    
          axios.put(`sprint-list/${this.sprint.id_sprint}/`, this.sprint).then(response => {
            //this.responsible = `${axios.defaults.baseURL}user-list/${this.sprint.responsible.id}/`
            this.$store.dispatch('GETSPRINTS')
            this.$emit('close')
          }).catch(error => console.log(error))
        }
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {
    ...mapGetters({
      users: 'getUsers'
    })
  },
  created () {
    
    if (this.sprint.responsible)
      this.responsible = `${axios.defaults.baseURL}user-list/${this.sprint.responsible.id}/`
  }
}
</script>

<style>

</style>
