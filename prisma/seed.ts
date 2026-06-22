import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { toSlug } from "../src/lib/utils";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const regions = [
  { name: "تيارت", slug: "tiaret" },
  { name: "تيسمسيلت", slug: "tissemsilt" },
  { name: "قصر الشلالة", slug: "ksar-chellala" },
];

const categories = [
  { name: "محليات", slug: "local" },
  { name: "الوطن", slug: "nation" },
  { name: "العالم", slug: "world" },
  { name: "اقتصاد", slug: "economy" },
  { name: "رأي", slug: "opinion" },
  { name: "متخصصة", slug: "specialized" },
];

const newsData = [
  { title: "والي تيارت يدشن مشروعاً مائياً جديداً في عين كرمس", cat: "local", region: "tiaret", summary: "أشرف والي ولاية تيارت على مراسم تدشين مشروع مائي جديد يستفيد منه أكثر من 10 آلاف مواطن في المناطق الريفية.", status: "published" },
  { title: "افتتاح معرض الصناعات التقليدية بمشاركة 50 عارضاً في تيارت", cat: "local", region: "tiaret", summary: "افتتحت فعاليات معرض الصناعات التقليدية بولاية تيارت بمشاركة عارضين من مختلف بلديات الولاية.", status: "published" },
  { title: "ملتقى جهوي حول الاستثمار الفلاحي في تيسمسيلت", cat: "local", region: "tissemsilt", summary: "انطلقت أشغال الملتقى الجهوي حول الاستثمار الفلاحي بمشاركة خبراء ومستثمرين من عدة ولايات.", status: "published" },
  { title: "قافلة طبية متعددة التخصصات تجوب قرى قصر الشلالة", cat: "local", region: "ksar-chellala", summary: "تنظم مديرية الصحة قافلة طبية تجوب المناطق النائية لتقديم خدمات الكشف المبكر.", status: "published" },
  { title: "مهرجان الفروسية التقليدية في طبعته الثانية بقصر الشلالة", cat: "local", region: "ksar-chellala", summary: "تنظيم الطبعة الثانية من مهرجان الفروسية التقليدية بمشاركة فرسان من عدة ولايات.", status: "published" },
  { title: "البرلمان يصادق على قانون الاستثمار الجديد", cat: "nation", region: null, summary: "صادق المجلس الشعبي الوطني على قانون الاستثمار الجديد الذي يمنح تسهيلات كبيرة للمستثمرين.", status: "published" },
  { title: "وزير الداخلية يشرف على ملتقى التنمية المحلية", cat: "nation", region: null, summary: "أشرف وزير الداخلية على افتتاح أشغال الملتقى الوطني حول التنمية المحلية.", status: "published" },
  { title: "الحكومة تعلن عن برنامج وطني للتشغيل", cat: "nation", region: null, summary: "أعلنت الحكومة عن إطلاق برنامج وطني لدعم تشغيل الشباب يستهدف 50 ألف منصب شغل.", status: "published" },
  { title: "حملة وطنية للتلقيح تجوب 48 ولاية", cat: "nation", region: null, summary: "انطلقت الحملة الوطنية للتلقيح عبر كامل التراب الوطني في إطار البرنامج الموسع.", status: "published" },
  { title: "ارتفاع مؤشر الاستثمار في المناطق الداخلية", cat: "economy", region: "tiaret", summary: "تشير المعطيات الاقتصادية إلى تحسن ملحوظ في مؤشرات الاستثمار بالمناطق الداخلية.", status: "published" },
  { title: "افتتاح منطقة صناعية جديدة في تيارت", cat: "economy", region: "tiaret", summary: "افتتاح منطقة صناعية جديدة توفر آلاف فرص العمل وتستقطب استثمارات وطنية.", status: "published" },
  { title: "موسم فلاحي واعد في تيسمسيلت", cat: "economy", region: "tissemsilt", summary: "الموسم الفلاحي الجديد يبشر بمحاصيل وفيرة بفضل الأمطار الموسمية.", status: "published" },
  { title: "المركز الجامعي بقصر الشلالة يستقبل آلاف الطلبة", cat: "specialized", region: "ksar-chellala", summary: "استقبل المركز الجامعي الجديد آلاف الطلبة مع انطلاق العام الدراسي.", status: "published" },
  { title: "اللامركزية الإدارية بين النص القانوني والتطبيق", cat: "opinion", region: null, summary: "ما زالت تجربة اللامركزية تراوح مكانها بين نصوص متطورة وواقع تنفيذي صعب.", status: "published" },
  { title: "الاستثمار في المناطق الداخلية فرص وتحديات", cat: "opinion", region: null, summary: "تمتلك المناطق الداخلية مقومات استثمارية هائلة تحتاج إلى توفير البنية التحتية.", status: "published" },
];

