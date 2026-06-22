import { adsRepository } from "../repositories";
import type { CreateAdDto, UpdateAdDto } from "../schemas";
import type { AdFilter } from "../types";

export const adsService = {
  async list(filter: AdFilter = {}) {
    return adsRepository.findMany(filter);
  },

  async getById(id: string) {
    return adsRepository.findById(id);
  },

  async create(dto: CreateAdDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return adsRepository.create(data);
  },

  async update(id: string, dto: UpdateAdDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return adsRepository.update(id, data);
  },

  async delete(id: string) {
    return adsRepository.delete(id);
  },

  async incrementClicks(id: string) {
    return adsRepository.incrementClicks(id);
  },

  async count(filter: AdFilter = {}) {
    return adsRepository.count(filter);
  },
};
