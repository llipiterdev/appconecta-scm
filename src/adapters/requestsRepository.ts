import { readCollection, writeCollection } from '@/adapters/localStorageRepository';
import { STORAGE_KEYS, MAX_STORED_RECORDS } from '@/adapters/constants';
import type { RequestsRepositoryPort } from '@/domain/ports';
import type { EmployeeRequest } from '@/types/domain';

export const requestsRepository: RequestsRepositoryPort = {
  list(): EmployeeRequest[] {
    return readCollection<EmployeeRequest>(STORAGE_KEYS.requests);
  },
  save(record: EmployeeRequest, existing: EmployeeRequest[]): void {
    writeCollection(STORAGE_KEYS.requests, [record, ...existing], MAX_STORED_RECORDS);
  },
};
