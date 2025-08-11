import { createApp } from 'vue'
import { ModuleRegistry } from 'ag-grid-community'
import { AllCommunityModule } from 'ag-grid-community'
import { TreeDataModule, RowGroupingModule } from 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue3'
import App from './App.vue'

ModuleRegistry.registerModules([
  AllCommunityModule,
  TreeDataModule,
  RowGroupingModule
])

const app = createApp(App)

app.component('AgGridVue', AgGridVue)

app.mount('#app')
