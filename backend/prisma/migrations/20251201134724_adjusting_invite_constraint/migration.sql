/*
  Warnings:

  - A unique constraint covering the columns `[email,companyId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invite_email_companyId_key" ON "Invite"("email", "companyId");
