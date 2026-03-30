// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.opencode/**', '_bmad/**', '_bmad-output/**', 'README.md']
})
