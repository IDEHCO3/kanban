<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-if="projects">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="addProject">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar projeto..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <v-list >
          <v-list-tile v-for="(project, index) in pageProjects" :key="index" avatar>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="editProject(project)" >
                <v-icon dark color="yellow lighten-3">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="removeProject(project.id);">
                <v-icon dark color="red lighten-2">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="project.name" ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </v-flex>
    <v-dialog v-model="addOrEditProject" max-width="1200">
      <modal @close="addOrEditProject = false" ref="modal"></modal>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from 'axios'
import modal from './modal'
import { idFromUrl } from '@/utils/utils'

export default {
  name: 'project',
  components: { modal },
  data () {
    return {
      page: 1,
      addOrEditProject: false
    }
  },
  methods: {
    addProject () {
      Object.assign(this.$refs.modal.project, {
        administrative_responsible: null,
        description: '',
        end: null,
        id: null,
        name: '',
        sprints: [],
        start: null,
        tasks: [],
        technical_responsible: ''
      })
      this.openModal()
    },
    editProject (project) {
      const editProject = Object.assign({}, project)
      if (project.administrative_responsible) {
        editProject.administrative_responsible = this.$store.state.users.find(responsible => responsible.id === idFromUrl(project.administrative_responsible))
      }
      if (project.technical_responsible) {
        editProject.technical_responsible = this.$store.state.users.find(responsible => responsible.id === idFromUrl(project.technical_responsible))
      }
      this.$refs.modal.project = editProject
      this.openModal()
    },
    removeProject (id) {
      axios.delete(`project-list/${id}/`).then(response => this.$store.dispatch('GETPROJECTS'))
        .catch(error => console.log(error))
    },
    openModal () {
      this.addOrEditProject = true
    }
  },
  computed: {
    pages () {
      return this.projects.length > 10 ? Math.ceil(this.projects.length / 10) : 0
    },
    pageProjects () {
      const firstIndex = (this.page - 1) * 10
      const lastIndex = (this.page) * 10
      return this.projects.slice(firstIndex, lastIndex)
    },
    projects () {
      const projects = this.$store.state.projects
      if (!projects) return false
      return projects
    }
  },
  created () {
    if (this.$store.state.projects === null) {
      this.$store.dispatch('GETPROJECTS')
    }
  }
}
</script>

<style>

</style>
