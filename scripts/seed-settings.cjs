const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  await prisma.appSetting.upsert({ where: { key: 'stop_auto_publish' }, update: {}, create: { key: 'stop_auto_publish', value: 'false' } });
  await prisma.appSetting.upsert({ where: { key: 'require_human_review' }, update: {}, create: { key: 'require_human_review', value: 'false' } });
  const count = await prisma.appSetting.count();
  console.log('Seeded ' + count + ' settings');
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); process.exit(1); });
