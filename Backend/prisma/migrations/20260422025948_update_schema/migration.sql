/*
  Warnings:

  - You are about to drop the column `ten` on the `benh_nhan` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `chuyen_khoa` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `danh_muc` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `dich_vu` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `nhan_vien` table. All the data in the column will be lost.
  - You are about to drop the column `don_vi` on the `thuoc` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `thuoc` table. All the data in the column will be lost.
  - Added the required column `CCCD` to the `benh_nhan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_benh_nhan` to the `benh_nhan` table without a default value. This is not possible if the table is not empty.
  - Made the column `ngay_sinh` on table `benh_nhan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gioi_tinh` on table `benh_nhan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_bac_si` to the `chi_tiet_dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_chuyen_khoa` to the `chuyen_khoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_danh_muc` to the `danh_muc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chuyen_khoa` to the `dat_lich` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chuyen_khoa` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_dich_vu` to the `dich_vu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_nhan_vien` to the `nhan_vien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `han_su_dung` to the `thuoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ten_thuoc` to the `thuoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `benh_nhan` DROP COLUMN `ten`,
    ADD COLUMN `CCCD` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `ten_benh_nhan` VARCHAR(191) NOT NULL,
    MODIFY `ngay_sinh` DATETIME(3) NOT NULL,
    MODIFY `gioi_tinh` ENUM('NAM', 'NU', 'KHAC') NOT NULL;

-- AlterTable
ALTER TABLE `chi_tiet_dich_vu` ADD COLUMN `id_bac_si` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `chuyen_khoa` DROP COLUMN `ten`,
    ADD COLUMN `ten_chuyen_khoa` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `danh_muc` DROP COLUMN `ten`,
    ADD COLUMN `mo_ta` VARCHAR(191) NULL,
    ADD COLUMN `ten_danh_muc` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `dat_lich` ADD COLUMN `id_chuyen_khoa` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `dich_vu` DROP COLUMN `ten`,
    ADD COLUMN `id_chuyen_khoa` INTEGER NOT NULL,
    ADD COLUMN `mo_ta` VARCHAR(191) NULL,
    ADD COLUMN `ten_dich_vu` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `don_thuoc` ADD COLUMN `ngay_ke_don` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `nhan_vien` DROP COLUMN `ten`,
    ADD COLUMN `ten_nhan_vien` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `phieu_kham` ADD COLUMN `ghi_chu` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `thuoc` DROP COLUMN `don_vi`,
    DROP COLUMN `ten`,
    ADD COLUMN `don_vi_tinh` VARCHAR(191) NULL,
    ADD COLUMN `han_su_dung` DATETIME(3) NOT NULL,
    ADD COLUMN `ten_thuoc` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `dich_vu` ADD CONSTRAINT `dich_vu_id_chuyen_khoa_fkey` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyen_khoa`(`id_chuyen_khoa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_lich` ADD CONSTRAINT `dat_lich_id_chuyen_khoa_fkey` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyen_khoa`(`id_chuyen_khoa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_dich_vu` ADD CONSTRAINT `chi_tiet_dich_vu_id_bac_si_fkey` FOREIGN KEY (`id_bac_si`) REFERENCES `nhan_vien`(`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE CASCADE;
