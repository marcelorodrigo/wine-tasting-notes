// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // You may add custom flat configs here (see docs)
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // Example: allow console.log
      'no-console': 'off'
    }
  }
)
