import { readCollection, writeCollection } from '@/adapters/localStorageRepository';
import { STORAGE_KEYS, MAX_STORED_RECORDS } from '@/adapters/constants';
import type { MedicalLeavesRepositoryPort } from '@/domain/ports';
import type { MedicalLeave } from '@/types/domain';

export const medicalLeavesRepository: MedicalLeavesRepositoryPort = {
  list(): MedicalLeave[] {
    return readCollection<MedicalLeave>(STORAGE_KEYS.medicalLeaves);
  },
  save(record: MedicalLeave, existing: MedicalLeave[]): void {
    writeCollection(STORAGE_KEYS.medicalLeaves, [record, ...existing], MAX_STORED_RECORDS);
  },
};
