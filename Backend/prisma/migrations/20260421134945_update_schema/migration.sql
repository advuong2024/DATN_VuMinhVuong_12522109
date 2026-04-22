/*
  Warnings:

  - The primary key for the `benh_nhan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_benh_nhan` on the `benh_nhan` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_cap_nhat` on the `benh_nhan` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_tao` on the `benh_nhan` table. All the data in the column will be lost.
  - You are about to drop the column `ten_benh_nhan` on the `benh_nhan` table. All the data in the column will be lost.
  - The primary key for the `chi_tiet_dich_vu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gia_tai_thoi_diem` on the `chi_tiet_dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `id_chi_tiet` on the `chi_tiet_dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `id_nhan_vien` on the `chi_tiet_dich_vu` table. All the data in the column will be lost.
  - The primary key for the `chi_tiet_don_thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gia_tai_thoi_diem` on the `chi_tiet_don_thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `id_chi_tiet` on the `chi_tiet_don_thuoc` table. All the data in the column will be lost.
  - The primary key for the `dich_vu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gia_dich_vu` on the `dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `id_dich_vu` on the `dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `mo_ta` on the `dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `ten_dich_vu` on the `dich_vu` table. All the data in the column will be lost.
  - The primary key for the `don_thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ghi_chu` on the `don_thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `id_don_thuoc` on the `don_thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `don_thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_ke_don` on the `don_thuoc` table. All the data in the column will be lost.
  - The primary key for the `lich_hen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_lich_hen` on the `lich_hen` table. All the data in the column will be lost.
  - You are about to drop the column `id_nhan_vien` on the `lich_hen` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `lich_hen` table. All the data in the column will be lost.
  - You are about to drop the column `ly_do_kham` on the `lich_hen` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_tao` on the `lich_hen` table. All the data in the column will be lost.
  - You are about to drop the column `thoi_gian_hen` on the `lich_hen` table. All the data in the column will be lost.
  - The values [CHO_KHAM,DA_KHAM] on the enum `lich_hen_trang_thai` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `nhan_vien` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chuyen_khoa` on the `nhan_vien` table. All the data in the column will be lost.
  - You are about to drop the column `id_nhan_vien` on the `nhan_vien` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_cap_nhat` on the `nhan_vien` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_tao` on the `nhan_vien` table. All the data in the column will be lost.
  - You are about to drop the column `ten_nhan_vien` on the `nhan_vien` table. All the data in the column will be lost.
  - The primary key for the `phieu_kham` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ghi_chu` on the `phieu_kham` table. All the data in the column will be lost.
  - You are about to drop the column `id_nhan_vien` on the `phieu_kham` table. All the data in the column will be lost.
  - You are about to drop the column `id_phieu_kham` on the `phieu_kham` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `phieu_kham` table. All the data in the column will be lost.
  - The primary key for the `tai_khoan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_tai_khoan` on the `tai_khoan` table. All the data in the column will be lost.
  - You are about to drop the column `mat_khau` on the `tai_khoan` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_cap_nhat` on the `tai_khoan` table. All the data in the column will be lost.
  - You are about to drop the column `ngay_tao` on the `tai_khoan` table. All the data in the column will be lost.
  - You are about to drop the column `ten_dang_nhap` on the `tai_khoan` table. All the data in the column will be lost.
  - The primary key for the `thanh_toan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_thanh_toan` on the `thanh_toan` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `thanh_toan` table. All the data in the column will be lost.
  - The primary key for the `thuoc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `don_vi_tinh` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `gia_thuoc` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `han_su_dung` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `id_thuoc` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `ten_thuoc` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the `danh_muc_dich_vu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `danh_muc_thuoc` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_bac_si,thoi_gian]` on the table `lich_hen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_lich_hen]` on the table `phieu_kham` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `tai_khoan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `benh_nhan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten` to the `benh_nhan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gia` to the `chi_tiet_dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `chi_tiet_dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gia` to the `chi_tiet_don_thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `chi_tiet_don_thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gia` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `don_thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `lich_hen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_bac_si` to the `lich_hen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thoi_gian` to the `lich_hen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `nhan_vien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten` to the `nhan_vien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `nhan_vien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `phieu_kham` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_bac_si` to the `phieu_kham` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `tai_khoan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `tai_khoan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `tai_khoan` table without a default value. This is not possible if the table is not empty.
  - Made the column `id_nhan_vien` on table `tai_khoan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `thanh_toan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gia` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten` to the `thuoc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chi_tiet_dich_vu` DROP FOREIGN KEY `chi_tiet_dich_vu_id_dich_vu_fkey`;

-- DropForeignKey
ALTER TABLE `chi_tiet_dich_vu` DROP FOREIGN KEY `chi_tiet_dich_vu_id_nhan_vien_fkey`;

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
ALTER TABLE `lich_hen` DROP FOREIGN KEY `lich_hen_id_benh_nhan_fkey`;

-- DropForeignKey
ALTER TABLE `lich_hen` DROP FOREIGN KEY `lich_hen_id_nhan_vien_fkey`;

-- DropForeignKey
ALTER TABLE `phieu_kham` DROP FOREIGN KEY `phieu_kham_id_benh_nhan_fkey`;

-- DropForeignKey
ALTER TABLE `phieu_kham` DROP FOREIGN KEY `phieu_kham_id_nhan_vien_fkey`;

-- DropForeignKey
ALTER TABLE `tai_khoan` DROP FOREIGN KEY `tai_khoan_id_nhan_vien_fkey`;

-- DropForeignKey
ALTER TABLE `thanh_toan` DROP FOREIGN KEY `thanh_toan_id_phieu_kham_fkey`;

-- DropForeignKey
ALTER TABLE `thuoc` DROP FOREIGN KEY `thuoc_id_danh_muc_fkey`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_dich_vu_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_nhan_vien_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_dich_vu_id_phieu_kham_fkey` ON `chi_tiet_dich_vu`;

-- DropIndex
DROP INDEX `chi_tiet_don_thuoc_id_don_thuoc_idx` ON `chi_tiet_don_thuoc`;

-- DropIndex
DROP INDEX `chi_tiet_don_thuoc_id_thuoc_idx` ON `chi_tiet_don_thuoc`;

-- DropIndex
DROP INDEX `dich_vu_id_danh_muc_fkey` ON `dich_vu`;

-- DropIndex
DROP INDEX `lich_hen_id_benh_nhan_idx` ON `lich_hen`;

-- DropIndex
DROP INDEX `lich_hen_id_nhan_vien_idx` ON `lich_hen`;

-- DropIndex
DROP INDEX `lich_hen_id_nhan_vien_thoi_gian_hen_key` ON `lich_hen`;

-- DropIndex
DROP INDEX `phieu_kham_id_benh_nhan_idx` ON `phieu_kham`;

-- DropIndex
DROP INDEX `phieu_kham_id_nhan_vien_idx` ON `phieu_kham`;

-- DropIndex
DROP INDEX `tai_khoan_ten_dang_nhap_key` ON `tai_khoan`;

-- DropIndex
DROP INDEX `thuoc_id_danh_muc_fkey` ON `thuoc`;

-- AlterTable
ALTER TABLE `benh_nhan` DROP PRIMARY KEY,
    DROP COLUMN `id_benh_nhan`,
    DROP COLUMN `ngay_cap_nhat`,
    DROP COLUMN `ngay_tao`,
    DROP COLUMN `ten_benh_nhan`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `ten` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `chi_tiet_dich_vu` DROP PRIMARY KEY,
    DROP COLUMN `gia_tai_thoi_diem`,
    DROP COLUMN `id_chi_tiet`,
    DROP COLUMN `id_nhan_vien`,
    ADD COLUMN `gia` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `so_luong` DROP DEFAULT,
    ALTER COLUMN `trang_thai` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `chi_tiet_don_thuoc` DROP PRIMARY KEY,
    DROP COLUMN `gia_tai_thoi_diem`,
    DROP COLUMN `id_chi_tiet`,
    ADD COLUMN `gia` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `dich_vu` DROP PRIMARY KEY,
    DROP COLUMN `gia_dich_vu`,
    DROP COLUMN `id_dich_vu`,
    DROP COLUMN `mo_ta`,
    DROP COLUMN `ten_dich_vu`,
    ADD COLUMN `gia` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `ten` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `don_thuoc` DROP PRIMARY KEY,
    DROP COLUMN `ghi_chu`,
    DROP COLUMN `id_don_thuoc`,
    DROP COLUMN `is_deleted`,
    DROP COLUMN `ngay_ke_don`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `lich_hen` DROP PRIMARY KEY,
    DROP COLUMN `id_lich_hen`,
    DROP COLUMN `id_nhan_vien`,
    DROP COLUMN `is_deleted`,
    DROP COLUMN `ly_do_kham`,
    DROP COLUMN `ngay_tao`,
    DROP COLUMN `thoi_gian_hen`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_bac_si` INTEGER NOT NULL,
    ADD COLUMN `ly_do` VARCHAR(191) NULL,
    ADD COLUMN `thoi_gian` DATETIME(3) NOT NULL,
    MODIFY `trang_thai` ENUM('DA_DAT', 'DA_HUY', 'DA_DEN') NOT NULL DEFAULT 'DA_DAT',
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `nhan_vien` DROP PRIMARY KEY,
    DROP COLUMN `chuyen_khoa`,
    DROP COLUMN `id_nhan_vien`,
    DROP COLUMN `ngay_cap_nhat`,
    DROP COLUMN `ngay_tao`,
    DROP COLUMN `ten_nhan_vien`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_chuyen_khoa` INTEGER NULL,
    ADD COLUMN `ten` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `phieu_kham` DROP PRIMARY KEY,
    DROP COLUMN `ghi_chu`,
    DROP COLUMN `id_nhan_vien`,
    DROP COLUMN `id_phieu_kham`,
    DROP COLUMN `is_deleted`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_bac_si` INTEGER NOT NULL,
    ADD COLUMN `id_lich_hen` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tai_khoan` DROP PRIMARY KEY,
    DROP COLUMN `id_tai_khoan`,
    DROP COLUMN `mat_khau`,
    DROP COLUMN `ngay_cap_nhat`,
    DROP COLUMN `ngay_tao`,
    DROP COLUMN `ten_dang_nhap`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `id_nhan_vien` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `thanh_toan` DROP PRIMARY KEY,
    DROP COLUMN `id_thanh_toan`,
    DROP COLUMN `is_deleted`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `trang_thai` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `thuoc` DROP PRIMARY KEY,
    DROP COLUMN `don_vi_tinh`,
    DROP COLUMN `gia_thuoc`,
    DROP COLUMN `han_su_dung`,
    DROP COLUMN `id_thuoc`,
    DROP COLUMN `ten_thuoc`,
    ADD COLUMN `don_vi` VARCHAR(191) NULL,
    ADD COLUMN `gia` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `ten` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `danh_muc_dich_vu`;

-- DropTable
DROP TABLE `danh_muc_thuoc`;

-- CreateTable
CREATE TABLE `chuyen_khoa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten` VARCHAR(191) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten` VARCHAR(191) NOT NULL,
    `loai` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `lich_hen_id_bac_si_thoi_gian_key` ON `lich_hen`(`id_bac_si`, `thoi_gian`);

-- CreateIndex
CREATE UNIQUE INDEX `phieu_kham_id_lich_hen_key` ON `phieu_kham`(`id_lich_hen`);

-- CreateIndex
CREATE UNIQUE INDEX `tai_khoan_username_key` ON `tai_khoan`(`username`);

-- AddForeignKey
ALTER TABLE `nhan_vien` ADD CONSTRAINT `nhan_vien_id_chuyen_khoa_fkey` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyen_khoa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tai_khoan` ADD CONSTRAINT `tai_khoan_id_nhan_vien_fkey` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dich_vu` ADD CONSTRAINT `dich_vu_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thuoc` ADD CONSTRAINT `thuoc_id_danh_muc_fkey` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hen` ADD CONSTRAINT `lich_hen_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hen` ADD CONSTRAINT `lich_hen_id_bac_si_fkey` FOREIGN KEY (`id_bac_si`) REFERENCES `nhan_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_benh_nhan_fkey` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_bac_si_fkey` FOREIGN KEY (`id_bac_si`) REFERENCES `nhan_vien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phieu_kham` ADD CONSTRAINT `phieu_kham_id_lich_hen_fkey` FOREIGN KEY (`id_lich_hen`) REFERENCES `lich_hen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_dich_vu_fkey` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_thuoc` ADD CONSTRAINT `don_thuoc_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_don_thuoc_fkey` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_thuoc` ADD CONSTRAINT `chi_tiet_don_thuoc_id_thuoc_fkey` FOREIGN KEY (`id_thuoc`) REFERENCES `thuoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey` FOREIGN KEY (`id_phieu_kham`) REFERENCES `phieu_kham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
