<template>
  <v-card class="blue-grey darken-3 elevation-4">
    <v-card-title class="blue black--text" style="font-size: 20px; padding: 10px;">
      {{ project.id === null ? 'Novo projeto' : 'Editar Projeto' }}
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>

          <v-flex xs12>
            <v-text-field class="input-group--focused" label="Nome do projeto" v-model="project.name" required></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Responsável Administrativo" autocomplete v-model="project.administrative_responsible" :items="users" item-text="name" @select="selectedAdministrative"></v-select>
          </v-flex>

          <v-flex xs12>
            <v-select class="input-group--focused" label="Responsável Técnico" autocomplete v-model="project.technical_responsible" :items="users" item-text="name" @select="selectedTechnical"></v-select>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="project.start" prepend-icon="event" readonly required ></v-text-field>
              <v-date-picker locale="pt-BR" v-model="project.start" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data final" v-model="project.end" prepend-icon="event" readonly></v-text-field>
              <v-date-picker locale="pt-BR" v-model="project.end" no-title scrollable actions></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-text-field box class="input-group--focused" multi-line label="Descrição" v-model="project.description"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round class="blue" @click="createOrEditProject">
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
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'project-modal',
  data () {
    return {
      project: {
        administrative_responsible: null,
        description: '',
        end: null,
        id: null,
        name: '',
        sprints: [],
        start: null,
        tasks: [],
        technical_responsible: null
      },
      temp: {
        adm: '',
        tech: ''
      },
      menu_start: false,
      menu_end: false
    }
  },
  methods: {
    createOrEditProject () {
      this.urlTemps()
      this.project.id === null
        ? axios.post('project-list/', this.project).then(response => {
          console.log(response)
          this.$store.dispatch('GETPROJECTS')
          this.$emit('close')
        }).catch(error => console.log(error))
        : axios.put(`project-list/${this.project.id}/`, this.project).then(response => {
          this.$store.dispatch('GETPROJECTS')
          this.$emit('close')
        }).catch(error => console.log(error))
    },
    cancel () {
      this.$emit('close')
    },
    selectedAdministrative () {
      if (this.project.administrative_responsible) {
        this.temp.adm = `${axios.defaults.baseURL}user-list/${this.project.administrative_responsible.id}/`
      }
      return this.temp.adm
    },
    selectedTechnical () {
      if (this.project.technical_responsible) {
        this.temp.tech = `${axios.defaults.baseURL}user-list/${this.project.technical_responsible.id}/`
      }
      return this.temp.tech
    },
    urlTemps () {
      this.project.administrative_responsible = this.selectedAdministrative()
      this.project.technical_responsible = this.selectedTechnical()
    }
  },
  computed: {
    ...mapGetters({
      users: 'getUsers'
    })
  }
}
</script>

<style>

</style>
