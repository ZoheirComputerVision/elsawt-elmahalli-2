import { directoryRepository } from "../repositories";
import type { CreateDirectoryEntryDto, UpdateDirectoryEntryDto } from "../schemas";
import type { DirectoryFilter } from "../types";

export const directoryService = {
  async list(filter: DirectoryFilter = {}) {
    return directoryRepository.findMany(filter);
  },

  async getById(id: string) {
    return directoryRepository.findById(id);
  },

  async create(dto: CreateDirectoryEntryDto) {
    return directoryRepository.create(dto as unknown as Record<string, unknown>);
  },

  async update(id: string, dto: UpdateDirectoryEntryDto) {
    return directoryRepository.update(id, dto as unknown as Record<string, unknown>);
  },

  async delete(id: string) {
    return directoryRepository.delete(id);
  },

  async count(filter: DirectoryFilter = {}) {
    return directoryRepository.count(filter);
  },
};
