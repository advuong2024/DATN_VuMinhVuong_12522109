/*
  Warnings:

  - Made the column `gia` on table `thanh_toan_chi_tiet` required.
  - Made the column `so_luong` on table `thanh_toan_chi_tiet` required.
*/

-- DropForeignKey
ALTER TABLE `thanh_toan`
DROP FOREIGN KEY `thanh_toan_id_phieu_kham_fkey`;

-- Giữ nguyên unique index có loai_thanh_toan
-- nên KHÔNG drop index này
-- DROP INDEX `thanh_toan_id_phieu_kham_loai_thanh_toan_key`
-- ON `thanh_toan`;

-- KHÔNG xóa cột loai_thanh_toan
-- ALTER TABLE `thanh_toan`
-- DROP COLUMN `loai_thanh_toan`;

-- AlterTable
ALTER TABLE `thanh_toan_chi_tiet`
MODIFY `loai_item`
ENUM('PHI_KHAM', 'DICH_VU', 'THUOC') NOT NULL,
MODIFY `gia` DECIMAL(10, 2) NOT NULL,
MODIFY `so_luong` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `thanh_toan`
ADD CONSTRAINT `thanh_toan_id_phieu_kham_fkey`
FOREIGN KEY (`id_phieu_kham`)
REFERENCES `phieu_kham`(`id_phieu_kham`)
ON DELETE RESTRICT
ON UPDATE CASCADE;