import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const config: Config = {
  testEnvironment: 'node',
  ...createDefaultPreset()
}

export default config