async function main() {
  console.log("🌱 Seeding regions...");
  const regionMap: Record<string, string> = {};
  for (const region of regions) {
    const r = await prisma.region.upsert({
      where: { slug: region.slug },
      update: {},
      create: region,
    });
    regionMap[region.slug] = r.id;
    console.log(`  ✓ ${region.name}`);
  }

  console.log("🌱 Seeding categories...");
  const categoryMap: Record<string, string> = {};
  for (const category of categories) {
    const c = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoryMap[category.slug] = c.id;
    console.log(`  ✓ ${category.name}`);
  }

  console.log("🌱 Seeding news...");
  let newsCount = 0;
  for (const item of newsData) {
    const slug = toSlug(item.title);
    const exists = await prisma.news.findUnique({ where: { slug } });
    if (exists) continue;

    const daysAgo = Math.floor(Math.random() * 14);
    const publishedAt = new Date(Date.now() - daysAgo * 86400000);

    await prisma.news.create({
      data: {
        title: item.title,
        slug,
        summary: item.summary,
        status: item.status,
        publishedAt,
        category: { connect: { id: categoryMap[item.cat] } },
        region: item.region ? { connect: { id: regionMap[item.region] } } : undefined,
      },
    });
    newsCount++;
    console.log(`  ✓ ${item.title.substring(0, 40)}...`);
  }

  console.log("🌱 Seeding admin user...");
  const adminEmail = "admin@thelocalecho.dz";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash("Admin123!", 12);
    await prisma.user.create({
      data: {
        name: "مدير النظام",
        email: adminEmail,
        passwordHash: hash,
        role: "ADMIN",
        active: true,
      },
    });
    console.log("  ✓ Admin user created");
  } else {
    console.log("  ✓ Admin user already exists");
  }

  console.log("🌱 Seeding editor user...");
  const editorEmail = "editor@thelocalecho.dz";
  const existingEditor = await prisma.user.findUnique({ where: { email: editorEmail } });
  if (!existingEditor) {
    const hash = await bcrypt.hash("Editor123!", 12);
    await prisma.user.create({
      data: {
        name: "محرر",
        email: editorEmail,
        passwordHash: hash,
        role: "EDITOR",
        active: true,
      },
    });
    console.log("  ✓ Editor user created");
  } else {
    console.log("  ✓ Editor user already exists");
  }

  console.log("🌱 Seeding reporter user...");
  const reporterEmail = "reporter@thelocalecho.dz";
  const existingReporter = await prisma.user.findUnique({ where: { email: reporterEmail } });
  if (!existingReporter) {
    const hash = await bcrypt.hash("Reporter123!", 12);
    await prisma.user.create({
      data: {
        name: "مراسل",
        email: reporterEmail,
        passwordHash: hash,
        role: "REPORTER",
        active: true,
      },
    });
    console.log("  ✓ Reporter user created");
  } else {
    console.log("  ✓ Reporter user already exists");
  }

  console.log(`✅ Seed complete. (${newsCount} new news items)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
