const { 
  PrismaClient, 
  Prisma,
  GioiTinh, VaiTro, TrangThaiLichHen, TrangThaiPhieuKham,
  TrangThaiThanhToan, PhuongThucThanhToan, TrangThaiDichVu,
  TrangThaiTaiKhoan, LoaiThanhToan
} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Bắt đầu quy trình seed dữ liệu chuẩn hóa Enum ---');

  // Xóa dữ liệu cũ (đảm bảo thứ tự để tránh lỗi khóa ngoại)
  await prisma.thanh_toan.deleteMany();
  await prisma.chi_tiet_don_thuoc.deleteMany();
  await prisma.don_thuoc.deleteMany();
  await prisma.chi_tiet_dich_vu.deleteMany();
  await prisma.phieu_kham.deleteMany();
  await prisma.dat_lich.deleteMany();
  await prisma.thuoc.deleteMany();
  await prisma.dich_vu.deleteMany();
  await prisma.danh_muc.deleteMany();
  await prisma.benh_nhan.deleteMany();
  await prisma.tai_khoan.deleteMany();
  await prisma.nhan_vien.deleteMany();
  await prisma.chuyen_khoa.deleteMany();

  // 1. CHUYÊN KHOA
  const chuyenKhoas = [
    { ten_chuyen_khoa: 'Nội Tổng Quát', mo_ta: 'Khám nội khoa' },
    { ten_chuyen_khoa: 'Nhi Khoa', mo_ta: 'Sức khỏe trẻ em' },
    { ten_chuyen_khoa: 'Sản Phụ Khoa', mo_ta: 'Sản và phụ khoa' },
    { ten_chuyen_khoa: 'Răng Hàm Mặt', mo_ta: 'Nha khoa' },
    { ten_chuyen_khoa: 'Tai Mũi Họng', mo_ta: 'Tai mũi họng' },
    { ten_chuyen_khoa: 'Da Liễu', mo_ta: 'Da liễu' },
    { ten_chuyen_khoa: 'Mắt', mo_ta: 'Nhãn khoa' },
    { ten_chuyen_khoa: 'Cơ Xương Khớp', mo_ta: 'Xương khớp' },
    { ten_chuyen_khoa: 'Tim Mạch', mo_ta: 'Tim mạch' },
    { ten_chuyen_khoa: 'Xét Nghiệm', mo_ta: 'Xét nghiệm' }
  ];
  await prisma.chuyen_khoa.createMany({ data: chuyenKhoas });
  const allCK = await prisma.chuyen_khoa.findMany();

  // 2. NHÂN VIÊN & TÀI KHOẢN (Sử dụng Enum chuẩn)
  const nvRaw = [
    { ten: 'Trần Văn Nam', vt: VaiTro.BAC_SI, gt: GioiTinh.NAM },
    { ten: 'Lê Thị Mỹ', vt: VaiTro.BAC_SI, gt: GioiTinh.NU },
    { ten: 'Phạm Gia Bình', vt: VaiTro.BAC_SI, gt: GioiTinh.NAM },
    { ten: 'Hoàng Thu Thủy', vt: VaiTro.BAC_SI, gt: GioiTinh.NU },
    { ten: 'Đặng Quốc Bảo', vt: VaiTro.BAC_SI, gt: GioiTinh.NAM },
    { ten: 'Nguyễn An', vt: VaiTro.BAC_SI, gt: GioiTinh.KHAC },
    { ten: 'Vũ Cường', vt: VaiTro.BAC_SI, gt: GioiTinh.NAM },
    { ten: 'Lễ Tân Hoa', vt: VaiTro.LE_TAN, gt: GioiTinh.NU },
    { ten: 'Thu Ngân Dũng', vt: VaiTro.THU_NGAN, gt: GioiTinh.NAM },
    { ten: 'Vũ Minh Vương', vt: VaiTro.ADMIN, gt: GioiTinh.NAM },
  ];

  for (let i = 0; i < nvRaw.length; i++) {
    const item = nvRaw[i];
    await prisma.nhan_vien.create({
      data: {
        ten_nhan_vien: item.ten,
        so_dien_thoai: `0901000${i}55`,
        gioi_tinh: item.gt,
        chuc_vu: item.vt === VaiTro.BAC_SI ? 'Bác sĩ chuyên khoa' : 'Nhân viên nghiệp vụ',
        id_chuyen_khoa: item.vt === VaiTro.BAC_SI ? allCK[i % allCK.length].id_chuyen_khoa : null,
        tai_khoan: {
          create: {
            username: `user_0${i}`,
            password: 'password123',
            vai_tro: item.vt,
            trang_thai: TrangThaiTaiKhoan.HOAT_DONG
          }
        }
      }
    });
  }
  const allBS = await prisma.nhan_vien.findMany({ where: { chuc_vu: 'Bác sĩ chuyên khoa' } });

  // 3. BỆNH NHÂN (Sử dụng Enum chuẩn)
  const benhNhanData = [
    { ten: 'Trần Văn Hoàng', sdt: '0912111222', cccd: '001095001234', gt: GioiTinh.NAM },
    { ten: 'Lê Thị Kim Liên', sdt: '0912333444', cccd: '001095005678', gt: GioiTinh.NU },
    { ten: 'Nguyễn Đình Bảng', sdt: '0912555666', cccd: '001095009012', gt: GioiTinh.NAM },
    { ten: 'Phạm Thanh Thủy', sdt: '0912777888', cccd: '001095003456', gt: GioiTinh.NU },
    { ten: 'Đỗ Minh Quân', sdt: '0912999000', cccd: '001095007890', gt: GioiTinh.NAM },
    { ten: 'Bùi Thị Tuyết', sdt: '0988111222', cccd: '001095001111', gt: GioiTinh.NU },
    { ten: 'Vũ Xuân Trường', sdt: '0988333444', cccd: '001095002222', gt: GioiTinh.NAM },
    { ten: 'Hoàng Anh Dũng', sdt: '0988555666', cccd: '001095003333', gt: GioiTinh.NAM },
    { ten: 'Ngô Thanh Vân', sdt: '0988777888', cccd: '001095004444', gt: GioiTinh.NU },
    { ten: 'Lý Gia Hân', sdt: '0988999000', cccd: '001095005555', gt: GioiTinh.NU },
  ];
  for (const bn of benhNhanData) {
    await prisma.benh_nhan.create({
      data: {
        ten_benh_nhan: bn.ten,
        so_dien_thoai: bn.sdt,
        gioi_tinh: bn.gt,
        ngay_sinh: new Date('1990-01-01'),
        CCCD: bn.cccd,
        dia_chi: 'Hà Nội, Việt Nam'
      }
    });
  }
  const allBN = await prisma.benh_nhan.findMany();

  // 4. DANH MỤC, DỊCH VỤ & THUỐC
  const tenDM = ['Khám bệnh', 'Siêu âm', 'X-Quang', 'Xét nghiệm máu', 'Vật tư'];
  for (const dm of tenDM) {
    await prisma.danh_muc.create({ data: { ten_danh_muc: dm, loai: 'Dịch vụ' } });
  }
  const allDM = await prisma.danh_muc.findMany();

  const dichVuData = [
    { ten: 'Khám Nội Tổng Quát', gia: 150000, ck: allCK[0].id_chuyen_khoa, dm: allDM[0].id_danh_muc },
    { ten: 'Khám Nhi', gia: 200000, ck: allCK[1].id_chuyen_khoa, dm: allDM[0].id_danh_muc },
    { ten: 'Siêu âm ổ bụng', gia: 350000, ck: allCK[9].id_chuyen_khoa, dm: allDM[1].id_danh_muc },
    { ten: 'X-Quang ngực thẳng', gia: 250000, ck: allCK[9].id_chuyen_khoa, dm: allDM[2].id_danh_muc },
    { ten: 'Tổng phân tích tế bào máu', gia: 180000, ck: allCK[9].id_chuyen_khoa, dm: allDM[3].id_danh_muc },
    { ten: 'Khám Răng', gia: 100000, ck: allCK[3].id_chuyen_khoa, dm: allDM[0].id_danh_muc },
    { ten: 'Lấy cao răng', gia: 300000, ck: allCK[3].id_chuyen_khoa, dm: allDM[1].id_danh_muc },
    { ten: 'Khám Tai Mũi Họng', gia: 150000, ck: allCK[4].id_chuyen_khoa, dm: allDM[0].id_danh_muc },
    { ten: 'Nội soi tai mũi họng', gia: 450000, ck: allCK[4].id_chuyen_khoa, dm: allDM[1].id_danh_muc },
    { ten: 'Khám Mắt tổng quát', gia: 200000, ck: allCK[6].id_chuyen_khoa, dm: allDM[0].id_danh_muc },
  ];
  for (const dv of dichVuData) {
    await prisma.dich_vu.create({
      data: {
        ten_dich_vu: dv.ten,
        gia: dv.gia,
        id_chuyen_khoa: dv.ck,
        id_danh_muc: dv.dm
      }
    });
  }
  const allDV = await prisma.dich_vu.findMany();

  const dmThuoc = await prisma.danh_muc.create({ data: { ten_danh_muc: 'Thuốc Tây', loai: 'Thuốc' } });
  const thuocList = [
    { ten: 'Paracetamol 500mg', dvt: 'Viên', gia: 1500 },
    { ten: 'Efferalgan 80mg', dvt: 'Gói', gia: 4000 },
    { ten: 'Siro Ho Astex', dvt: 'Chai', gia: 45000 },
    { ten: 'Voltaren Emulgel', dvt: 'Tuýp', gia: 75000 },
    { ten: 'Nước muối sinh lý', dvt: 'Lọ', gia: 5000 },
    { ten: 'Mobic 15mg/1.5ml', dvt: 'Ống', gia: 22000 },
    { ten: 'Gạc tiệt trùng 10x10', dvt: 'Miếng', gia: 2000 },
    { ten: 'Betadine 30ml', dvt: 'Hộp', gia: 38000 },
    { ten: 'Vitamin C 500mg', dvt: 'Vỉ', gia: 15000 },
    { ten: 'Chỉ tiêu phẫu thuật', dvt: 'Sợi', gia: 60000 },
  ];
  for (const t of thuocList) {
    await prisma.thuoc.create({
      data: {
        ten_thuoc: t.ten,
        gia: t.gia,
        so_luong: 200,
        don_vi_tinh: t.dvt,
        han_su_dung: new Date('2027-01-01'),
        id_danh_muc: dmThuoc.id_danh_muc
      }
    });
  }
  const allThuoc = await prisma.thuoc.findMany();

  // 5. QUY TRÌNH VẬN HÀNH (Dùng Enum chuẩn cho trạng thái)
  for (let i = 0; i < 10; i++) {
    // A. Tạo lịch hẹn
    const lich = await prisma.dat_lich.create({
      data: {
        thoi_gian: new Date(),
        ly_do: 'Triệu chứng đau nhức vùng ' + (i % 2 === 0 ? 'đầu' : 'họng'),
        trang_thai: 'DA_DEN',
        id_benh_nhan: allBN[i].id_benh_nhan,
        id_bac_si: allBS[i % allBS.length].id_nhan_vien,
        id_chuyen_khoa: allBS[i % allBS.length].id_chuyen_khoa
      }
    });

    // B. Tạo phiếu khám
    const phieu = await prisma.phieu_kham.create({
      data: {
        trieu_chung: 'Đau âm ỉ, kéo dài 2 ngày',
        chan_doan: 'Viêm nhẹ, cần theo dõi thêm',
        trang_thai: 'HOAN_THANH',
        id_benh_nhan: lich.id_benh_nhan,
        id_bac_si: lich.id_bac_si,
        id_dat_lich: lich.id_dat_lich,
      }
    });

    // C. Thêm chi tiết dịch vụ
    await prisma.chi_tiet_dich_vu.create({
      data: {
        so_luong: 1,
        gia: allDV[i].gia,
        trang_thai: 'HOAN_THANH',
        id_phieu_kham: phieu.id_phieu_kham,
        id_dich_vu: allDV[i].id_dich_vu,
        id_bac_si: phieu.id_bac_si
      }
    });

    // D. Kê đơn thuốc
    const don = await prisma.don_thuoc.create({ data: { id_phieu_kham: phieu.id_phieu_kham } });
    await prisma.chi_tiet_don_thuoc.create({
      data: {
        so_luong: 10,
        lieu_dung: 'Ngày uống 2 lần, sau ăn',
        gia: allThuoc[i].gia,
        id_don_thuoc: don.id_don_thuoc,
        id_thuoc: allThuoc[i].id_thuoc
      }
    });

    // E. Thanh toán
    const dvKham = allDV[0]; // lấy dịch vụ khám

    const ctKham = await prisma.chi_tiet_dich_vu.create({
      data: {
        so_luong: 1,
        gia: dvKham.gia,
        trang_thai: TrangThaiDichVu.HOAN_THANH,
        id_phieu_kham: phieu.id_phieu_kham,
        id_dich_vu: dvKham.id_dich_vu,
        id_bac_si: phieu.id_bac_si
      }
    });

    const tt1 = await prisma.thanh_toan.create({
      data: {
        tong_tien: dvKham.gia,
        trang_thai: TrangThaiThanhToan.DA_THANH_TOAN,
        phuong_thuc: PhuongThucThanhToan.TIEN_MAT,
        ngay_thanh_toan: new Date(),
        id_phieu_kham: phieu.id_phieu_kham,
        loai_thanh_toan: LoaiThanhToan.PHI_KHAM
      }
    });

    await prisma.thanh_toan_chi_tiet.create({
      data: {
        id_thanh_toan: tt1.id_thanh_toan,
        loai_item: "DICH_VU",
        id_item: ctKham.id_chi_tiet,
        gia: ctKham.gia,
        so_luong: ctKham.so_luong
      }
    });


    // E2. Thanh toán dịch vụ (Xét nghiệm)
    const dvXetNghiem = allDV[(i + 1) % allDV.length];

    const ctDV = await prisma.chi_tiet_dich_vu.create({
      data: {
        so_luong: 1,
        gia: dvXetNghiem.gia,
        trang_thai: TrangThaiDichVu.HOAN_THANH,
        id_phieu_kham: phieu.id_phieu_kham,
        id_dich_vu: dvXetNghiem.id_dich_vu,
        id_bac_si: phieu.id_bac_si
      }
    });

    const tt2 = await prisma.thanh_toan.create({
      data: {
        tong_tien: dvXetNghiem.gia,
        trang_thai: TrangThaiThanhToan.DA_THANH_TOAN,
        phuong_thuc: PhuongThucThanhToan.TIEN_MAT,
        ngay_thanh_toan: new Date(),
        id_phieu_kham: phieu.id_phieu_kham,
        loai_thanh_toan: LoaiThanhToan.DICH_VU
      }
    });

    await prisma.thanh_toan_chi_tiet.create({
      data: {
        id_thanh_toan: tt2.id_thanh_toan,
        loai_item: "DICH_VU",
        id_item: ctDV.id_chi_tiet,
        gia: ctDV.gia,
        so_luong: ctDV.so_luong
      }
    });


    // E3. Thanh toán thuốc
    const ctThuoc = await prisma.chi_tiet_don_thuoc.create({
      data: {
        so_luong: 10,
        lieu_dung: 'Ngày uống 2 lần',
        gia: allThuoc[i].gia,
        id_don_thuoc: don.id_don_thuoc,
        id_thuoc: allThuoc[i].id_thuoc
      }
    });

    const tongThuoc = allThuoc[i].gia.mul(new Prisma.Decimal(10));

    const tt3 = await prisma.thanh_toan.create({
      data: {
        tong_tien: tongThuoc,
        trang_thai: TrangThaiThanhToan.DA_THANH_TOAN,
        phuong_thuc: PhuongThucThanhToan.TIEN_MAT,
        ngay_thanh_toan: new Date(),
        id_phieu_kham: phieu.id_phieu_kham,
        loai_thanh_toan: LoaiThanhToan.THUOC
      }
    });

    await prisma.thanh_toan_chi_tiet.create({
      data: {
        id_thanh_toan: tt3.id_thanh_toan,
        loai_item: "THUOC",
        id_item: ctThuoc.id_chi_tiet,
        gia: ctThuoc.gia,
        so_luong: ctThuoc.so_luong
      }
    });
  }

  console.log('--- Seed dữ liệu thành công với Enum chuẩn hóa! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });