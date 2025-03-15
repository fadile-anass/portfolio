import React, { useState, useRef } from "react";
import Axios from "axios";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";

const AddResume = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [validated, setValidated] = useState(false);
    const fileInputRef = useRef(null);

    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
            setMessage({ type: "", text: "" });
        } else {
            setPdf(null);
            setMessage({ type: "danger", text: "Please select a valid PDF file" });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        if (form.checkValidity() === false || !pdf) {
            event.stopPropagation();
            setValidated(true);
            if (!pdf) setMessage({ type: "danger", text: "Please select a PDF file" });
            return;
        }
        
        setLoading(true);
        setMessage({ type: "", text: "" });
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('link', link);
        formData.append('pdf', pdf);
        
        try {
            await Axios.post(`${process.env.REACT_APP_BACKEND_URI}/resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage({ type: "success", text: "Resume added successfully!" });
            // Reset form
            setName("");
            setLink("");
            setPdf(null);
            setValidated(false);
            // Reset file input by clearing the form
            document.getElementById("resume-form").reset();
        } catch (error) {
            console.error("Error:", error);
            setMessage({ 
                type: "danger", 
                text: error.response?.data || "Failed to add resume. Please try again." 
            });
        } finally {
            setLoading(false);
        }
    };

    // Custom file input handler
    const handleFileButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current.click();
    };

    return (
        <div className="container py-4">
            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">
                    <i className="fas fa-file-pdf me-2"></i>
                    Add New Resume
                </Card.Header>
                <Card.Body>
                    {message.text && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                            {message.text}
                        </Alert>
                    )}
                    
                    <Form id="resume-form" noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Resume Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter resume title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a title for the resume.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Link (Optional)</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://example.com/resume"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                External link to the resume (if applicable)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>PDF File</Form.Label>
                            <div className="d-flex align-items-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handlePdfChange}
                                    accept=".pdf"
                                    required
                                    className="d-none" // Hide the default file input
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleFileButtonClick}
                                    className="me-2"
                                >
                                    <i className="fas fa-file-upload me-2"></i>
                                    Choose PDF
                                </Button>
                                <span className={pdf ? "text-success" : "text-muted"}>
                                    {pdf ? pdf.name : "No file selected"}
                                </span>
                            </div>
                            {validated && !pdf && (
                                <div className="text-danger mt-1 small">
                                    Please select a PDF file.
                                </div>
                            )}
                            <Form.Text className="text-muted d-block mt-1">
                                Only PDF files are accepted
                            </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                                className="py-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus me-2"></i>
                                        Add Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddResume;