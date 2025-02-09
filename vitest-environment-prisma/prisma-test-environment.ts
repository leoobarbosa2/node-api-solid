import { Environment } from 'vitest'

export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Setup')

    return {
      teardown() {
        console.log('TearDown')
      },
    }
  },
} as Environment