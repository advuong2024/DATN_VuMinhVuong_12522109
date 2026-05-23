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

const sectionLabel = {
  fontWeight: "bold",
  marginTop: 16,
  marginBottom: 4,
  fontSize: 13,
};

const contentBox = {
  border: "1px solid #000",
  padding: "8px 10px",
  minHeight: 40,
  fontSize: 13,
  marginBottom: 4,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 8,
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

const signatureArea = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 50,
};

const signatureBox = {
  textAlign: "center",
  width: "40%",
};

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
          <table style={tableStyle}>
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

      <div style={signatureArea}>
        <div style={{ ...signatureBox, width: "100%" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>Bác sĩ khám bệnh</p>
          <p style={{ margin: 0, fontSize: 11 }}>(Ký, ghi rõ họ tên)</p>
          <div style={{ height: 50 }} />
          <p style={{ margin: 0 }}>{doctorName}</p>
        </div>
      </div>
    </div>
  );
}
