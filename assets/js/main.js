const menuToggle = document.querySelector(".menu-toggle");
const primaryMenu = document.querySelector("#primary-menu");

if (menuToggle && primaryMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll(".primary-nav a");

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href").split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// --- Fase 4: Pesquisa no catálogo ---
const searchInput = document.querySelector("#search-input");
const searchClear = document.querySelector(".search-clear");
const searchInfo = document.querySelector("#search-results-info");
const bookCards = Array.from(document.querySelectorAll(".book-card"));

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function filterBooks() {
  const query = normalize(searchInput.value);

  let visible = 0;

  bookCards.forEach((card) => {
    const title = normalize(card.dataset.title || "");
    const author = normalize(card.dataset.author || "");
    const category = normalize(card.dataset.category || "");
    const haystack = `${title} ${author} ${category}`;

    const isVisible = query === "" || haystack.includes(query);
    card.style.display = isVisible ? "" : "none";

    if (isVisible) visible += 1;
  });

  if (searchInfo) {
    if (query === "") {
      searchInfo.textContent = "";
    } else if (visible === 0) {
      searchInfo.textContent = "Nenhum livro encontrado para a busca.";
    } else {
      searchInfo.textContent =
        visible === 1 ? "1 livro encontrado." : `${visible} livros encontrados.`;
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterBooks);
}

if (searchClear) {
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    filterBooks();
    searchInput.focus();
  });
}

// --- Fase 5: Banco de dados de livros ---
const booksDatabase = [
  {
    id: 1,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    category: "Romance",
    publisher: "Globo Livros",
    isbn: "978-8535937299",
    year: 1899,
    available: true,
    cover: "DB",
    coverClass: "",
    coverImage: "../assets/images/dom-casmurro.jpg",
    description: "Clássico da literatura brasileira indicado para estudos de narrativa, memória e realismo. Bentinho narra a história de seu relacionamento com Capitu, misturando passado e presente em uma reflexão profunda sobre ciúmes, traição e memória. Obra fundamental para compreender a psicologia dos personagens e a estrutura narrativa do realismo brasileiro."
  },
  {
    id: 2,
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Aventura",
    publisher: "Sextante",
    isbn: "978-8532529909",
    year: 1943,
    available: true,
    cover: "PA",
    coverClass: "book-cover-blue",
    coverImage: "../assets/images/o-pequeno-príncipe.jpg",
    description: "Obra poética sobre amizade, responsabilidade e descoberta, muito usada em projetos de leitura escolar. O pequeno príncipe viaja por diversos planetas em busca de respostas sobre a vida, o amor e a morte, oferecendo uma visão profunda sobre valores humanos de forma leve e poética."
  },
  {
    id: 3,
    title: "Harry Potter e a Pedra Filosofal",
    author: "J. K. Rowling",
    category: "Fantasia",
    publisher: "Rocco",
    isbn: "978-8532530786",
    year: 1997,
    available: false,
    cover: "HP",
    coverClass: "book-cover-gold",
    coverImage: "../assets/images/harry-potter-e-a-pedra-filosofal.jpg",
    description: "Primeiro volume da série, com foco em jornada, amizade e construção de mundo fantástico. Harry Potter descobre que é um bruxo e é convidado a estudar em Hogwarts, onde faz amigos e enfrenta mistérios que o levarão a confrontar forças do mal. Obra essencial para leitura juvenil com temática de aventura e crescimento pessoal."
  },
  {
    id: 4,
    title: "Quarto de Despejo",
    author: "Carolina Maria de Jesus",
    category: "Memórias",
    publisher: "Ática",
    isbn: "978-8508070610",
    year: 1960,
    available: true,
    cover: "QD",
    coverClass: "book-cover-green",
    coverImage: "../assets/images/quarto-de-despejo.jpg",
    description: "Relato importante para debates sobre sociedade, desigualdade, linguagem e cidadania. O livro é composto por trechos do diário de Carolina Maria de Jesus, uma mulher negra moradora de uma favela em São Paulo, registrando sua luta pela sobrevivência e suas reflexões sobre a vida, o preconceito e a esperança."
  },
  {
    id: 5,
    title: "Breve História do Tempo",
    author: "Stephen Hawking",
    category: "Ciências",
    publisher: "Intrínseca",
    isbn: "978-8598327839",
    year: 1988,
    available: false,
    cover: "BT",
    coverClass: "book-cover-red",
    coverImage: "../assets/images/uma-breve-historia-do-tempo.jpg",
    description: "Introdução acessível a temas como universo, tempo, gravidade e pensamento científico. Stephen Hawking, um dos maiores físicos modernos, explica conceitos complexos da cosmologia e da física quântica de forma que leigos possam compreender, abordando desde o Big Bang até os buracos negros."
  },
  {
    id: 6,
    title: "O Homem que Calculava",
    author: "Malba Tahan",
    category: "Matemática",
    publisher: "Record",
    isbn: "978-8501076776",
    year: 1938,
    available: true,
    cover: "HC",
    coverClass: "book-cover-purple",
    coverImage: "../assets/images/o-homem-que-calculava.jpg",
    description: "Narrativas com desafios matemáticos que aproximam lógica, cultura e resolução de problemas. O livro segue Beremiz Samir, um jovem calculista persa, em suas aventuras resolvendo problemas matemáticos e enigmas ao longo de sua jornada, demonstrando como a matemática está presente em situações cotidianas."
  }
];

