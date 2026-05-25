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

export default function PrintEncounter({
  patientName,
  patientPhone,
  doctorName,
  encounterCode,
  date,
  symptoms,
  diagnosis,
  note,
  services,
  status,
}) {
  const fmt = (n) => Number(n).toLocaleString();
  const statusMap = {
    CHO_KHAM: "Chờ khám",
    DANG_KHAM: "Đang khám",
    HOAN_THANH: "Hoàn thành",
    DA_HUY: "Đã hủy",
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <p style={clinicNameStyle}>Phòng Khám Đa Khoa</p>
        <p style={clinicInfoStyle}>Địa chỉ: Số 123, Đường ABC, Quận XYZ</p>
        <p style={clinicInfoStyle}>Điện thoại: (028) 1234 5678</p>
      </div>

      <hr style={hrStyle} />

      <div style={titleStyle}>Phiếu Khám Bệnh</div>

      <hr style={hrStyle} />

      <div style={infoRow}>
        <span><b>Mã PK:</b> {encounterCode}</span>
        <span><b>Ngày khám:</b> {date}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bệnh nhân:</b> {patientName}</span>
        <span><b>SĐT:</b> {patientPhone}</span>
      </div>
      <div style={infoRow}>
        <span><b>Bác sĩ:</b> {doctorName}</span>
        <span><b>Trạng thái:</b> {statusMap[status] || status}</span>
      </div>

      <div style={sectionLabel}>Triệu chứng:</div>
      <div style={contentBox}>{symptoms || "..."}</div>

      <div style={sectionLabel}>Chẩn đoán:</div>
      <div style={contentBox}>{diagnosis || "..."}</div>

      {note && (
        <>
          <div style={sectionLabel}>Ghi chú:</div>
          <div style={contentBox}>{note}</div>
        </>
      )}

      {services.length > 0 && (
        <>
          <div style={sectionLabel}>Dịch vụ đã thực hiện:</div>
          <table style={{ ...tableStyle, marginTop: 8 }}>
            <thead>
              <tr>
                <th style={thStyle} width={40}>STT</th>
                <th style={thStyle}>Dịch vụ</th>
                <th style={thStyle} width={60}>SL</th>
                <th style={thStyle} width={90}>Đơn giá</th>
                <th style={thStyle} width={90}>Thành tiền</th>
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
          </table>
        </>
      )}

      <div style={{ ...signatureArea, justifyContent: "right" }}>
        <div style={{ textAlign: "right", width: "100%" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Bác sĩ khám bệnh</p>
          <p style={{ margin: 0, fontSize: 11, marginRight: 8 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
          <p style={{ margin: 0, marginRight: 8 }}>{doctorName}</p>
        </div>
      </div>
    </div>
  );
}
