import "./Footer.css";

import Psy from "../../assets/psy.png";
import Jiggly from "../../assets/jiggly.png";

function Footer() {
  return (
    <footer>

      <img
        className="footer-pokemon"
        src={Psy}
        alt="Psy"
      />

      <section className="footer-texto">
        <p>Pokédex - Projeto React</p>
        <p>Todos os direitos reservados </p>
      </section>

      <img
        className="footer-pokemon"
        src={Jiggly}
        alt="Jiggly"
      />

    </footer>
  );
}

export default Footer;