import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.png";

import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
<Row>
  <Col md={8} className="home-about-description">
    <h1 style={{ fontSize: "2.6em" }}>
      LET ME <span className="purple"> INTRODUCE </span> MYSELF 👋
    </h1>
    <p className="home-about-body">
      I’m a passionate programmer with a strong foundation in{" "}
      <b className="purple">Java ☕, JavaScript 🟨, and PHP 🐘</b>.
      <br />
      <br />
      My main focus is on building modern{" "}
      <b className="purple">web applications 🌐 and digital products 🚀</b> using powerful frameworks.
      <br />
      <br />
      I especially enjoy developing with{" "}
      <b className="purple">Laravel</b> for robust backends and{" "}
      <b className="purple">Vue.js</b> for dynamic, interactive frontends.
      <br />
      <br />
      Whenever possible, I love creating seamless full-stack experiences by combining{" "}
      <b className="purple">Laravel</b> and{" "}
      <b className="purple">modern JavaScript technologies ⚡</b>.
      <br />
      <br />
      My mission is to deliver clean, maintainable, and scalable code that brings ideas to life. 💡
    </p>
  </Col>
  <Col md={4} className="myAvtar">
    <Tilt>
      <img src={myImg} className="img-fluid" alt="avatar" />
    </Tilt>
  </Col>
</Row>

        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/fadile-anass"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="GitHub"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://twitter.com/anass_fadile"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="Twitter"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/fadile-anass"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/anass_fadile/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="Instagram"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
