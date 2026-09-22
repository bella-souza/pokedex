// Componente responsável pelo cabeçalho da aplicação

import "./Header.css";
import Pokedex from "../../assets/pokedex.png"
function Header() {
  return (
    <header>
      <h1>Pokédex</h1>
      <img src= {Pokedex} alt= ""/>

      <nav aria-label="Navegação principal">
        <ul>
          <li>
            <a href="#pokemons">Pokémon</a>
          </li>

          <li>
            <a href="#favoritos">Favoritos</a>
          </li>

          <li>
            <a href="#comparar">Comparar</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;