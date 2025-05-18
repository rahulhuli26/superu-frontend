import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FileTree from "../components/FileTree";
import Editor from "../components/Editor";
import api from "../utils/api";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query; // content_id
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [html, setHtml] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/workspace/structured-content/${id}`).then((res) => {
        setFileTree(res.data);
      });
    }
  }, [id]);

  const handleSelect = (file) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setHtml(file.html || "");
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !html) return;
    setSaving(true);
    try {
      await api.put("/workspace/update-content", {
        fileId: selectedFile.id,
        html: html,
      });
    } catch (err) {
      console.error("Save failed", err);
    }
    setSaving(false);
  };

  const handleBack = () => {
    router.push("/dashboard"); // Adjust if your dashboard route is different
  };

  return (
    <Container fluid className="mt-3">
      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={handleBack}>
            ← Back to Dashboard
          </Button>
          {" "}
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <FileTree tree={fileTree} onSelect={handleSelect} />
        </Col>
        <Col md={9}>
          {selectedFile ? (
            <Editor content={html} onUpdate={setHtml} saving={saving} />
          ) : (
            <p>Select a file from the tree</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
