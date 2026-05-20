/*
  Warnings:

  - Made the column `loai_thanh_toan` on table `thanh_toan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `phieu_kham` MODIFY `trang_thai` ENUM('CHO_KHAM', 'DANG_KHAM', 'HOAN_THANH', 'DA_HUY', 'NHAP') NOT NULL DEFAULT 'CHO_KHAM';

-- AlterTable
ALTER TABLE `thanh_toan` MODIFY `loai_thanh_toan` ENUM('PHI_KHAM', 'DICH_VU', 'THUOC') NOT NULL DEFAULT 'PHI_KHAM';
