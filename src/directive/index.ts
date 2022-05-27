import { App } from 'vue'

const directives = import.meta.globEager('./**.ts')

export default {
  install(app: App) {
    Object.keys(directives).forEach((it) => {
      const directive = directives[it]
      app.use(directive.default as { install: any })
    })
  },
}
