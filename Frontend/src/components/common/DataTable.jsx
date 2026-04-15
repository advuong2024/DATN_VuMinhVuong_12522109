import { Table } from "antd";
import { useState } from "react";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  showSTT = true,
  pageSizeDefault = 10,
}) {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSizeDefault,
  });

  const sttColumn = {
    title: "STT",
    width: 60,
    align: "center",
    render: (_, __, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
  };

  const enhanceColumns = columns.map((col) => {
    if (!col.sorter && col.dataIndex) {
      return {
        ...col,
        sorter: (a, b) => {
          const valA = a[col.dataIndex];
          const valB = b[col.dataIndex];

          if (typeof valA === "number") return valA - valB;
          return String(valA).localeCompare(String(valB));
        },
      };
    }
    return col;
  });

  const finalColumns = showSTT
    ? [sttColumn, ...enhanceColumns]
    : enhanceColumns;

  return (
    <Table
      columns={finalColumns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.id || record.key}

      bordered
      size="middle"
      tableLayout="fixed"
      showSorterTooltip={false}

      components={{
        header: {
            cell: (props) => (
                <th
                    {...props}
                    style={{
                        fontWeight: 700,
                        textAlign: "center",
                        border: "1px solid #f0f0f0",
                    }}
                />
            ),
        },
      }}

      pagination={{
        ...pagination,
        showSizeChanger: true,
        onChange: (page, size) => {
          setPagination({
            current: page,
            pageSize: size,
          });
        },
        showTotal: (total) => `Total Pages: ${Math.ceil(total / pagination.pageSize)}`,
      }}

      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
}