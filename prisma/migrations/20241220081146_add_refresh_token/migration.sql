/*
  Warnings:

  - You are about to drop the column `createdAt` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookmarks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userID_fkey";

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
