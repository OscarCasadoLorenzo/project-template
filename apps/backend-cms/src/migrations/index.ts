import * as migration_20260201_114122 from './20260201_114122'

export const migrations = [
  {
    up: migration_20260201_114122.up,
    down: migration_20260201_114122.down,
    name: '20260201_114122',
  },
]
