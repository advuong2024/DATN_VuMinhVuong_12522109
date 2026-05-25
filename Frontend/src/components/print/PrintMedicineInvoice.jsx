import {
  pageStyle,
  headerStyle,
  clinicNameStyle,
  clinicInfoStyle,
  titleStyle,
  hrStyle,
  infoRow,
  tableStyle,
  thStyle,
  tdStyle,
  tdLeft,
  totalRowStyle,
  signatureArea,
  signatureBox,
} from "./printStyles";

function numberToWords(n) {
  if (n === 0) return "Không";
  const units = ["", "nghìn", "triệu", "tỷ"];
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const readThreeDigits = (num) => {
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    let s = "";
    if (h > 0) s += digits[h] + " trăm ";
    if (t > 1) s += digits[t] + " mươi ";
    else if (t === 1) s += "mười ";
    else if (t === 0 && h > 0 && o > 0) s += "lẻ ";
    if (o === 1 && t > 1) s += "mốt";
    else if (o === 5 && t > 0) s += "lăm";
    else if (o > 0) s += digits[o];
    return s.trim();
  };
  const groups = [];
  let num = n;
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }
  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) {
      result += readThreeDigits(groups[i]) + " ";
      result += units[i] + " ";
    }
  }
  return result.trim() + " đồng";
}

export default function PrintMedicineInvoice({
  patientName,
  patientPhone,
  date,
  invoiceCode,
  medicines,
  total,
  paymentMethod,
}) {
  const fmt = (n) => Number(n).toLocaleString();
  const methodMap = {
    TIEN_MAT: "Tiền mặt",
    CHUYEN_KHOAN: "Chuyển khoản",
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <p style={clinicNameStyle}>Phòng Khám Đa Khoa</p>
        <p style={clinicInfoStyle}>Địa chỉ: Số 123, Đường ABC, Quận XYZ</p>
        <p style={clinicInfoStyle}>Điện thoại: (028) 1234 5678</p>
      </div>

      <hr style={hrStyle} />

      <div style={titleStyle}>Hóa Đơn Mua Thuốc</div>

      <hr style={hrStyle} />

      <div style={infoRow}>
        <span><b>Số HĐ:</b> {invoiceCode}</span>
        <span><b>Ngày:</b> {date}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bệnh nhân:</b> {patientName}</span>
        <span><b>SĐT:</b> {patientPhone}</span>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle} width={40}>STT</th>
            <th style={thStyle}>Tên thuốc</th>
            <th style={thStyle} width={60}>Số lượng</th>
            <th style={thStyle} width={100}>Đơn giá</th>
            <th style={thStyle} width={100}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdLeft}>{m.name}</td>
              <td style={tdStyle}>{m.quantity}</td>
              <td style={tdStyle}>{fmt(m.price)}</td>
              <td style={tdStyle}>{fmt(m.price * m.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={totalRowStyle}>Tổng cộng:</td>
            <td style={{ ...tdStyle, fontWeight: "bold" }}>{fmt(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: 12, fontSize: 13 }}>
        <p style={{ margin: "4px 0" }}>
          <b>Bằng chữ:</b> {numberToWords(total)}
        </p>
        <p style={{ margin: "4px 0" }}>
          <b>Phương thức thanh toán:</b> {methodMap[paymentMethod] || paymentMethod}
        </p>
      </div>

      <div style={signatureArea}>
        <div style={signatureBox}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Khách hàng</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
          <p style={{ margin: 0 }}>{patientName}</p>
        </div>
        <div style={signatureBox}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Nhân viên thu ngân</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
        </div>
      </div>
    </div>
  );
}
