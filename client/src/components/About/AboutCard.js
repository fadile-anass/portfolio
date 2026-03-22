import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
<blockquote className="blockquote mb-0">
  <p style={{ textAlign: "justify" }}>
    Hi everyone! I’m <span className="purple">Fadile Anass</span> from{" "}
    <span className="purple">Casablanca, Morocco 🇲🇦</span>.
    <br />
    I am currently working as a freelancer 👨‍💻.
    <br />
    I hold a Professional License in Software Engineering 🎓.
    <br />
    <br />
    Beyond coding, here are some activities I enjoy:
  </p>
  <ul>
    <li className="about-activity">
      <ImPointRight /> 🎮 Playing Games
    </li>
    <li className="about-activity">
      <ImPointRight /> ✍️ Writing Tech Blogs
    </li>
    <li className="about-activity">
      <ImPointRight /> 🌍 Traveling
    </li>
  </ul>

 <p style={{ color: "rgb(155 126 172)" }}>
  "Code with purpose — نبرمج بهدف" 💡
</p>
  <footer className="blockquote-footer">Fadile</footer>
</blockquote>

      </Card.Body>
    </Card>
  );
}

export default AboutCard;
