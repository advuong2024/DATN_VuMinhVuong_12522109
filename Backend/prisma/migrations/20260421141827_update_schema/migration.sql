/*
  Warnings:

  - The primary key for the `benh_nhan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `benh_nhan` table. All the data in the column will be lost.
  - The primary key for the `chi_tiet_dich_vu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chi_tiet_dich_vu` table. All the data in the column will be lost.
  - The primary key for the `chi_tiet_don_thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chi_tiet_don_thuoc` table. All the data in the column will be lost.
  - The primary key for the `chuyen_khoa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chuyen_khoa` table. All the data in the column will be lost.
  - The primary key for the `danh_muc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `danh_muc` table. All the data in the column will be lost.
  - The primary key for the `dich_vu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `dich_vu` table. All the data in the column will be lost.
  - The primary key for the `don_thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `don_thuoc` table. All the data in the column will be lost.
  - The primary key for the `nhan_vien` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `nhan_vien` table. All the data in the column will be lost.
  - The primary key for the `phieu_kham` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `phieu_kham` table. All the data in the column will be lost.
  - You are about to drop the column `id_lich_hen` on the `phieu_kham` table. All the data in the column will be lost.
  - The primary key for the `tai_khoan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tai_khoan` table. All the data in the column will be lost.
  - The primary key for the `thanh_toan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `thanh_toan` table. All the data in the column will be lost.
  - The primary key for the `thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the `lich_hen` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_dat_lich]` on the table `phieu_kham` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_benh_nhan` to the `benh_nhan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chi_tiet` to the `chi_tiet_dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chi_tiet` to the `chi_tiet_don_thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chuyen_khoa` to the `chuyen_khoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_danh_muc` to the `danh_muc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_dich_vu` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_don_thuoc` to the `don_thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_nhan_vien` to the `nhan_vien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_phieu_kham` to the `phieu_kham` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tai_khoan` to the `tai_khoan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_thanh_toan` to the `thanh_toan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_thuoc` to the `thuoc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chi_tiet_dich_vu` DROP FOREIGN KEY `chi_tiet_dich_vu_id_dich_vu_fkey`;

-- DropForeignKey
ALTER TABLE `chi_tiet_dich_vu` DROP FOREIGN KEY `chi_tiet_dich_vu_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `chi_tiet_don_thuoc` DROP FOREIGN KEY `chi_tiet_don_thuoc_id_don_thuoc_fkey`;

-- DropForeignKey
ALTER TABLE `chi_tiet_don_thuoc` DROP FOREIGN KEY `chi_tiet_don_thuoc_id_thuoc_fkey`;

-- DropForeignKey
ALTER TABLE `dich_vu` DROP FOREIGN KEY `dich_vu_id_danh_muc_fkey`;

-- DropForeignKey
ALTER TABLE `don_thuoc` DROP FOREIGN KEY `don_thuoc_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `lich_hen` DROP FOREIGN KEY `lich_hen_id_bac_si_fkey`;

-- DropForeignKey
ALTER TABLE `lich_hen` DROP FOREIGN KEY `lich_hen_id_benh_nhan_fkey`;

-- DropForeignKey
ALTER TABLE `nhan_vien` DROP FOREIGN KEY `nhan_vien_id_chuyen_khoa_fkey`;

-- DropForeignKey
ALTER TABLE `phieu_kham` DROP FOREIGN KEY `phieu_kham_id_bac_si_fkey`;

-- DropForeignKey
ALTER TABLE `phieu_kham` DROP FOREIGN KEY `phieu_kham_id_benh_nhan_fkey`;

-- DropForeignKey
ALTER TABLE `phieu_kham` DROP FOREIGN KEY `phieu_kham_id_lich_hen_fkey`;

-- DropForeignKey
ALTER TABLE `tai_khoan` DROP FOREIGN KEY `tai_khoan_id_nhan_vien_fkey`;

-- DropForeignKey
ALTER TABLE `thanh_toan` DROP FOREIGN KEY `thanh_toan_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `thuoc` DROP FOREIGN KEY `thuoc_id_danh_muc_fkey`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_dich_vu_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_phieu_kham_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_don_thuoc_id_don_thuoc_fkey` ON `chi_tiet_don_thuoc`;

-- DropIndex
DROP INDEX `chi_tiet_don_thuoc_id_thuoc_fkey` ON `chi_tiet_don_thuoc`;

-- DropIndex
DROP INDEX `dich_vu_id_danh_muc_fkey` ON `dich_vu`;

-- DropIndex
DROP INDEX `nhan_vien_id_chuyen_khoa_fkey` ON `nhan_vien`;

-- DropIndex
DROP INDEX `phieu_kham_id_bac_si_fkey` ON `phieu_kham`;

-- DropIndex
DROP INDEX `phieu_kham_id_benh_nhan_fkey` ON `phieu_kham`;

-- DropIndex
DROP INDEX `phieu_kham_id_lich_hen_key` ON `phieu_kham`;

-- DropIndex
DROP INDEX `thuoc_id_danh_muc_fkey` ON `thuoc`;

-- AlterTable
ALTER TABLE `benh_nhan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_benh_nhan` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_benh_nhan`);

-- AlterTable
ALTER TABLE `chi_tiet_dich_vu` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_chi_tiet` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_chi_tiet`);

-- AlterTable
ALTER TABLE `chi_tiet_don_thuoc` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_chi_tiet` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_chi_tiet`);

-- AlterTable
ALTER TABLE `chuyen_khoa` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_chuyen_khoa` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_chuyen_khoa`);

-- AlterTable
ALTER TABLE `danh_muc` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_danh_muc` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_danh_muc`);

-- AlterTable
ALTER TABLE `dich_vu` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_dich_vu` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_dich_vu`);

-- AlterTable
ALTER TABLE `don_thuoc` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_don_thuoc` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_don_thuoc`);

-- AlterTable
ALTER TABLE `nhan_vien` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_nhan_vien` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_nhan_vien`);

-- AlterTable
ALTER TABLE `phieu_kham` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `id_lich_hen`,
    ADD COLUMN `id_dat_lich` INTEGER NULL,
    ADD COLUMN `id_phieu_kham` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_phieu_kham`);

-- AlterTable
ALTER TABLE `tai_khoan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_tai_khoan` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_tai_khoan`);

-- AlterTable
ALTER TABLE `thanh_toan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_thanh_toan` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_thanh_toan`);

-- AlterTable
ALTER TABLE `thuoc` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_thuoc` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_thuoc`);

-- DropTable
DROP TABLE `lich_hen`;

-- CreateTable
CREATE TABLE `dat_lich` (
    `id_dat_lich` INTEGER NOT NULL AUTO_INCREMENT,
    `thoi_gian` DATETIME(3) NOT NULL,
    `ly_do` VARCHAR(191) NULL,
    `trang_thai` ENUM('DA_DAT', 'DA_HUY', 'DA_DEN') NOT NULL DEFAULT 'DA_DAT',
    `id_benh_nhan` INTEGER NOT NULL,
    `id_bac_si` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `dat_lich_id_bac_si_thoi_gian_key`(`id_bac_si`, `thoi_gian`),
    PRIMARY KEY (`id_dat_lich`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `phieu_kham_id_dat_lich_key` ON `phieu_kham`(`id_dat_lich`);

-- AddForeignKey
ALTER TABLE `nhan_vien` ADD CONSTRAINT `nhan_vien_id_chuyen_khoa_fkey` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyen_khoa`(`id_chuyen_khoa`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tai_khoan` ADD CONSTRAINT `tai_khoan_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dich_vu` ADD CONSTRAINT `dich_vu_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc`(`id_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thuoc` ADD CONSTRAINT `thuoc_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc`(`id_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_lich` ADD CONSTRAINT `dat_lich_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id_benh_nhan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_lich` ADD CONSTRAINT `dat_lich_id_bac_si_fkey` FOREIGN KEY (`id_bac_si`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id_benh_nhan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_bac_si_fkey` FOREIGN KEY (`id_bac_si`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_dat_lich_fkey` FOREIGN KEY (`id_dat_lich`) REFERENCES `dat_lich`(`id_dat_lich`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_dich_vu_fkey` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu`(`id_dich_vu`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_thuoc` ADD CONSTRAINT `don_thuoc_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_don_thuoc_fkey` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc`(`id_don_thuoc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_thuoc_fkey` FOREIGN KEY (`id_thuoc`) REFERENCES `thuoc`(`id_thuoc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id_phieu_kham`) ON DELETE RESTRICT ON UPDATE CASCADE;
