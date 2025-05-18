import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TiptapEditor from "../../../components/Editor";
import FileTree from "../../../components/FileTree";
import api from "../../../utils/api";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function EditPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonContent, setJsonContent] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uuid) {
      api.get(`/workspace/structured-content/${uuid}`).then((res) => {
        setFileTree(res.data);
      });
    }
  }, [uuid]);

  const handleSelect = (file) => {
    setSelectedFile(file);
    setJsonContent(file.json || {}); // assuming file.json is stored
  };

  const handleUpdate = async (newJson) => {
    setJsonContent(newJson);
    setSaving(true);
    await api.put("/workspace/update-content", {
      fileId: selectedFile.id,
      json: newJson,
    });
    setSaving(false);
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3}>
          <FileTree tree={fileTree} onSelect={handleSelect} />
          <Button className="mt-2" onClick={() => router.push("/dashboard")}>
            ⬅ Back
          </Button>
        </Col>
        <Col md={9}>
          {selectedFile ? (
            <>
              <TiptapEditor
                fileId={selectedFile.id}
                jsonContent={jsonContent}
                onUpdate={handleUpdate}
              />
              {saving && <p className="mt-2">Saving...</p>}
            </>
          ) : (
            <p>Select a file from the tree</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
