-- CreateTable
CREATE TABLE "breaking_news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "link" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'high',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "news_id" TEXT,

    CONSTRAINT "breaking_news_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "breaking_news" ADD CONSTRAINT "breaking_news_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "breaking_news" ADD CONSTRAINT "breaking_news_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE SET NULL ON UPDATE CASCADE;
