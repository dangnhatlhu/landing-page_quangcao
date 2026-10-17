const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navigation = document.querySelector(".primary-navigation");
const menuToggle = document.querySelector(".menu-toggle");
const showroomSection = document.querySelector("#showroom");
const showroomImage = document.querySelector("#showroom-car");
const selectedColorName = document.querySelector("#selected-color-name");
const colorButtons = [...document.querySelectorAll(".color-swatch")];
const infoDialog = document.querySelector(".info-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMessage = document.querySelector("#dialog-message");
const revealElements = document.querySelectorAll(".reveal");
const catalogForm = document.querySelector("#catalog-filters");
const catalogSearch = document.querySelector("#catalog-search");
const catalogVersion = document.querySelector("#catalog-version");
const catalogSort = document.querySelector("#catalog-sort");
const catalogPageSize = document.querySelector("#catalog-page-size");
const catalogGrid = document.querySelector("#version-grid");
const catalogResultCount = document.querySelector("#catalog-result-count");
const catalogPagination = document.querySelector("#catalog-pagination");
const catalogEmpty = document.querySelector("#catalog-empty");

document.documentElement.classList.add("js-enabled");
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const vehicleConcepts = [
  {
    id: "serein",
    name: "AUREL Serein",
    version: "standard",
    versionLabel: "Tiêu chuẩn · gợi ý",
    description: "Vẻ đẹp tối giản cho những hành trình thường nhật, nơi sự nhẹ nhàng là một lựa chọn tinh tế.",
    features: ["Ngôn ngữ thiết kế thuần giản", "Trải nghiệm tập trung vào người lái"],
    style: "version-visual-one",
  },
  {
    id: "serein-epure",
    name: "AUREL Serein Épure",
    version: "standard",
    versionLabel: "Tiêu chuẩn · gợi ý",
    description: "Một cách diễn giải thanh thoát, dành cho người yêu không gian gọn gàng và vẻ đẹp bền dáng.",
    features: ["Đường nét tinh giản", "Bảng màu cảm hứng trung tính"],
    style: "version-visual-four",
  },
  {
    id: "serein-urbane",
    name: "AUREL Serein Urbane",
    version: "standard",
    versionLabel: "Tiêu chuẩn · gợi ý",
    description: "Tinh thần thành thị hiện đại, cân bằng giữa vẻ chỉn chu và sự thoải mái mỗi ngày.",
    features: ["Dấu ấn đô thị đương đại", "Cảm hứng tiện nghi thường nhật"],
    style: "version-visual-seven",
  },
  {
    id: "elan",
    name: "AUREL Élan",
    version: "advanced",
    versionLabel: "Nâng cao · gợi ý",
    description: "Sắc thái cân bằng giữa tiện nghi, kết nối và cảm giác tự tin trong từng chuyển động.",
    features: ["Ý tưởng tiện nghi kết nối", "Chi tiết hoàn thiện giàu cảm xúc"],
    style: "version-visual-two",
  },
  {
    id: "elan-tourer",
    name: "AUREL Élan Tourer",
    version: "advanced",
    versionLabel: "Nâng cao · gợi ý",
    description: "Gợi ý phong cách năng động cho những chuyến đi dài hơn và lịch trình nhiều trải nghiệm.",
    features: ["Cảm hứng đồng hành linh hoạt", "Không gian ưu tiên sự thoáng đãng"],
    style: "version-visual-five",
  },
  {
    id: "elan-atelier",
    name: "AUREL Élan Atelier",
    version: "advanced",
    versionLabel: "Nâng cao · gợi ý",
    description: "Dấu ấn thiết kế giàu cá tính, nơi các chi tiết được hình dung như một lựa chọn riêng.",
    features: ["Điểm nhấn thiết kế khác biệt", "Cảm hứng cá nhân hóa"],
    style: "version-visual-eight",
  },
  {
    id: "nocturne",
    name: "AUREL Nocturne",
    version: "luxury",
    versionLabel: "Cao cấp (Luxury) · gợi ý",
    description: "Không gian mang dấu ấn riêng, dành cho người tìm kiếm sự điềm tĩnh và khác biệt kín đáo.",
    features: ["Ngôn ngữ thiết kế cao cấp", "Trải nghiệm cá nhân hóa trong ý tưởng"],
    style: "version-visual-three",
  },
  {
    id: "nocturne-atelier",
    name: "AUREL Nocturne Atelier",
    version: "luxury",
    versionLabel: "Cao cấp (Luxury) · gợi ý",
    description: "Một diễn giải sang trọng với cảm hứng thủ công và những đường nét trầm tĩnh.",
    features: ["Cảm hứng hoàn thiện tinh xảo", "Bảng màu sang trọng, tiết chế"],
    style: "version-visual-six",
  },
  {
    id: "nocturne-signature",
    name: "AUREL Nocturne Signature",
    version: "luxury",
    versionLabel: "Cao cấp (Luxury) · gợi ý",
    description: "Phiên bản ý tưởng dành cho người muốn biến mỗi chuyến đi thành dấu ấn cá nhân.",
    features: ["Ngôn ngữ thiết kế độc bản", "Ý tưởng trải nghiệm riêng tư"],
    style: "version-visual-nine",
  },
];

const validVersions = new Set(["all", "standard", "advanced", "luxury"]);
const validSorts = new Set(["featured", "name-asc", "name-desc"]);
const validPageSizes = new Set(["3", "6"]);
const versionImages = {
  standard: "assets/images/showroom-red.svg",
  advanced: "assets/images/showroom-black.svg",
  luxury: "assets/images/showroom-white.svg",
};
const initialParams = new URLSearchParams(window.location.search);
const catalogState = {
  query: initialParams.get("q") || "",
  version: validVersions.has(initialParams.get("version")) ? initialParams.get("version") : "all",
  sort: validSorts.has(initialParams.get("sort")) ? initialParams.get("sort") : "featured",
  pageSize: validPageSizes.has(initialParams.get("perPage")) ? Number(initialParams.get("perPage")) : 3,
  page: Math.max(1, Number.parseInt(initialParams.get("page"), 10) || 1),
};

function normalizeSearchText(value) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function getFilteredConcepts() {
  const normalizedQuery = normalizeSearchText(catalogState.query);
  const filteredConcepts = vehicleConcepts.filter((concept) => {
    const matchesVersion = catalogState.version === "all" || concept.version === catalogState.version;
    const searchableText = normalizeSearchText([
      concept.name,
      concept.versionLabel,
      concept.description,
      ...concept.features,
    ].join(" "));

    return matchesVersion && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  if (catalogState.sort === "name-asc") {
    filteredConcepts.sort((first, second) => first.name.localeCompare(second.name, "vi"));
  } else if (catalogState.sort === "name-desc") {
    filteredConcepts.sort((first, second) => second.name.localeCompare(first.name, "vi"));
  }

  return filteredConcepts;
}

function createVehicleCard(concept) {
  const card = document.createElement("article");
  card.className = "version-card catalog-card-enter";
  card.setAttribute("role", "listitem");

  const visual = document.createElement("div");
  visual.className = `version-visual ${concept.style}`;
  visual.setAttribute("aria-hidden", "true");

  const carImage = document.createElement("img");
  carImage.src = versionImages[concept.version];
  carImage.alt = "";
  carImage.width = 1080;
  carImage.height = 600;
  carImage.loading = "lazy";
  carImage.decoding = "async";
  carImage.className = "version-car-image";
  visual.append(carImage);

  const visualLabel = document.createElement("span");
  visualLabel.className = "version-card-label";
  visualLabel.textContent = "AUREL / CONCEPT";
  visual.append(visualLabel);

  const body = document.createElement("div");
  body.className = "version-body";

  const versionLabel = document.createElement("p");
  versionLabel.className = "eyebrow";
  versionLabel.textContent = concept.versionLabel;

  const name = document.createElement("h3");
  name.textContent = concept.name;

  const description = document.createElement("p");
  description.textContent = concept.description;

  const features = document.createElement("ul");
  concept.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    features.append(item);
  });

  const detailsButton = document.createElement("button");
  detailsButton.className = "text-link model-link";
  detailsButton.type = "button";
  detailsButton.dataset.model = concept.id;
  detailsButton.append(document.createTextNode("Tìm hiểu thêm "));

  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  detailsButton.append(arrow);

  body.append(versionLabel, name, description, features, detailsButton);
  card.append(visual, body);
  return card;
}

function updateCatalogUrl() {
  const params = new URLSearchParams();
  if (catalogState.query.trim()) params.set("q", catalogState.query.trim());
  if (catalogState.version !== "all") params.set("version", catalogState.version);
  if (catalogState.sort !== "featured") params.set("sort", catalogState.sort);
  if (catalogState.page > 1) params.set("page", String(catalogState.page));
  if (catalogState.pageSize !== 3) params.set("perPage", String(catalogState.pageSize));

  const queryString = params.toString();
  const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

function createPageButton(label, page, options = {}) {
  const button = document.createElement("button");
  button.className = "page-button";
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", options.ariaLabel || `Trang ${page}`);
  button.disabled = Boolean(options.disabled);

  if (options.current) button.setAttribute("aria-current", "page");
  if (!button.disabled) {
    button.addEventListener("click", () => {
      catalogState.page = page;
      renderCatalog();
      document.querySelector("#versions-title").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    });
  }
  return button;
}

function renderPagination(pageCount) {
  catalogPagination.replaceChildren();
  if (pageCount <= 1) return;

  catalogPagination.append(
    createPageButton("←", catalogState.page - 1, {
      ariaLabel: "Trang trước",
      disabled: catalogState.page === 1,
    }),
  );

  for (let page = 1; page <= pageCount; page += 1) {
    catalogPagination.append(createPageButton(String(page), page, { current: page === catalogState.page }));
  }

  catalogPagination.append(
    createPageButton("→", catalogState.page + 1, {
      ariaLabel: "Trang tiếp theo",
      disabled: catalogState.page === pageCount,
    }),
  );
}

function renderCatalog() {
  const filteredConcepts = getFilteredConcepts();
  const pageCount = Math.ceil(filteredConcepts.length / catalogState.pageSize);
  catalogState.page = Math.min(catalogState.page, Math.max(pageCount, 1));

  const startIndex = (catalogState.page - 1) * catalogState.pageSize;
  const pageConcepts = filteredConcepts.slice(startIndex, startIndex + catalogState.pageSize);
  catalogGrid.replaceChildren(...pageConcepts.map(createVehicleCard));
  catalogGrid.hidden = filteredConcepts.length === 0;
  catalogEmpty.hidden = filteredConcepts.length > 0;

  if (filteredConcepts.length > 0) {
    const firstResult = startIndex + 1;
    const lastResult = Math.min(startIndex + catalogState.pageSize, filteredConcepts.length);
    catalogResultCount.innerHTML = `Hiển thị <strong>${firstResult}–${lastResult}</strong> trong số <strong>${filteredConcepts.length}</strong> gợi ý minh họa`;
  } else {
    catalogResultCount.textContent = "Không có gợi ý phù hợp";
  }

  catalogSearch.value = catalogState.query;
  catalogVersion.value = catalogState.version;
  catalogSort.value = catalogState.sort;
  catalogPageSize.value = String(catalogState.pageSize);
  renderPagination(pageCount);
  updateCatalogUrl();
}

function resetCatalog() {
  catalogState.query = "";
  catalogState.version = "all";
  catalogState.sort = "featured";
  catalogState.page = 1;
  catalogState.pageSize = 3;
  renderCatalog();
}

catalogForm.addEventListener("submit", (event) => event.preventDefault());
catalogSearch.addEventListener("input", () => {
  catalogState.query = catalogSearch.value;
  catalogState.page = 1;
  renderCatalog();
});
catalogVersion.addEventListener("change", () => {
  catalogState.version = catalogVersion.value;
  catalogState.page = 1;
  renderCatalog();
});
catalogSort.addEventListener("change", () => {
  catalogState.sort = catalogSort.value;
  catalogState.page = 1;
  renderCatalog();
});
catalogPageSize.addEventListener("change", () => {
  catalogState.pageSize = Number(catalogPageSize.value);
  catalogState.page = 1;
  renderCatalog();
});
catalogForm.addEventListener("reset", (event) => {
  event.preventDefault();
  resetCatalog();
});
document.querySelector("[data-clear-catalog]").addEventListener("click", resetCatalog);
catalogGrid.addEventListener("click", (event) => {
  const detailsButton = event.target.closest(".model-link");
  if (!detailsButton) return;

  const concept = vehicleConcepts.find((item) => item.id === detailsButton.dataset.model);
  if (concept) {
    openInfoDialog(
      concept.name,
      `${concept.description} Phiên bản, tên gọi và trang bị trên website này chỉ mang tính minh họa.`,
    );
  }
});
renderCatalog();

const carColors = {
  red: {
    name: "Đỏ ánh kim",
    image: "assets/images/showroom-red.svg",
    alt: "Mẫu xe AUREL minh họa màu đỏ ánh kim, góc nhìn ba phần tư phía trước",
  },
  black: {
    name: "Đen huyền",
    image: "assets/images/showroom-black.svg",
    alt: "Mẫu xe AUREL minh họa màu đen huyền, góc nhìn ba phần tư phía trước",
  },
  white: {
    name: "Trắng ngọc",
    image: "assets/images/showroom-white.svg",
    alt: "Mẫu xe AUREL minh họa màu trắng ngọc, góc nhìn ba phần tư phía trước",
  },
};

const preloadedShowroomImages = [];
function preloadShowroomImages() {
  Object.values(carColors).forEach(({ image }) => {
    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = image;
    preloadedShowroomImages.push(preloadImage);
  });
}

if ("IntersectionObserver" in window) {
  const showroomPreloadObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      preloadShowroomImages();
      observer.disconnect();
    }
  }, { rootMargin: "300px" });

  showroomPreloadObserver.observe(showroomSection);
} else {
  preloadShowroomImages();
}

