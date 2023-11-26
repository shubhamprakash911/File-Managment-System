import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Dropzone from "react-dropzone";

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of uploaded files on component mount
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "https://file-managment.onrender.com/api/files"
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileUpload = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    try {
      await axios.post(
        "https://file-managment.onrender.com/api/upload",
        formData
      );
      // Refresh the list of files after successful upload
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await axios.delete(`https://file-managment.onrender.com/api/files/${id}`);
      // Refresh the list of files after successful deletion
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Dropzone onDrop={handleFileUpload}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} style={dropzoneStyles}>
                    <input {...getInputProps()} />
                    <p>Drag & drop a file here or click to select a file</p>
                  </div>
                )}
              </Dropzone>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {files.map((file) => (
          <Col key={file._id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <Card.Img
                variant="top"
                src={`/uploads/${file.filename}`}
                alt={file.filename}
              />
              <Card.Body>
                <Card.Title>{file.filename}</Card.Title>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteFile(file._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const dropzoneStyles = {
  border: "2px dashed #007BFF",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default App;
