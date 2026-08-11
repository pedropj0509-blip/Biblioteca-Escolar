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
    stock: 5,
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
    stock: 4,
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
    stock: 0,
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
    stock: 3,
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
    stock: 1,
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
    stock: 2,
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
  const stockIndicator = document.querySelector('#book-stock');
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
  
  const currentStock = getBookCurrentStock(bookId);
  
  if (bookAvailability) {
    const statusClass = currentStock > 0 ? 'is-available' : 'is-unavailable';
    const statusText = currentStock > 0 ? 'Disponível' : 'Indisponível';
    bookAvailability.className = `availability ${statusClass}`;
    bookAvailability.textContent = statusText;
  }

  if (stockIndicator) {
    stockIndicator.textContent = currentStock > 0 ? `${currentStock} cópia${currentStock === 1 ? '' : 's'} disponíveis` : 'Sem estoque';
  }
  
  if (reserveButton) {
    if (currentStock > 0) {
      reserveButton.disabled = false;
      reserveButton.textContent = 'Reservar livro';
      reserveButton.className = 'button button-primary';
      reserveButton.onclick = () => reserveBook(parseInt(bookId, 10));
    } else {
      reserveButton.disabled = true;
      reserveButton.textContent = 'Não disponível';
      reserveButton.className = 'button button-secondary-muted';
      reserveButton.onclick = null;
    }
  }
}

const AUTH_STORAGE_KEY = 'biblioteca-auth-user';
const REGISTERED_USERS_KEY = 'biblioteca-registered-users';
const RESERVATIONS_STORAGE_KEY = 'biblioteca-reservations';

const mockUsers = [
  {
    id: 1,
    name: 'Aluno Exemplo',
    email: 'aluno@escola.com',
    password: '123456',
    role: 'student'
  },
  {
    id: 2,
    name: 'Professora Exemplo',
    email: 'professora@escola.com',
    password: '123456',
    role: 'teacher'
  }
];

function getStoredUsers() {
  const savedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
  return savedUsers ? JSON.parse(savedUsers) : [];
}

function saveStoredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function getAllUsers() {
  return [...mockUsers, ...getStoredUsers()];
}