function getBookById(id) {
  return booksDatabase.find(book => book.id === parseInt(id));
}

// --- Fase 5: Página de Detalhes ---
function loadBookDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  if (!bookId) {
    console.warn('Nenhum ID de livro fornecido');
    return;
  }
  
  const book = getBookById(bookId);
  
  if (!book) {
    console.warn('Livro não encontrado');
    return;
  }
  
  const bookCover = document.querySelector('.book-cover-detail');
  const bookTitle = document.querySelector('#book-title');
  const bookAuthor = document.querySelector('#book-author');
  const bookAuthorDetail = document.querySelector('#book-author-detail');
  const bookCategory = document.querySelector('#book-category');
  const bookPublisher = document.querySelector('#book-publisher');
  const bookISBN = document.querySelector('#book-isbn');
  const bookYear = document.querySelector('#book-year');
  const bookAvailability = document.querySelector('#book-availability');
  const bookDescription = document.querySelector('#book-description');
  const reserveButton = document.querySelector('#reserve-button');
  
  if (bookCover) {
    if (book.coverImage) {
      bookCover.className = 'book-cover-detail has-cover-image';
      bookCover.innerHTML = `<img src="${book.coverImage}" alt="Capa de ${book.title}">`;
    } else {
      bookCover.className = `book-cover-detail ${book.coverClass}`;
      bookCover.innerHTML = `<span>${book.cover}</span>`;
    }
  }
  
  if (bookTitle) bookTitle.textContent = book.title;
  if (bookAuthor) bookAuthor.textContent = book.author;
  if (bookAuthorDetail) bookAuthorDetail.textContent = book.author;
  if (bookCategory) bookCategory.textContent = book.category;
  if (bookPublisher) bookPublisher.textContent = book.publisher;
  if (bookISBN) bookISBN.textContent = book.isbn;
  if (bookYear) bookYear.textContent = book.year;
  if (bookDescription) bookDescription.textContent = book.description;
  
  if (bookAvailability) {
    const statusClass = book.available ? 'is-available' : 'is-unavailable';
    const statusText = book.available ? 'Disponível' : 'Indisponível';
    bookAvailability.className = `availability ${statusClass}`;
    bookAvailability.textContent = statusText;
  }
  
  if (reserveButton) {
    if (book.available) {
      reserveButton.disabled = false;
      reserveButton.textContent = 'Reservar livro';
      reserveButton.className = 'button button-primary';
    } else {
      reserveButton.disabled = true;
      reserveButton.textContent = 'Não disponível';
      reserveButton.className = 'button button-secondary-muted';
    }
  }
}

if (document.currentScript.src.includes('main.js') && window.location.pathname.includes('detalhes.html')) {
  document.addEventListener('DOMContentLoaded', loadBookDetails);
}

// Executar também se o DOM já estiver carregado
if (window.location.pathname.includes('detalhes.html') && document.readyState !== 'loading') {
  loadBookDetails();
}
