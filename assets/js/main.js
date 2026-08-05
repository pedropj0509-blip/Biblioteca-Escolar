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
