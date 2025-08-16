import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to allow imports like "package@1.2.3" or "@scope/pkg@1.2.3"
function stripVersionedImports() {
  return {
    name: 'strip-versioned-imports',
    async resolveId(source: string, importer: string | undefined, options: any) {
      const lastAt = source.lastIndexOf('@')
      if (lastAt > 0) {
        const before = source.slice(0, lastAt)
        const after = source.slice(lastAt + 1)
        if (/^\d/.test(after)) {
          const stripped = before
          return this.resolve(stripped, importer, { ...options, skipSelf: true })
        }
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [stripVersionedImports() as any, react()],
})


