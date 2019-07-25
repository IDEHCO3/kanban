<template>
  <v-flex xs6 sm4 md3>
    <v-card :class="tabColor">
      <v-card-text class="text-xs-center black--text">{{ name }}</v-card-text>
        <v-layout row wrap style="display:block; padding: 1px;">
          <div v-for="(item, index) in tasks" :key="index">
            <v-flex xs12 class="mb-1" >
              <v-card class="secondary ma-1 dark" >
                <v-card-title>{{ item.name }}</v-card-title>
                <v-card-text>
                  <v-icon>event</v-icon>
                  {{ item.started.split('-').reverse().join('/')}}
                  <div v-if="item.due" style="display:inline;">
                  <v-icon>event_available</v-icon>
                   {{ item.due.split('-').reverse().join('/')}}
                  </div>
                  <v-icon v-else> event_busy </v-icon>
                </v-card-text>
              </v-card >
            </v-flex>
          </div>
          <div v-if="tasks.length === 0">
            <v-flex xs12 class="mb-1" >
              <v-card class="secondary ma-1 dark" >
                <v-card-title>Nenhuma tarefa {{ name }} neste mês</v-card-title>
              </v-card >
            </v-flex>
          </div>
        </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'month-tasks',
  props: ['month', 'name', 'tasks', 'tabColor'],
  data () {
    return {
    }
  },
  created () {

  }
}
</script>

<style scoped>

</style>