function getAuthenticatedUser() {
  const userData = localStorage.getItem(AUTH_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
}

function setAuthenticatedUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function getStoredReservations() {
  const stored = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveReservations(reservations) {
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
}

function getBookReservedCount(bookId) {
  const bookIdNumber = parseInt(bookId, 10);
  const reservations = getStoredReservations();
  return reservations.filter(
    (reservation) => parseInt(reservation.bookId, 10) === bookIdNumber && reservation.status === 'Ativa'
  ).length;
}

function getBookCurrentStock(bookId) {
  const book = getBookById(bookId);
  if (!book) return 0;
  const reservedCount = getBookReservedCount(bookId);
  return Math.max(book.stock - reservedCount, 0);
}

function getBookAvailability(bookId) {
  return getBookCurrentStock(bookId) > 0;
}

function getUserReservations(userId) {
  return getStoredReservations().filter(
    (reservation) => reservation.userId === userId && reservation.status === 'Ativa'
  );
}

function getUserReservationHistory(userId) {
  return getStoredReservations().filter(
    (reservation) => reservation.userId === userId
  );
}

function getUserInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

function clearAuthentication() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function renderNavUser() {
  const user = getAuthenticatedUser();
  const loginLink = document.querySelector('.primary-nav .nav-action');

  if (!loginLink) {
    return;
  }

  if (user) {
    loginLink.textContent = user.name;
    loginLink.href = 'perfil.html';
    loginLink.setAttribute('aria-label', `Perfil de ${user.name}`);
    loginLink.classList.add('nav-user');
  } else {
    loginLink.textContent = 'Entrar';
    loginLink.href = 'login.html';
    loginLink.setAttribute('aria-label', 'Entrar');
    loginLink.classList.remove('nav-user');
  }
}

function renderHome() {
  const user = getAuthenticatedUser();
  const hero = document.querySelector('.hero');

  if (!hero) return;
  const featured = booksDatabase.slice(0, 3).map((b) => {
    const stock = getBookCurrentStock(b.id);
    const badge = stock > 0 ? (stock === 1 ? 'Última cópia' : 'Disponível') : 'Sem estoque';
    const imgSrc = b.coverImage ? (b.coverImage.startsWith('../') ? b.coverImage.replace(/^\.\.\//, '') : b.coverImage) : null;
    return `
      <article class="featured-book-card">
        <div class="cover-small">${imgSrc ? `<img src="${imgSrc}" alt="Capa de ${b.title}">` : `<span>${b.cover}</span>`}</div>
        <div class="featured-body">
          <strong class="featured-title">${b.title}</strong>
          <span class="featured-author">${b.author}</span>
          <span class="featured-badge">${badge}</span>
        </div>
      </article>`;
  }).join('');

  const initials = user ? getUserInitials(user.name) : '';

  hero.innerHTML = `
    <div class="container hero-content hero-grid">
      <div class="hero-main">
        <p class="section-kicker">Biblioteca Virtual Escolar</p>
        <h1>${user ? `Olá, ${user.name.split(' ')[0]}!` : 'Consulta, reserva e gestão do acervo em um só lugar.'}</h1>
        <p class="hero-text">${user ? 'Acesse rapidamente seu perfil, reservas e o catálogo.' : 'Uma base simples e organizada para alunos, professores e administradores acessarem livros e reservas.'}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="pages/catalogo.html">Ver catálogo</a>
          ${user ? '<a class="button button-secondary" href="pages/reservas.html">Minhas reservas</a>' : '<a class="button button-secondary" href="pages/cadastro.html">Criar conta</a>'}
        </div>
        <div class="hero-features">
          ${featured}
        </div>
      </div>
      <aside class="hero-side">
        ${user ? `
          <div class="hero-user-card">
            <div class="profile-avatar large">${initials}</div>
            <div class="hero-user-meta">
              <strong>${user.name}</strong>
              <span class="hero-user-role">${user.role === 'teacher' ? 'Professor' : 'Aluno'}</span>
              <div class="hero-side-actions">
                <a class="button button-secondary" href="pages/perfil.html">Meu perfil</a>
                <a class="button button-primary" href="pages/reservas.html">Minhas reservas</a>
              </div>
            </div>
          </div>
        ` : `
          <div class="signup-promo content-panel">
            <h3>Crie sua conta</h3>
            <p>Cadastre-se para reservar livros e acompanhar suas leituras.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="pages/cadastro.html">Cadastrar</a>
              <a class="button button-secondary" href="pages/login.html">Entrar</a>
            </div>
          </div>
        `}
      </aside>
    </div>
  `;
}

function showMessage(elementId, message, isError = false) {
  const element = document.querySelector(`#${elementId}`);

  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `form-message ${isError ? 'error' : 'success'}`;
}

function reserveBook(bookId) {
  const user = getAuthenticatedUser();
  const book = getBookById(bookId);
  const reserveMessage = document.querySelector('#reserve-message');

  if (!book || !reserveMessage) {
    return;
  }

  if (!user) {
    showMessage('reserve-message', 'Faça login para reservar este livro.', true);
    return;
  }

  const currentStock = getBookCurrentStock(bookId);
  if (currentStock <= 0) {
    showMessage('reserve-message', 'Não há cópias disponíveis no momento.', true);
    return;
  }

  const reservations = getStoredReservations();
  const newReservation = {
    id: Date.now(),
    userId: user.id,
    bookId,
    title: book.title,
    reservedAt: new Date().toISOString(),
    status: 'Ativa'
  };

  reservations.push(newReservation);
  saveReservations(reservations);

  showMessage('reserve-message', 'Reserva realizada com sucesso! Vá para suas reservas.', false);
  updateBookDetailsUI(bookId);
  syncCatalogBookCards();
  setTimeout(() => {
    window.location.href = 'reservas.html';
  }, 900);
}

function cancelReservation(reservationId) {
  const reservations = getStoredReservations();
  const updated = reservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, status: 'Cancelada' } : reservation
  );
  saveReservations(updated);
  syncCatalogBookCards();
  if (window.location.pathname.includes('reservas.html')) {
    renderReservationsPage();
  }
}

function updateBookDetailsUI(bookId) {
  const stock = getBookCurrentStock(bookId);
  const availability = document.querySelector('#book-availability');
  const stockElement = document.querySelector('#book-stock');
  const reserveButton = document.querySelector('#reserve-button');

  if (stockElement) {
    stockElement.textContent = stock > 0 ? `${stock} cópia${stock === 1 ? '' : 's'} disponíveis` : 'Sem estoque';
  }

  if (availability) {
    const statusClass = stock > 0 ? 'is-available' : 'is-unavailable';
    const statusText = stock > 0 ? 'Disponível' : 'Indisponível';
    availability.className = `availability ${statusClass}`;
    availability.textContent = statusText;
  }

  if (reserveButton) {
    if (stock > 0) {
      reserveButton.disabled = false;
      reserveButton.className = 'button button-primary';
      reserveButton.textContent = 'Reservar livro';
    } else {
      reserveButton.disabled = true;
      reserveButton.className = 'button button-secondary-muted';
      reserveButton.textContent = 'Não disponível';
    }
  }
}

function syncCatalogBookCards() {
  bookCards.forEach((card) => {
    const bookId = parseInt(card.dataset.bookId, 10);
    const stock = getBookCurrentStock(bookId);
    const stockItem = card.querySelector('.book-stock');
    const availabilityBadge = card.querySelector('.availability');

    if (stockItem) {
      stockItem.textContent = stock > 0 ? `${stock} cópia${stock === 1 ? '' : 's'} disponíveis` : 'Sem estoque';
    }

    if (availabilityBadge) {
      availabilityBadge.textContent = stock > 0 ? (stock === 1 ? 'Última cópia' : 'Disponível') : 'Indisponível';
      availabilityBadge.className = `availability ${stock > 0 ? 'is-available' : 'is-unavailable'}`;
    }
  });
}

function handleReserveButton(event) {
  const bookId = parseInt(event.currentTarget.dataset.bookId, 10);
  reserveBook(bookId);
}

function renderReservationsPage() {
  const user = getAuthenticatedUser();
  const container = document.querySelector('#reservations-content');

  if (!container) return;

  if (!user) {
    container.innerHTML = `
      <h2>Minhas reservas</h2>
      <p>Para ver suas reservas, faça login no sistema.</p>
      <div class="auth-actions">
        <a class="button button-primary" href="login.html">Entrar</a>
        <a class="button button-secondary" href="cadastro.html">Cadastrar</a>
      </div>
    `;
    return;
  }

  const active = getUserReservations(user.id);
  const history = getUserReservationHistory(user.id).filter(r => r.status !== 'Ativa');

  if (active.length === 0 && history.length === 0) {
    container.innerHTML = `
      <h2>Minhas reservas</h2>
      <p>Você ainda não fez reservas. Explore o catálogo e reserve os livros que desejar.</p>
      <div class="hero-actions"><a class="button button-primary" href="catalogo.html">Ver catálogo</a></div>
    `;
    return;
  }

  const activeHtml = active
    .map(res => {
      const book = getBookById(res.bookId) || {};
      return `
        <article class="reservation-card" data-reservation-id="${res.id}">
          <div class="card-cover">
            ${book.coverImage ? `<img src="${book.coverImage}" alt="Capa de ${book.title}">` : `<div class="cover-placeholder">${book.cover || 'Livro'}</div>`}
          </div>
          <div class="card-body">
            <h3 class="card-title">${book.title || res.title}</h3>
            <p class="card-meta">${book.author || ''}</p>
            <p class="card-info">Reservado em: ${new Date(res.reservedAt).toLocaleDateString('pt-BR')}</p>
            <p class="card-status">Status: <strong>${res.status}</strong></p>
            <div class="card-actions">
              <button class="button button-secondary cancel-reservation-button" data-reservation-id="${res.id}" type="button">Cancelar reserva</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  const historyHtml = history
    .map(res => {
      const book = getBookById(res.bookId) || {};
      return `
        <article class="reservation-card muted">
          <div class="card-cover">
            ${book.coverImage ? `<img src="${book.coverImage}" alt="Capa de ${book.title}">` : `<div class="cover-placeholder">${book.cover || 'Livro'}</div>`}
          </div>
          <div class="card-body">
            <h3 class="card-title">${book.title || res.title}</h3>
            <p class="card-meta">${book.author || ''}</p>
            <p class="card-info">Reservado em: ${new Date(res.reservedAt).toLocaleDateString('pt-BR')}</p>
            <p class="card-status">Status: ${res.status}</p>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = `
    <h2>Minhas reservas</h2>
    <p>Olá, ${user.name}. Gerencie suas reservas abaixo.</p>
    <section class="reservation-list">
      <h3>Reservas ativas</h3>
      <div class="reservation-grid">${activeHtml || '<p>Nenhuma reserva ativa.</p>'}</div>
    </section>
    <section class="reservation-list">
      <h3>Histórico</h3>
      <div class="reservation-grid">${historyHtml || '<p>Sem histórico de reservas.</p>'}</div>
    </section>
  `;

  const cancelButtons = container.querySelectorAll('.cancel-reservation-button');
  cancelButtons.forEach(btn => btn.addEventListener('click', (e) => {
    const id = parseInt(e.currentTarget.dataset.reservationId, 10);
    cancelReservation(id);
  }));
}

function handleSignupFormSubmit(event) {
  event.preventDefault();

  const name = document.querySelector('#nome')?.value.trim();
  const email = document.querySelector('#email')?.value.trim();
  const password = document.querySelector('#senha')?.value.trim();

  if (!name || !email || !password) {
    showMessage('signup-message', 'Preencha todos os campos.', true);
    return;
  }

  const existingUser = getAllUsers().find(
    (account) => account.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    showMessage('signup-message', 'Este e-mail já está em uso.', true);
    return;
  }

  const storedUsers = getStoredUsers();
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: 'student'
  };

  storedUsers.push(newUser);
  saveStoredUsers(storedUsers);
  setAuthenticatedUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

  showMessage('signup-message', 'Cadastro realizado com sucesso! Redirecionando...', false);
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 800);
}

function handleLoginFormSubmit(event) {
  event.preventDefault();

  const email = document.querySelector('#email')?.value.trim();
  const password = document.querySelector('#senha')?.value.trim();

  if (!email || !password) {
    showMessage('login-message', 'Preencha e-mail e senha.', true);
    return;
  }

  const user = getAllUsers().find(
    (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password
  );

  if (!user) {
    showMessage('login-message', 'E-mail ou senha incorretos.', true);
    return;
  }

  setAuthenticatedUser({ id: user.id, name: user.name, email: user.email, role: user.role });
  showMessage('login-message', 'Login realizado com sucesso! Redirecionando...', false);
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 800);
}

function renderProfilePage() {
  const user = getAuthenticatedUser();
  const profileInfo = document.querySelector('#profile-info');
  const profileActions = document.querySelector('#profile-actions');

  if (!profileInfo || !profileActions) {
    return;
  }

  if (!user) {
    profileInfo.innerHTML = `
      <div class="profile-summary">
        <div class="profile-card">
          <div class="profile-avatar">?</div>
          <div>
            <h2>Você não está autenticado</h2>
            <p>Faça login ou cadastre-se para acessar sua área.</p>
          </div>
        </div>
      </div>
    `;
    profileActions.innerHTML = `
      <a class="button button-primary" href="login.html">Entrar</a>
      <a class="button button-secondary" href="cadastro.html">Cadastrar</a>
    `;
    return;
  }

  const initials = getUserInitials(user.name);
  const roleLabel = user.role === 'teacher' ? 'Professor' : 'Aluno';
  const activeReservations = getUserReservations(user.id);
  const nextReturn = activeReservations.length > 0 ? '20 ago' : 'Nenhuma reserva ativa';

  profileInfo.innerHTML = `
    <div class="profile-summary">
      <div class="profile-card">
        <div class="profile-avatar" aria-hidden="true">${initials}</div>
        <div class="profile-details">
          <p class="profile-role">${roleLabel}</p>
          <h2>${user.name}</h2>
          <p>${user.email}</p>
        </div>
      </div>
      <div class="profile-stats">
        <article class="profile-metric">
          <p class="metric-label">Reservas ativas</p>
          <strong>${activeReservations.length}</strong>
        </article>
        <article class="profile-metric">
          <p class="metric-label">Livros lidos</p>
          <strong>14</strong>
        </article>
        <article class="profile-metric">
          <p class="metric-label">Próxima entrega</p>
          <strong>${nextReturn}</strong>
        </article>
      </div>
    </div>
    <div class="profile-details-panel">
      <h3>Sobre sua conta</h3>
      <dl class="details-list">
        <dt>Nome</dt>
        <dd>${user.name}</dd>
        <dt>E-mail</dt>
        <dd>${user.email}</dd>
        <dt>Função</dt>
        <dd>${roleLabel}</dd>
        <dt>Membro desde</dt>
        <dd>Junho de 2026</dd>
      </dl>
    </div>
  `;
  profileActions.innerHTML = `
    <a class="button button-secondary" href="catalogo.html">Ver catálogo</a>
    <a class="button button-secondary" href="reservas.html">Minhas reservas</a>
    <button class="button button-primary" id="logout-button" type="button">Sair</button>
  `;

  const logoutButton = document.querySelector('#logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearAuthentication();
      window.location.href = 'login.html';
    });
  }
}

if (document.querySelector('#login-form')) {
  document.querySelector('#login-form')?.addEventListener('submit', handleLoginFormSubmit);
}

if (document.querySelector('#signup-form')) {
  document.querySelector('#signup-form')?.addEventListener('submit', handleSignupFormSubmit);
}

if (window.location.pathname.includes('perfil.html')) {
  document.addEventListener('DOMContentLoaded', renderProfilePage);
}

if (window.location.pathname.includes('reservas.html')) {
  document.addEventListener('DOMContentLoaded', renderReservationsPage);
}

if (document.currentScript.src.includes('main.js') && window.location.pathname.includes('detalhes.html')) {
  document.addEventListener('DOMContentLoaded', loadBookDetails);
}

window.addEventListener('DOMContentLoaded', () => {
  renderNavUser();
  if (window.location.pathname.includes('catalogo.html')) {
    syncCatalogBookCards();
  }
  const page = window.location.pathname.split('/').pop();
  if (page === '' || page === 'index.html') {
    renderHome();
  }
});

// Executar também se o DOM já estiver carregado
if (window.location.pathname.includes('detalhes.html') && document.readyState !== 'loading') {
  loadBookDetails();
}
