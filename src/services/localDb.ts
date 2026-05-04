import type { ICitizen, IFamily, IHealthCondition } from '@/types/citizen'
import Dexie, { type Table } from 'dexie'

export class LocalDatabase extends Dexie {
  citizens!: Table<ICitizen>
  families!: Table<IFamily>
  health_conditions!: Table<IHealthCondition>

  constructor () {
    super('ePetLocalDb')
    this.version(2).stores({
      citizens: 'id, name, cpf, cns, familyId, riskClass',
      families: 'id, householdId, familyCode, riskClass',
      health_conditions: 'id, individualId, label',
    })
  }
}

export const db = new LocalDatabase()
