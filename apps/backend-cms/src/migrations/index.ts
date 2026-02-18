import * as migration_20260201_114122 from './20260201_114122'
import * as migration_20260201_121905 from './20260201_121905'
import * as migration_20260213_125744 from './20260213_125744'
import * as migration_20260218_081729 from './20260218_081729'
import * as migration_20260218_082740 from './20260218_082740'

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
    up: migration_20260213_125744.up,
    down: migration_20260213_125744.down,
    name: '20260213_125744',
  },
  {
    up: migration_20260218_081729.up,
    down: migration_20260218_081729.down,
    name: '20260218_081729',
  },
  {
    up: migration_20260218_082740.up,
    down: migration_20260218_082740.down,
    name: '20260218_082740',
  },
]
