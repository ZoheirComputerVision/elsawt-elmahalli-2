import { prisma } from "@/lib/prisma";
import type { WilayaWithStats, DairaWithStats, CommuneWithParent } from "../types";

export const geographicRepository = {
  async getWilayas(): Promise<WilayaWithStats[]> {
    const wilayas = await prisma.wilaya.findMany({
      include: { dairas: { include: { communes: true } } },
      orderBy: { code: "asc" },
    });
    return wilayas.map((w) => ({
      id: w.id,
      name: w.name,
      slug: w.slug,
      code: w.code,
      active: w.active,
      dairasCount: w.dairas.length,
      communesCount: w.dairas.reduce((s, d) => s + d.communes.length, 0),
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
  },

  async getWilayaById(id: string) {
    const w = await prisma.wilaya.findUnique({
      where: { id },
      include: { dairas: { include: { communes: true }, orderBy: { name: "asc" } } },
    });
    if (!w) return null;
    return {
      id: w.id,
      name: w.name,
      slug: w.slug,
      code: w.code,
      active: w.active,
      dairasCount: w.dairas.length,
      communesCount: w.dairas.reduce((s, d) => s + d.communes.length, 0),
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      dairas: w.dairas.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        active: d.active,
        communesCount: d.communes.length,
        communes: d.communes.map((c) => ({ id: c.id, name: c.name, slug: c.slug, active: c.active })),
      })),
    };
  },

  async getDairasByWilaya(wilayaId: string): Promise<DairaWithStats[]> {
    const dairas = await prisma.daira.findMany({
      where: { wilayaId },
      include: { wilaya: true, communes: true },
      orderBy: { name: "asc" },
    });
    return dairas.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      active: d.active,
      wilayaId: d.wilayaId,
      wilayaName: d.wilaya.name,
      communesCount: d.communes.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  },

  async getDairaById(id: string) {
    const d = await prisma.daira.findUnique({
      where: { id },
      include: { wilaya: true, communes: { orderBy: { name: "asc" } } },
    });
    if (!d) return null;
    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      active: d.active,
      wilayaId: d.wilayaId,
      wilayaName: d.wilaya.name,
      communesCount: d.communes.length,
      communes: d.communes.map((c) => ({ id: c.id, name: c.name, slug: c.slug, active: c.active })),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  },

  async getCommunesByDaira(dairaId: string): Promise<CommuneWithParent[]> {
    const communes = await prisma.commune.findMany({
      where: { dairaId },
      include: { daira: { include: { wilaya: true } } },
      orderBy: { name: "asc" },
    });
    return communes.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      active: c.active,
      dairaId: c.dairaId,
      dairaName: c.daira.name,
      wilayaName: c.daira.wilaya.name,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },

  async getCommuneById(id: string) {
    const c = await prisma.commune.findUnique({ where: { id }, include: { daira: { include: { wilaya: true } } } });
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      active: c.active,
      dairaId: c.dairaId,
      dairaName: c.daira.name,
      wilayaName: c.daira.wilaya.name,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  },

  async createWilaya(data: { name: string; slug: string; code: number }) {
    return prisma.wilaya.create({ data: { ...data, active: true } });
  },

  async updateWilaya(id: string, data: { name?: string; slug?: string; code?: number; active?: boolean }) {
    return prisma.wilaya.update({ where: { id }, data });
  },

  async deleteWilaya(id: string) {
    await prisma.wilaya.delete({ where: { id } });
  },

  async createDaira(data: { name: string; slug: string; wilayaId: string }) {
    return prisma.daira.create({ data: { ...data, active: true } });
  },

  async updateDaira(id: string, data: { name?: string; slug?: string; active?: boolean }) {
    return prisma.daira.update({ where: { id }, data });
  },

  async deleteDaira(id: string) {
    await prisma.daira.delete({ where: { id } });
  },

  async createCommune(data: { name: string; slug: string; dairaId: string }) {
    return prisma.commune.create({ data: { ...data, active: true } });
  },

  async updateCommune(id: string, data: { name?: string; slug?: string; active?: boolean }) {
    return prisma.commune.update({ where: { id }, data });
  },

  async deleteCommune(id: string) {
    await prisma.commune.delete({ where: { id } });
  },

  async countWilayas() { return prisma.wilaya.count(); },
  async countDairas() { return prisma.daira.count(); },
  async countCommunes() { return prisma.commune.count(); },
};
