import {
  pageStyle,
  headerStyle,
  clinicNameStyle,
  clinicInfoStyle,
  titleStyle,
  hrStyle,
  infoRow,
  sectionLabel,
  contentBox,
  tableStyle,
  thStyle,
  tdStyle,
  tdLeft,
  signatureArea,
} from "./printStyles";

export default function PrintPrescription({
  patientName,
  patientPhone,
  patientGender,
  patientAge,
  doctorName,
  encounterCode,
  date,
  diagnosis,
  note,
  medicines,
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

      <div style={titleStyle}>Đơn Thuốc</div>

      <hr style={hrStyle} />

      <div style={infoRow}>
        <span><b>Mã PK:</b> {encounterCode}</span>
        <span><b>Ngày kê:</b> {date}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bệnh nhân:</b> {patientName}</span>
        <span><b>Giới tính:</b> {patientGender || "..."}</span>
      </div>
      <div style={infoRow}>
        <span><b>SĐT:</b> {patientPhone}</span>
        <span><b>Năm sinh:</b> {patientAge || "..."}</span>
      </div>

      <div style={sectionLabel}>Chẩn đoán:</div>
      <div style={contentBox}>{diagnosis || "..."}</div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle} width={40}>STT</th>
            <th style={thStyle}>Tên thuốc</th>
            <th style={thStyle} width={50}>SL</th>
            <th style={thStyle} width={60}>ĐVT</th>
            <th style={thStyle} width={160}>Liều dùng</th>
            <th style={thStyle} width={90}>Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdLeft}>{m.name}</td>
              <td style={tdStyle}>{m.quantity}</td>
              <td style={tdStyle}>{m.unit || "..."}</td>
              <td style={tdLeft}>{m.dosage || "..."}</td>
              <td style={tdStyle}>{fmt(m.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {note && (
        <>
          <div style={sectionLabel}>Ghi chú:</div>
          <div style={contentBox}>{note}</div>
        </>
      )}

      <div style={{ marginTop: 20, fontSize: 11, fontStyle: "italic" }}>
        * Hãy tham khảo ý kiến bác sĩ trước khi sử dụng thuốc
      </div>

      <div style={{ ...signatureArea, justifyContent: "center" }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Bác sĩ kê đơn</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
          <p style={{ margin: 0 }}>{doctorName}</p>
        </div>
      </div>
    </div>
  );
}
