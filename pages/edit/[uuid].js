import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Editor from '../../components/Editor';
const socket = io('http://localhost:8000');
export default function EditPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [content, setContent] = useState(null);
  useEffect(() => {
    if (uuid) socket.emit('join', uuid);
  }, [uuid]);
  useEffect(() => {
    socket.on('contentUpdate', (incoming) => setContent(incoming));
  }, []);
  const handleChange = (newContent) => {
    setContent(newContent);
    socket.emit('contentChange', { room: uuid, content: newContent });
  };
  return <Editor content={content} onChange={handleChange} />;
}