import * as migration_20260201_114122 from './20260201_114122'
import * as migration_20260201_121905 from './20260201_121905'
import * as migration_20260201_125342 from './20260201_125342'
import * as migration_20260201_163045 from './20260201_163045'

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
  {
    up: migration_20260201_125342.up,
    down: migration_20260201_125342.down,
    name: '20260201_125342',
  },
  {
    up: migration_20260201_163045.up,
    down: migration_20260201_163045.down,
    name: '20260201_163045',
  },
]
