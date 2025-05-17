export default function FileTree({ files, onSelect }) {
    return (
      <ul className="p-2">
        {files.map(file => (
          <li key={file.uuid} onClick={() => onSelect(file.uuid)} className="cursor-pointer hover:underline">{file.title}</li>
        ))}
      </ul>
    );
  }