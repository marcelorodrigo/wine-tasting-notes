import { usePreferencesStore } from '../stores/preferences'

export default defineNuxtPlugin(() => {
  const preferences = usePreferencesStore()
  preferences.initialize()
})
