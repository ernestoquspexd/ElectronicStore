const paginationModule = (() => {
    const catalogo = document.querySelector('.catalogo');
    const paginationList = document.querySelector('.pagination');
    const titulos = catalogo ? Array.from(catalogo.querySelectorAll('.seccion-titulo')) : [];
    const secciones = titulos.map((heading) => {
        const groupCards = [];
        let next = heading.nextElementSibling;

        while (next && !next.classList.contains('seccion-titulo')) {
            if (next.classList.contains('card')) {
                groupCards.push(next);
            }
            next = next.nextElementSibling;
        }

        return { heading, cards: groupCards };
    });
    const cards = secciones.flatMap((group) => group.cards);
    let currentPage = 1;
    let cardsPerPage = calcularCardsPorPagina();

    function calcularCardsPorPagina() {
        if (!catalogo) return 12;
        const availableWidth = catalogo.clientWidth;
        const cardFullWidth = 388; 
        const columns = Math.max(1, Math.floor((availableWidth + 28) / cardFullWidth));
        const rows = 4;
        return columns * rows;
    }

    function mostrarPagina(page, shouldScroll = false) {
        const pageCount = Math.max(1, Math.ceil(cards.length / cardsPerPage));
        if (page < 1) page = 1;
        if (page > pageCount) page = pageCount;
        currentPage = page;
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        cards.forEach((card, index) => {
            card.classList.toggle('oculto', index < startIndex || index >= endIndex);
        });

        actualizarTitulos();
        crearPaginacion(pageCount);

        if (shouldScroll) {
            scrollPrimerVisible();
        }
    }

    function actualizarTitulos() {
        secciones.forEach((section) => {
            const visibleCard = section.cards.some((card) => !card.classList.contains('oculto'));
            section.heading.classList.toggle('oculto', !visibleCard);
        });
    }

    function scrollPrimerVisible() {
        if (!catalogo) return;
        const firstVisible = catalogo.querySelector('.seccion-titulo:not(.oculto), .card:not(.oculto)');
        if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function scrollA(element) {
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function getSeccionPorId(sectionId) {
        return secciones.find((section) => section.heading.id === sectionId);
    }

    function paginaDeSeccion(section) {
        if (!section || section.cards.length === 0) return 1;
        const firstIndex = cards.indexOf(section.cards[0]);
        return Math.floor(firstIndex / cardsPerPage) + 1;
    }

    function irCategoria(sectionId) {
        const section = getSeccionPorId(sectionId);
        if (!section) return;
        const page = paginaDeSeccion(section);
        mostrarPagina(page, false);

        if (!section.heading.classList.contains('oculto')) {
            scrollA(section.heading);
        } else {
            const firstVisibleCard = section.cards.find((card) => !card.classList.contains('oculto'));
            scrollA(firstVisibleCard || section.heading);
        }
    }

    function initLinks() {
        const dropDownToggle = document.querySelector('li.dropdown > a');
        if (dropDownToggle) {
            dropDownToggle.addEventListener('click', (event) => {
                event.preventDefault();
            });
        }

        const categoryLinks = document.querySelectorAll(
            'a[href="#cocina"], a[href="#refrig"], a[href="#meson"]'
        );

        categoryLinks.forEach((link) => {
            const hash = link.getAttribute('href');
            const targetId = hash.slice(1);
            const section = getSeccionPorId(targetId);
            if (!section) return;

            link.addEventListener('click', (event) => {
                event.preventDefault();
                irCategoria(targetId);
                history.replaceState(null, '', hash);
            });
        });
    }

    function crearPaginacion(pageCount) {
        if (!paginationList) return;

        const pageButtons = [];
        pageButtons.push(
            `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">«</span>
                </a>
            </li>`
        );

        for (let i = 1; i <= pageCount; i += 1) {
            pageButtons.push(
                `<li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`
            );
        }

        pageButtons.push(
            `<li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">»</span>
                </a>
            </li>`
        );

        paginationList.innerHTML = pageButtons.join('');
        initEventosPaginacion();
    }

    function initEventosPaginacion() {
        const links = paginationList.querySelectorAll('.page-link');
        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetPage = Number(link.dataset.page);
                if (!Number.isNaN(targetPage)) {
                    mostrarPagina(targetPage, true);
                }
            });
        });
    }

    function handleResize() {
        const newCardsPerPage = calcularCardsPorPagina();
        if (newCardsPerPage !== cardsPerPage) {
            cardsPerPage = newCardsPerPage;
            const pageCount = Math.max(1, Math.ceil(cards.length / cardsPerPage));
            if (currentPage > pageCount) {
                currentPage = pageCount;
            }
            mostrarPagina(currentPage);
        }
    }

    function debounce(fn, delay = 120) {
        let timeout = null;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(fn, delay);
        };
    }

    if (cards.length > 0 && paginationList) {
        mostrarPagina(1);
        initLinks();

        if (location.hash) {
            const sectionId = location.hash.slice(1);
            if (getSeccionPorId(sectionId)) {
                irCategoria(sectionId);
            }
        }

        window.addEventListener('resize', debounce(handleResize, 150));
    }
})();
