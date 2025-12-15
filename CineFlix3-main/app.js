document.addEventListener("DOMContentLoaded", () => {
  // ✅ 1) IMAGE FALLBACK (fixes blank posters on GitHub Pages if a file path is wrong/missing)
  const makePlaceholder = (title = "Poster") => {
    const safe = String(title).replace(/&/g, "and").slice(0, 24);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#1A1F3B"/>
            <stop offset="1" stop-color="#3C4164"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <text x="50%" y="50%" fill="rgba(253,246,227,0.9)" font-size="46" font-family="Arial"
              text-anchor="middle" dominant-baseline="middle">${safe}</text>
        <text x="50%" y="58%" fill="rgba(253,246,227,0.6)" font-size="22" font-family="Arial"
              text-anchor="middle" dominant-baseline="middle">Image not found</text>
      </svg>
    `;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };

  const allImgs = document.querySelectorAll("img");
  allImgs.forEach((img) => {
    // only apply fallback once
    img.addEventListener("error", () => {
      const title =
        img.getAttribute("alt") ||
        img.closest(".movie-list-item")?.getAttribute("data-title") ||
        "Poster";
      img.src = makePlaceholder(title);
    });

    // optional performance improvement
    img.loading = "lazy";
    img.decoding = "async";
  });

  // ✅ 2) MENU ACTIVE STATE
  const menuItems = document.querySelectorAll(".menu-list-item");
  const menuLinks = document.querySelectorAll(".menu-link");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuItems.forEach((li) => li.classList.remove("active"));
      link.parentElement.classList.add("active");
    });
  });

  // ✅ 3) Mouse wheel scroll horizontally when hovering lists
  document.querySelectorAll(".movie-list").forEach((list) => {
    list.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          list.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );
  });

  // ✅ 4) SEARCH FILTER
  const input = document.getElementById("movieSearch");
  const clearBtn = document.getElementById("clearSearch");
  const items = Array.from(document.querySelectorAll(".movie-list-item"));

  const normalize = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, " ");

  // Don’t kill the whole script if one element is missing
  if (input && clearBtn && items.length > 0) {
    const filter = () => {
      const q = normalize(input.value);

      items.forEach((item) => {
        const title = normalize(item.getAttribute("data-title"));
        const match = title.includes(q);
        item.classList.toggle("is-hidden", q.length > 0 && !match);
      });
    };

    input.addEventListener("input", filter);

    clearBtn.addEventListener("click", () => {
      input.value = "";
      filter();
      input.focus();
    });

    filter();
  }
});