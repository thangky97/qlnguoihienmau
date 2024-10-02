import { SearchOutlined } from "@ant-design/icons";

interface InputSearchProps {
  placeholder?: string,
  onChange: any,
  value: string,
  className?: string,
  onPressEnter: any
}
export default function InputSearch({
  placeholder,
  onChange,
  value,
  className,
  onPressEnter
}: InputSearchProps) {
  return (
    <div className={`c2i-input-search ${className}`}>
      <div className="c2i-input-search-perfix">
        <SearchOutlined />
      </div>
      <input
        className="c2i-input"
        placeholder={placeholder || ""}
        onChange={onChange}
        value={value}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onPressEnter()
          }
        }}
      />
    </div>
  )
}