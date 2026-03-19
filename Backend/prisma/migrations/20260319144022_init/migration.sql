-- CreateTable
CREATE TABLE `NhanVien` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten` VARCHAR(191) NOT NULL,
    `ngaySinh` DATETIME(3) NULL,
    `gioiTinh` VARCHAR(191) NULL,
    `soDienThoai` VARCHAR(191) NULL,
    `diaChi` VARCHAR(191) NULL,
    `chucVu` VARCHAR(191) NOT NULL,
    `chuyenKhoa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaiKhoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDangNhap` VARCHAR(191) NOT NULL,
    `matKhau` VARCHAR(191) NOT NULL,
    `vaiTro` ENUM('ADMIN', 'BAC_SI', 'LE_TAN', 'THU_NGAN') NOT NULL,
    `trangThai` ENUM('HOAT_DONG', 'KHOA') NOT NULL DEFAULT 'HOAT_DONG',
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nhanVienId` INTEGER NULL,

    UNIQUE INDEX `TaiKhoan_tenDangNhap_key`(`tenDangNhap`),
    UNIQUE INDEX `TaiKhoan_nhanVienId_key`(`nhanVienId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BenhNhan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten` VARCHAR(191) NOT NULL,
    `ngaySinh` DATETIME(3) NULL,
    `gioiTinh` VARCHAR(191) NULL,
    `soDienThoai` VARCHAR(191) NULL,
    `diaChi` VARCHAR(191) NULL,
    `tienSuBenh` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ngayHen` DATETIME(3) NOT NULL,
    `gioHen` VARCHAR(191) NULL,
    `lyDoKham` VARCHAR(191) NULL,
    `trangThai` ENUM('DA_DAT', 'CHO_KHAM', 'DA_KHAM', 'DA_HUY') NOT NULL DEFAULT 'DA_DAT',
    `benhNhanId` INTEGER NOT NULL,
    `bacSiId` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhieuKham` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ngayKham` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `trieuChung` VARCHAR(191) NULL,
    `chanDoan` VARCHAR(191) NULL,
    `ghiChu` VARCHAR(191) NULL,
    `benhNhanId` INTEGER NOT NULL,
    `bacSiId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonThuoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ngayKeDon` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ghiChu` VARCHAR(191) NULL,
    `phieuKhamId` INTEGER NOT NULL,

    UNIQUE INDEX `DonThuoc_phieuKhamId_key`(`phieuKhamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChiTietDonThuoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soLuong` INTEGER NOT NULL,
    `lieuDung` VARCHAR(191) NULL,
    `donThuocId` INTEGER NOT NULL,
    `thuocId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DanhMucThuoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDanhMuc` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thuoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenThuoc` VARCHAR(191) NOT NULL,
    `gia` DOUBLE NOT NULL,
    `soLuong` INTEGER NOT NULL,
    `donViTinh` VARCHAR(191) NULL,
    `hanSuDung` DATETIME(3) NULL,
    `danhMucId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThanhToan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tongTien` DOUBLE NOT NULL,
    `phuongThuc` VARCHAR(191) NULL,
    `trangThai` ENUM('CHUA_THANH_TOAN', 'DA_THANH_TOAN') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    `ngayThanhToan` DATETIME(3) NULL,
    `phieuKhamId` INTEGER NOT NULL,

    UNIQUE INDEX `ThanhToan_phieuKhamId_key`(`phieuKhamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaiKhoan` ADD CONSTRAINT `TaiKhoan_nhanVienId_fkey` FOREIGN KEY (`nhanVienId`) REFERENCES `NhanVien`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHen` ADD CONSTRAINT `LichHen_benhNhanId_fkey` FOREIGN KEY (`benhNhanId`) REFERENCES `BenhNhan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHen` ADD CONSTRAINT `LichHen_bacSiId_fkey` FOREIGN KEY (`bacSiId`) REFERENCES `NhanVien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhieuKham` ADD CONSTRAINT `PhieuKham_benhNhanId_fkey` FOREIGN KEY (`benhNhanId`) REFERENCES `BenhNhan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhieuKham` ADD CONSTRAINT `PhieuKham_bacSiId_fkey` FOREIGN KEY (`bacSiId`) REFERENCES `NhanVien`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonThuoc` ADD CONSTRAINT `DonThuoc_phieuKhamId_fkey` FOREIGN KEY (`phieuKhamId`) REFERENCES `PhieuKham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDonThuoc` ADD CONSTRAINT `ChiTietDonThuoc_donThuocId_fkey` FOREIGN KEY (`donThuocId`) REFERENCES `DonThuoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDonThuoc` ADD CONSTRAINT `ChiTietDonThuoc_thuocId_fkey` FOREIGN KEY (`thuocId`) REFERENCES `Thuoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thuoc` ADD CONSTRAINT `Thuoc_danhMucId_fkey` FOREIGN KEY (`danhMucId`) REFERENCES `DanhMucThuoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThanhToan` ADD CONSTRAINT `ThanhToan_phieuKhamId_fkey` FOREIGN KEY (`phieuKhamId`) REFERENCES `PhieuKham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
