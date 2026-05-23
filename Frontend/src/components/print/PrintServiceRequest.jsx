const pageStyle = {
  width: "210mm",
  minHeight: "297mm",
  padding: "20mm 15mm",
  fontFamily: "Times New Roman, serif",
  color: "#000",
  fontSize: 13,
  boxSizing: "border-box",
  border: "1px solid #000",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: 20,
};

const clinicNameStyle = {
  fontSize: 20,
  fontWeight: "bold",
  textTransform: "uppercase",
  margin: 0,
};

const clinicInfoStyle = {
  fontSize: 12,
  margin: "2px 0",
};

const titleStyle = {
  textAlign: "center",
  fontSize: 18,
  fontWeight: "bold",
  margin: "20px 0",
  textTransform: "uppercase",
};

const hrStyle = {
  border: "none",
  borderTop: "2px solid #000",
  margin: "8px 0",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 4,
  fontSize: 13,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
  fontSize: 13,
  border: "1px solid #000",
};

const thStyle = {
  border: "1px solid #000",
  padding: "6px 8px",
  textAlign: "center",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #000",
  padding: "6px 8px",
  textAlign: "center",
};

const tdLeft = {
  ...tdStyle,
  textAlign: "left",
};

const totalRowStyle = {
  ...tdStyle,
  textAlign: "right",
  fontWeight: "bold",
};

const signatureArea = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 50,
};

const signatureBox = {
  textAlign: "center",
  width: "40%",
};

export default function PrintServiceRequest({
  patientName,
  patientPhone,
  doctorName,
  encounterCode,
  date,
  services,
  total,
}) {
  const fmt = (n) => Number(n).toLocaleString();

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <p style={clinicNameStyle}>Phòng Khám Đa Khoa</p>
        <p style={clinicInfoStyle}>Địa chỉ: Số 123, Đường ABC, Quận XYZ</p>
        <p style={clinicInfoStyle}>Điện thoại: (028) 1234 5678</p>
      </div>

      <hr style={hrStyle} />

      <div style={titleStyle}>Phiếu Yêu Cầu Dịch Vụ</div>

      <hr style={hrStyle} />

      <div style={infoRow}>
        <span><b>Mã PK:</b> {encounterCode}</span>
        <span><b>Ngày:</b> {date}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bệnh nhân:</b> {patientName}</span>
      </div>
      <div style={infoRow}>
        <span><b>SĐT:</b> {patientPhone}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bác sĩ yêu cầu:</b> {doctorName}</span>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle} width={40}>STT</th>
            <th style={thStyle}>Tên dịch vụ</th>
            <th style={thStyle} width={60}>Số lượng</th>
            <th style={thStyle} width={100}>Đơn giá</th>
            <th style={thStyle} width={100}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {services.map((sv, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdLeft}>{sv.name}</td>
              <td style={tdStyle}>{sv.quantity}</td>
              <td style={tdStyle}>{fmt(sv.price)}</td>
              <td style={tdStyle}>{fmt(sv.price * sv.quantity)}</td>
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

      <div style={signatureArea}>
        <div style={signatureBox}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Người nhận</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
        </div>
        <div style={signatureBox}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Người lập</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
        </div>
      </div>
    </div>
  );
}
