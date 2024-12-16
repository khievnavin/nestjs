-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userID_fkey";

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
