// Importa os recursos necessários do React
import { useEffect, useState } from "react";

// Importa o Axios para fazer requisições HTTP
import axios from "axios";

// Importa o arquivo de estilos
import "./Main.css";


function Main() {

  // Guarda a lista de Pokémon recebida da API
  const [pokemons, setPokemons] = useState([]);

  // Guarda o texto digitado no campo de pesquisa
  const [pesquisa, setPesquisa] = useState("");

  // Guarda os Pokémon adicionados aos favoritos
  const [favoritos, setFavoritos] = useState([]);

  // Guarda os Pokémon selecionados para comparação
  const [comparacao, setComparacao] = useState([]);


  // =========================================
  // BUSCAR POKÉMON NA API
  // =========================================

  const pegarPokemons = async () => {

    // Carrega os 60 primeiros Pokémon
    const resposta = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=60"
    );

    // Busca os detalhes de cada Pokémon
    const detalhesPokemons = await Promise.all(
      resposta.data.results.map(async (pokemon) => {

        const detalhes = await axios.get(
          pokemon.url
        );

        return detalhes.data;
      })
    );

    // Guarda os Pokémon completos no estado
    setPokemons(detalhesPokemons);
  };


  // =========================================
  // CARREGAMENTO INICIAL
  // =========================================

  useEffect(() => {
    pegarPokemons();
  }, []);


  // =========================================
  // PALAVRAS-CHAVE DOS TIPOS
  // =========================================

  /*
    A PokéAPI utiliza os nomes dos tipos
    em inglês.

    Aqui permitimos que o usuário pesquise
    utilizando português ou inglês.
  */

  const palavrasChaveTipos = {

    // Fogo
    fogo: "fire",
    fire: "fire",

    // Água
    agua: "water",
    água: "water",
    water: "water",

    // Terra
    terra: "ground",
    ground: "ground",

    // Ar / Voador
    ar: "flying",
    voador: "flying",
    flying: "flying",

    // Planta
    planta: "grass",
    grama: "grass",
    grass: "grass",

    // Elétrico
    eletrico: "electric",
    elétrico: "electric",
    electric: "electric",

    // Veneno
    veneno: "poison",
    poison: "poison",

    // Inseto
    inseto: "bug",
    bug: "bug",

    // Normal
    normal: "normal",

    // Fada
    fada: "fairy",
    fairy: "fairy",

    // Psíquico
    psiquico: "psychic",
    psíquico: "psychic",
    psychic: "psychic",

    // Pedra
    pedra: "rock",
    rock: "rock",

    // Gelo
    gelo: "ice",
    ice: "ice",

    // Lutador
    luta: "fighting",
    lutador: "fighting",
    fighting: "fighting",

    // Fantasma
    fantasma: "ghost",
    ghost: "ghost",

    // Dragão
    dragao: "dragon",
    dragão: "dragon",
    dragon: "dragon",

    // Sombrio
    sombrio: "dark",
    dark: "dark",

    // Aço
    aco: "steel",
    aço: "steel",
    metal: "steel",
    steel: "steel",
  };


  // =========================================
  // NORMALIZAR TEXTO
  // =========================================

  /*
    Remove diferenças entre letras
    maiúsculas/minúsculas e acentos.

    Dessa forma:

    Água
    água
    AGUA
    agua

    poderão ser interpretados corretamente.
  */

  const normalizarTexto = (texto) => {

    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };


  // =========================================
  // FILTRAR POKÉMON
  // =========================================

  const pokemonsFiltrados = pokemons.filter(
    (pokemon) => {

      // Texto digitado pelo usuário
      const termoDigitado = normalizarTexto(
        pesquisa.trim()
      );


      // Se não houver pesquisa,
      // mostra todos os Pokémon
      if (!termoDigitado) {
        return true;
      }


      // =====================================
      // PESQUISA PELO NOME
      // =====================================

      const nomePokemon = normalizarTexto(
        pokemon.name
      );

      const encontrouNome =
        nomePokemon.includes(termoDigitado);


      // =====================================
      // PESQUISA PELO TIPO
      // =====================================

      /*
        Verifica se existe uma tradução
        cadastrada.

        Exemplo:

        fogo -> fire
        água -> water
        terra -> ground
      */

      const tipoTraduzido =
        palavrasChaveTipos[termoDigitado] ||
        termoDigitado;


      /*
        Alguns Pokémon possuem mais
        de um tipo.

        O some() verifica todos eles.
      */

      const encontrouTipo =
        pokemon.types.some((tipo) => {

          const nomeTipo =
            normalizarTexto(
              tipo.type.name
            );

          return nomeTipo ===
            normalizarTexto(tipoTraduzido);
        });


      // =====================================
      // PESQUISA PELA HABILIDADE
      // =====================================

      /*
        Verifica todas as habilidades
        do Pokémon.
      */

      const encontrouHabilidade =
        pokemon.abilities.some((item) => {

          const nomeHabilidade =
            normalizarTexto(
              item.ability.name
            );

          return nomeHabilidade.includes(
            termoDigitado
          );
        });


      // =====================================
      // RESULTADO DA PESQUISA
      // =====================================

      /*
        O Pokémon aparece caso seja
        encontrado por:

        - nome
        - tipo
        - habilidade
      */

      return (
        encontrouNome ||
        encontrouTipo ||
        encontrouHabilidade
      );
    }
  );


  // =========================================
  // PESQUISAR
  // =========================================

  const pesquisarPokemon = (event) => {

    // Impede o formulário de
    // recarregar a página
    event.preventDefault();
  };


  // =========================================
  // ADICIONAR AOS FAVORITOS
  // =========================================

  const adicionarFavorito = (pokemon) => {

    // Verifica se o Pokémon já
    // está nos favoritos
    const pokemonJaFavorito =
      favoritos.some(
        (favorito) =>
          favorito.id === pokemon.id
      );


    // Impede Pokémon repetido
    if (pokemonJaFavorito) {
      return;
    }


    // Mantém os favoritos anteriores
    // e adiciona o novo
    setFavoritos([
      ...favoritos,
      pokemon
    ]);
  };


  // =========================================
  // REMOVER DOS FAVORITOS
  // =========================================

  const removerFavorito = (id) => {

    const novosFavoritos =
      favoritos.filter(
        (pokemon) =>
          pokemon.id !== id
      );

    setFavoritos(novosFavoritos);
  };


  // =========================================
  // ADICIONAR À COMPARAÇÃO
  // =========================================

  const adicionarComparacao = (pokemon) => {

    const pokemonJaSelecionado =
      comparacao.some(
        (item) =>
          item.id === pokemon.id
      );


    // Impede Pokémon repetido
    if (pokemonJaSelecionado) {
      return;
    }


    // Permite no máximo dois Pokémon
    if (comparacao.length < 2) {

      setComparacao([
        ...comparacao,
        pokemon
      ]);
    }
  };


  // =========================================
  // LIMPAR COMPARAÇÃO
  // =========================================

  const limparComparacao = () => {
    setComparacao([]);
  };


  return (

    <main>


      {/* =====================================
          PESQUISA
      ====================================== */}

      <section id="pokemons">

        <h2>
          Explore os Pokémon
        </h2>

        <p>
          Pesquise por nome, tipo ou habilidade
          e consulte informações sobre seus
          Pokémon favoritos.
        </p>


        <form onSubmit={pesquisarPokemon}>

          <label htmlFor="pesquisa">
            Pesquisar Pokémon
          </label>


          <input
            type="search"
            id="pesquisa"
            placeholder="Nome, tipo ou habilidade"
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(event.target.value)
            }
          />


          <button type="submit">
            Pesquisar
          </button>

        </form>

      </section>


      {/* =====================================
          POKÉMON DISPONÍVEIS
      ====================================== */}

      <section>

        <h2>
          Pokémon disponíveis
        </h2>


        <section className="lista-pokemons">

          {pokemonsFiltrados.map(
            (pokemon) => (

              <article
                className={`card-pokemon ${pokemon.types[0].type.name}`}
                key={pokemon.id}
              >

                <img
                  src={
                    pokemon.sprites
                      .front_default
                  }
                  alt={`Imagem do Pokémon ${pokemon.name}`}
                />


                <h3>
                  {pokemon.name}
                </h3>


                <p>
                  Nº {pokemon.id}
                </p>


                <p>
                  Tipo:{" "}
                  {pokemon.types
                    .map(
                      (tipo) =>
                        tipo.type.name
                    )
                    .join(", ")}
                </p>


                {/* BOTÃO FAVORITOS */}

                <button
                  type="button"
                  onClick={() =>
                    adicionarFavorito(
                      pokemon
                    )
                  }
                >
                  Adicionar aos favoritos
                </button>


                {/* BOTÃO COMPARAR */}

                <button
                  type="button"
                  onClick={() =>
                    adicionarComparacao(
                      pokemon
                    )
                  }
                >
                  Comparar
                </button>

              </article>

            )
          )}

        </section>


        {pokemonsFiltrados.length === 0 && (

          <p>
            Nenhum Pokémon encontrado.
          </p>

        )}

      </section>


      {/* =====================================
          FAVORITOS
      ====================================== */}

      <section id="favoritos">

        <h2>
          Meus favoritos
        </h2>


        {/* Caso ainda não existam favoritos */}

        {favoritos.length === 0 && (

          <p>
            Seus Pokémon favoritos
            aparecerão aqui.
          </p>

        )}


        {/* Lista dos favoritos */}

        <section className="lista-pokemons">

          {favoritos.map(
            (pokemon) => (

              <article
                className={`card-pokemon ${pokemon.types[0].type.name}`}
                key={pokemon.id}
              >

                <img
                  src={
                    pokemon.sprites
                      .front_default
                  }
                  alt={`Imagem do Pokémon ${pokemon.name}`}
                />


                <h3>
                  {pokemon.name}
                </h3>


                <p>
                  Nº {pokemon.id}
                </p>


                <p>
                  Tipo:{" "}
                  {pokemon.types
                    .map(
                      (tipo) =>
                        tipo.type.name
                    )
                    .join(", ")}
                </p>


                <button
                  type="button"
                  onClick={() =>
                    removerFavorito(
                      pokemon.id
                    )
                  }
                >
                  Remover dos favoritos
                </button>

              </article>

            )
          )}

        </section>

      </section>


      {/* =====================================
          COMPARAÇÃO
      ====================================== */}

      <section id="comparar">

        <h2>
          Comparar Pokémon
        </h2>


        {comparacao.length === 0 && (

          <p>
            Escolha dois Pokémon para
            comparar seus dados.
          </p>

        )}


        {comparacao.length === 1 && (

          <p>
            Agora escolha mais um Pokémon
            para comparar.
          </p>

        )}


        <section className="lista-comparacao">

          {comparacao.map(
            (pokemon) => (

              <article
                className={`card-comparacao ${pokemon.types[0].type.name}`}
                key={pokemon.id}
              >

                <img
                  src={
                    pokemon.sprites
                      .front_default
                  }
                  alt={`Imagem do Pokémon ${pokemon.name}`}
                />


                <h3>
                  {pokemon.name}
                </h3>


                <p>
                  Nº {pokemon.id}
                </p>


                <p>
                  Tipo:{" "}
                  {pokemon.types
                    .map(
                      (tipo) =>
                        tipo.type.name
                    )
                    .join(", ")}
                </p>


                <p>
                  Altura:{" "}
                  {pokemon.height / 10} m
                </p>


                <p>
                  Peso:{" "}
                  {pokemon.weight / 10} kg
                </p>


                <p>
                  HP:{" "}
                  {
                    pokemon.stats[0]
                      .base_stat
                  }
                </p>


                <p>
                  Ataque:{" "}
                  {
                    pokemon.stats[1]
                      .base_stat
                  }
                </p>


                <p>
                  Defesa:{" "}
                  {
                    pokemon.stats[2]
                      .base_stat
                  }
                </p>

              </article>

            )
          )}

        </section>


        {comparacao.length > 0 && (

          <button
            className="limpar-comparacao"
            type="button"
            onClick={limparComparacao}
          >
            Limpar comparação
          </button>

        )}

      </section>

    </main>
  );
}


export default Main;