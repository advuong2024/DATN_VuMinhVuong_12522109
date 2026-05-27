import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Video } from "./extensions/Video";
import axiosClient from "./axiosClient";
import {
  FaBold, FaItalic, FaHeading, FaListUl, FaListOl,
  FaTable, FaPlus, FaMinus, FaTrash,
  FaImage, FaVideo, FaArrowRotateLeft, FaArrowRotateRight, FaPalette,
} from "react-icons/fa6";
import "./RichTextEditor.css";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  const res = await axiosClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
  "#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
  "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47",
  "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130",
];

function ColorPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentColor = editor.getAttributes("textStyle").color || "#000000";

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="color-picker-wrapper" ref={ref}>
      <button type="button" className="color-btn" onClick={() => setOpen(!open)} title="Màu chữ">
        <FaPalette style={{ color: currentColor }} />
        <span className="color-underline" style={{ background: currentColor }} />
      </button>
      {open && (
        <div className="color-popup">
          <div className="color-grid">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-cell${c === currentColor ? " active" : ""}`}
                style={{ background: c }}
                onClick={() => {
                  editor.chain().focus().setColor(c).run();
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <div className="color-custom">
            <span style={{ fontSize: 11, color: "#888" }}>Tùy chỉnh</span>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuBar({ editor }) {
  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const url = await uploadFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  };

  const addVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const url = await uploadFile(file);
      editor.chain().focus().setVideo({ src: url }).run();
    };
    input.click();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="tiptap-toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""} title="In đậm">
        <FaBold />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""} title="In nghiêng">
        <FaItalic />
      </button>
      <span className="divider" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""} title="Tiêu đề 1">
        <FaHeading />1
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} title="Tiêu đề 2">
        <FaHeading />2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""} title="Tiêu đề 3">
        <FaHeading />3
      </button>
      <span className="divider" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} title="Danh sách không thứ tự">
        <FaListUl />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} title="Danh sách có thứ tự">
        <FaListOl />
      </button>
      <span className="divider" />

      <ColorPicker editor={editor} />
      <span className="divider" />

      <button type="button" onClick={addTable} title="Chèn bảng">
        <FaTable />
      </button>
      {editor.isActive("table") && (
        <>
          <span className="divider" />
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} title="Thêm hàng">
            <FaPlus /> R
          </button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Thêm cột">
            <FaPlus /> C
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} title="Xóa hàng">
            <FaMinus /> R
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} title="Xóa cột">
            <FaMinus /> C
          </button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} title="Xóa bảng">
            <FaTrash />
          </button>
        </>
      )}
      <span className="divider" />

      <button type="button" onClick={addImage} title="Chèn hình ảnh">
        <FaImage />
      </button>
      <button type="button" onClick={addVideo} title="Chèn video">
        <FaVideo />
      </button>
      <span className="divider" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Hoàn tác">
        <FaArrowRotateLeft />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Làm lại">
        <FaArrowRotateRight />
      </button>
    </div>
  );
}

export default function RichTextEditor({ value, onChange }) {
  const prevContent = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: { depth: 100 } }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      Placeholder.configure({ placeholder: "Nhập mô tả..." }),
      Video,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      prevContent.current = html;
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== prevContent.current) {
      editor.commands.setContent(value || "", false);
      prevContent.current = value;
    }
  }, [editor, value]);

  return (
    <div className="tiptap-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
