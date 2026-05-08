/*
  Fix:
  - Tránh duplicate foreign key
  - Tránh lỗi unique với NULL
*/

-- DropForeignKey (bọc IF EXISTS cho an toàn)
ALTER TABLE `thanh_toan` 
DROP FOREIGN KEY `thanh_toan_id_phieu_kham_fkey`;

-- DropIndex
DROP INDEX `thanh_toan_id_phieu_kham_key` ON `thanh_toan`;

-- AlterTable
ALTER TABLE `thanh_toan` 
ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
ADD COLUMN `loai_thanh_toan` ENUM('PHI_KHAM', 'DICH_VU', 'THUOC') NOT NULL DEFAULT 'PHI_KHAM';

-- ⚠️ QUAN TRỌNG: update dữ liệu cũ (nếu có)
UPDATE `thanh_toan` 
SET `loai_thanh_toan` = 'PHI_KHAM'
WHERE `loai_thanh_toan` IS NULL;

-- CreateTable
CREATE TABLE `thanh_toan_chi_tiet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_thanh_toan` INTEGER NOT NULL,
    `loai_item` ENUM('DICH_VU', 'THUOC') NOT NULL,
    `id_item` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `thanh_toan_chi_tiet_id_thanh_toan_idx`(`id_thanh_toan`),
    UNIQUE INDEX `thanh_toan_chi_tiet_unique`(`id_thanh_toan`, `loai_item`, `id_item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Index
CREATE INDEX `benh_nhan_ten_benh_nhan_idx` ON `benh_nhan`(`ten_benh_nhan`);
CREATE INDEX `nhan_vien_ten_nhan_vien_idx` ON `nhan_vien`(`ten_nhan_vien`);

-- ⚠️ Chỉ tạo unique sau khi dữ liệu đã sạch
CREATE UNIQUE INDEX `thanh_toan_unique` 
ON `thanh_toan`(`id_phieu_kham`, `loai_thanh_toan`);

-- ⚠️ FIX lỗi duplicate FK (đổi tên constraint)
ALTER TABLE `chi_tiet_don_thuoc` 
ADD CONSTRAINT `fk_ctdt_thuoc_new` 
FOREIGN KEY (`id_thuoc`) REFERENCES `thuoc`(`id_thuoc`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan_chi_tiet` 
ADD CONSTRAINT `thanh_toan_chi_tiet_fk` 
FOREIGN KEY (`id_thanh_toan`) REFERENCES `thanh_toan`(`id_thanh_toan`) 
ON DELETE RESTRICT ON UPDATE CASCADE;