function closeNavigation() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Mở menu điều hướng");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Mở menu điều hướng" : "Đóng menu điều hướng");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

function selectCarColor(colorKey) {
  const color = carColors[colorKey];
  if (!color) return;

  colorButtons.forEach((button) => {
    const isSelected = button.dataset.color === colorKey;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  selectedColorName.textContent = color.name;
  showroomImage.classList.add("is-changing");

  const updateImage = () => {
    showroomImage.src = color.image;
    showroomImage.alt = color.alt;
    requestAnimationFrame(() => showroomImage.classList.remove("is-changing"));
  };

  if (prefersReducedMotion.matches) {
    updateImage();
  } else {
    window.setTimeout(updateImage, 160);
  }
}

colorButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectCarColor(button.dataset.color));
  button.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % colorButtons.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + colorButtons.length) % colorButtons.length;
    } else {
      return;
    }

    event.preventDefault();
    colorButtons[nextIndex].focus();
    colorButtons[nextIndex].click();
  });
});

function openInfoDialog(title, message) {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  if (typeof infoDialog.showModal === "function") {
    infoDialog.showModal();
  } else {
    window.alert(`${title}\n\n${message}`);
  }
}

document.querySelector("[data-open-contact]").addEventListener("click", () => {
  openInfoDialog(
    "Đăng ký nhận tư vấn",
    "Đây là giao diện demo, chưa thu thập thông tin cá nhân. Hãy thay nội dung này bằng kênh liên hệ chính thức trước khi đưa website vào sử dụng.",
  );
});

document.querySelectorAll("[data-demo-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openInfoDialog(
      link.dataset.demoLink,
      "Đây là liên kết minh họa. Trang mạng xã hội chính thức sẽ được cập nhật khi có thông tin xác thực.",
    );
  });
});

infoDialog.querySelector(".dialog-confirm").addEventListener("click", () => infoDialog.close());
infoDialog.addEventListener("click", (event) => {
  if (event.target === infoDialog) infoDialog.close();
});

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const zaloButton = document.querySelector(".zalo-button");
let zaloAnimationInterval;
function syncZaloAnimation() {
  window.clearInterval(zaloAnimationInterval);
  zaloButton.classList.remove("is-ringing");

  if (!prefersReducedMotion.matches) {
    zaloAnimationInterval = window.setInterval(() => {
      zaloButton.classList.remove("is-ringing");
      requestAnimationFrame(() => zaloButton.classList.add("is-ringing"));
    }, 5000);
  }
}

syncZaloAnimation();
prefersReducedMotion.addEventListener?.("change", syncZaloAnimation);
