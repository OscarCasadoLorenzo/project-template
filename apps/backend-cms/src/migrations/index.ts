import * as migration_20260201_114122 from './20260201_114122'
import * as migration_20260201_121905 from './20260201_121905'

export const migrations = [
  {
    up: migration_20260201_114122.up,
    down: migration_20260201_114122.down,
    name: '20260201_114122',
  },
  {
    up: migration_20260201_121905.up,
    down: migration_20260201_121905.down,
    name: '20260201_121905',
  },
]
