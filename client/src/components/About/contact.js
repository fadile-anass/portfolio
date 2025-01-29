import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../../Assets/style/contact.css";

function Contact() {
  const form = useRef();
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on input change
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please fill out all fields correctly.");
      return;
    }

    setStatus("Sending...");

    emailjs.sendForm(
      process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
      process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
      form.current,
      process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY
    )
      .then(() => {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        form.current.reset();
      })
      .catch(() => {
        setStatus("Failed to send message. Please try again.");
      });
  };

  return (
    <Container fluid className="contact-section">
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col md={8} style={{ justifyContent: "center", paddingTop: "50px", paddingBottom: "50px" }}>
            <h1 className="project-heading" style={{ paddingBottom: "30px" }}>
              Get in <strong className="purple">Touch</strong>
            </h1>
            <Form ref={form} onSubmit={sendEmail}>
              <Form.Group className="mb-4" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </Form.Group>

              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </Form.Group>

              <Form.Group className="mb-4" controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  name="message"
                  as="textarea"
                  rows={5}
                  placeholder="Your message"
                  className="form-input"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                {errors.message && <p style={errorStyle}>{errors.message}</p>}
              </Form.Group>

              <Button variant="primary" type="submit" style={buttonStyle}>
                Send Message
              </Button>

              {status && (
                <p className="mt-3" style={{ color: status.includes("Failed") ? "#ff6b6b" : "#4caf50" }}>
                  {status}
                </p>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

// Inline styles
const inputStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  color: "#e8e8e8",
  border: "1.5px solid rgba(199, 112, 240, 0.5)",
  borderRadius: "8px",
  padding: "12px 15px",
  transition: "all 0.3s ease-in-out",
};

const buttonStyle = {
  padding: "12px 30px",
  fontSize: "1.1em",
  marginTop: "15px",
  borderRadius: "8px",
  backgroundColor: "#c770f0",
  border: "none",
  cursor: "pointer",
  opacity: "0.9",
};

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "0.9em",
  marginTop: "5px",
};

export default Contact;
