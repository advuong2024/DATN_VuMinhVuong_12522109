import { Table, Empty } from "antd";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";


export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  showSTT = true,
  pageSizeDefault = 10,
  expandable,
}) {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSizeDefault,
  });

  const sttColumn = {
    title: "STT",
    width: 50,
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
  ? [
      sttColumn,
      ...enhanceColumns,
      Table.EXPAND_COLUMN,
    ]
  : [...enhanceColumns, Table.EXPAND_COLUMN];

  return (
    <Table
      columns={finalColumns}
      expandable={expandable}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.id || record.key}
      scroll={{ y: "calc(100vh - 403px)" }}

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

      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#888", fontWeight: 500 }}>
                No data
              </span>
            }
          />
        ),
      }}
    />
  );
}