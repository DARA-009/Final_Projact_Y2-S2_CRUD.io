// ===== LOCAL STORAGE HELPERS =====
function saveToStorage() {
  try {
    localStorage.setItem("products", JSON.stringify(products || []));
    localStorage.setItem("categories", JSON.stringify(categories || []));
    localStorage.setItem("orders", JSON.stringify(orders || []));
    localStorage.setItem("users", JSON.stringify(users || []));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    if (typeof showToast === "function") {
      showToast("Error saving data", "error");
    }
  }
}

function loadFromStorage() {
  try {
    products = JSON.parse(localStorage.getItem("products")) || [];
    categories = JSON.parse(localStorage.getItem("categories")) || [];
    orders = JSON.parse(localStorage.getItem("orders")) || [];
    users = JSON.parse(localStorage.getItem("users")) || [];

    // Ensure all data is arrays
    if (!Array.isArray(products)) products = [];
    if (!Array.isArray(categories)) categories = [];
    if (!Array.isArray(orders)) orders = [];
    if (!Array.isArray(users)) users = [];

    // Validate and sanitize users
    users = users.filter((user) => user && typeof user === "object");
    users = users.map((user) => ({
      id: user.id || Date.now(),
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "User",
      status: user.status || "Active",
      phone: user.phone || "",
    }));
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    products = [];
    categories = [];
    orders = [];
    users = [];
  }
}

// ===== SAMPLE DATA INITIALIZATION =====
function initializeSampleData() {
  let needsSave = false;

  if (!Array.isArray(products) || products.length === 0) {
    products = [
    
    ];
    needsSave = true;
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    categories = [
     
    ];
    needsSave = true;
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    orders = [
      
    ];
    needsSave = true;
  }

  if (!Array.isArray(users) || users.length === 0) {
    users = [
     
    ];
    needsSave = true;
  }

  if (needsSave) {
    saveToStorage();
  }
}

// ===== GLOBAL VARIABLES =====
let products = [];
let categories = [];
let orders = [];
let users = [];

// ===== GLOBAL MODAL INSTANCES =====
let productModal, categoryModal, orderModal, userModal, deleteModal;
let currentDeleteId = null,
  currentDeleteType = null;

// ===== HELPER FUNCTION: Escape HTML for XSS Prevention =====
function escapeHtml(text) {
  if (text === undefined || text === null) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

// ===== HELPER FUNCTION: Get Order Status Badge Class =====
function getOrderStatusBadge(status) {
  switch (status) {
    case "Completed":
      return "badge-success";
    case "Processing":
      return "badge-warning";
    case "Pending":
      return "badge-secondary";
    case "Cancelled":
      return "badge-danger";
    default:
      return "badge-secondary";
  }
}

// ===== HELPER FUNCTION: Validate Email =====
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ===== SCROLL EFFECT FOR HEADER =====
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

// ===== INITIALIZE MODALS =====
function initializeModals() {
  try {
    const productModalEl = document.getElementById("productModal");
    if (productModalEl) productModal = new bootstrap.Modal(productModalEl);

    const categoryModalEl = document.getElementById("categoryModal");
    if (categoryModalEl) categoryModal = new bootstrap.Modal(categoryModalEl);

    const orderModalEl = document.getElementById("orderModal");
    if (orderModalEl) orderModal = new bootstrap.Modal(orderModalEl);

    const userModalEl = document.getElementById("userModal");
    if (userModalEl) userModal = new bootstrap.Modal(userModalEl);

    const deleteModalEl = document.getElementById("deleteModal");
    if (deleteModalEl) deleteModal = new bootstrap.Modal(deleteModalEl);
  } catch (error) {
    console.error("Error initializing modals:", error);
  }
}

// ===== MODAL BACKDROP FIX =====
function fixModalBackdrop() {
  document.addEventListener("shown.bs.modal", function () {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => {
      backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    });
    document.body.classList.add("modal-open");
  });

  document.addEventListener("hidden.bs.modal", function () {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    if (backdrops.length > 1) {
      for (let i = 1; i < backdrops.length; i++) {
        backdrops[i].remove();
      }
    }
  });
}

// ===== MOBILE MENU FUNCTIONS =====
function addMobileMenuButton() {
  if (!document.querySelector(".mobile-menu-toggle")) {
    const btn = document.createElement("button");
    btn.className = "mobile-menu-toggle";
    btn.innerHTML = '<i class="bi bi-list"></i>';
    btn.onclick = toggleMobileMenu;
    document.body.appendChild(btn);
  }
}

function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

// ===== MOBILE SEARCH FUNCTION =====
function initMobileSearch() {
  if (document.querySelector(".mobile-search-icon")) return;

  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  const searchIcon = document.createElement("div");
  searchIcon.className = "mobile-search-icon";
  searchIcon.innerHTML = '<i class="bi bi-search"></i>';
  headerActions.insertBefore(searchIcon, headerActions.firstChild);

  if (document.querySelector(".mobile-search-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "mobile-search-overlay";
  overlay.innerHTML = `
    <i class="bi bi-search"></i>
    <input type="text" id="mobileSearchInput" placeholder="Search products, orders, users...">
    <div class="mobile-search-close"><i class="bi bi-x-lg"></i></div>
  `;
  document.body.appendChild(overlay);

  searchIcon.addEventListener("click", () => {
    overlay.classList.add("active");
    setTimeout(
      () => document.getElementById("mobileSearchInput")?.focus(),
      300,
    );
  });

  document
    .querySelector(".mobile-search-close")
    ?.addEventListener("click", () => {
      overlay.classList.remove("active");
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      overlay.classList.remove("active");
    }
  });

  document
    .getElementById("mobileSearchInput")
    ?.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      handleMobileSearch(searchTerm);
    });
}

function handleMobileSearch(term) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (currentPage === "products.html") {
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term),
    );
    displayFilteredProducts(filtered);
  } else if (currentPage === "categories.html") {
    const filtered = categories.filter((c) => c.toLowerCase().includes(term));
    displayFilteredCategories(filtered);
  } else if (currentPage === "orders.html") {
    const filtered = orders.filter(
      (o) =>
        o.name?.toLowerCase().includes(term) ||
        o.product?.toLowerCase().includes(term) ||
        o.status?.toLowerCase().includes(term),
    );
    displayFilteredOrders(filtered);
  } else if (currentPage === "users.html") {
    const filtered = users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term),
    );
    displayFilteredUsers(filtered);
  }
}

// ===== HAMBURGER MENU FUNCTIONALITY =====
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.querySelector(".sidebar");
  const header = document.querySelector(".header");
  const mainWrapper = document.querySelector(".main-wrapper");

  if (!hamburgerBtn || !sidebar || !header || !mainWrapper) return;

  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed && window.innerWidth > 768) {
    sidebar.classList.add("collapsed");
    header.classList.add("expanded");
    mainWrapper.classList.add("expanded");
    const icon = hamburgerBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-arrow-right");
    }
  }

  hamburgerBtn.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("open");
    } else {
      sidebar.classList.toggle("collapsed");
      header.classList.toggle("expanded");
      mainWrapper.classList.toggle("expanded");

      localStorage.setItem(
        "sidebarCollapsed",
        sidebar.classList.contains("collapsed"),
      );

      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        if (sidebar.classList.contains("collapsed")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-arrow-right");
        } else {
          icon.classList.remove("fa-arrow-right");
          icon.classList.add("fa-bars");
        }
      }
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("collapsed");
      header.classList.remove("expanded");
      mainWrapper.classList.remove("expanded");

      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-arrow-right");
        icon.classList.add("fa-bars");
      }

      localStorage.setItem("sidebarCollapsed", "false");
    }
  });
}

// ===== DOCUMENT READY =====
document.addEventListener("DOMContentLoaded", function () {
  loadFromStorage();
  initializeSampleData();
  initializeModals();
  fixModalBackdrop();
  addMobileMenuButton();
  initMobileSearch();
  initHamburgerMenu();
  loadPageData();
  updateDropdowns();
});

// ===== LOAD PAGE SPECIFIC DATA =====
function loadPageData() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (currentPage === "index.html") {
    loadAllData();
    setupSearch();
  } else if (currentPage === "products.html") {
    loadProducts();
    setupSearch("products");
  } else if (currentPage === "categories.html") {
    loadCategories();
    setupSearch("categories");
  } else if (currentPage === "orders.html") {
    loadOrders();
    setupSearch("orders");
  } else if (currentPage === "users.html") {
    loadUsers();
    setupSearch("users");
  }
}

// ===== SETUP SEARCH =====
function setupSearch(page = "") {
  const pageCapitalized = page
    ? page.charAt(0).toUpperCase() + page.slice(1)
    : "";
  const searchInput = document.getElementById(`search${pageCapitalized}`);

  if (!searchInput) return;

  searchInput.addEventListener("keyup", function (e) {
    const term = e.target.value.toLowerCase();

    if (page === "products") {
      const filtered = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term),
      );
      displayFilteredProducts(filtered);
    } else if (page === "categories") {
      const filtered = categories.filter((c) => c.toLowerCase().includes(term));
      displayFilteredCategories(filtered);
    } else if (page === "orders") {
      const filtered = orders.filter(
        (o) =>
          o.name?.toLowerCase().includes(term) ||
          o.product?.toLowerCase().includes(term) ||
          o.status?.toLowerCase().includes(term),
      );
      displayFilteredOrders(filtered);
    } else if (page === "users") {
      const filtered = users.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(term) ||
          u.lastName?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.role?.toLowerCase().includes(term),
      );
      displayFilteredUsers(filtered);
    }
  });
}

// ===== LOAD ALL DATA FOR DASHBOARD =====
function loadAllData() {
  const totalProducts = document.getElementById("totalProducts");
  const totalOrders = document.getElementById("totalOrders");
  const totalCategories = document.getElementById("totalCategories");
  const totalUsers = document.getElementById("totalUsers");

  if (totalProducts) totalProducts.textContent = products.length;
  if (totalOrders) totalOrders.textContent = orders.length;
  if (totalCategories) totalCategories.textContent = categories.length;
  if (totalUsers) totalUsers.textContent = users.length;

  loadDashboardProducts();
  loadDashboardCategories();
  loadDashboardOrders();
  loadDashboardUsers();
}

// ===== DASHBOARD TABLES =====
function loadDashboardProducts() {
  const tbody = document.getElementById("dashboardProducts");
  if (tbody) {
    if (!Array.isArray(products) || products.length === 0) {
      tbody.innerHTML =
        '<td colspan="5" class="text-center">No products found</td> </tr>';
      return;
    }

    tbody.innerHTML = products
      .slice(0, 5)
      .map(
        (p) => `
          <tr>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category)}</td>
            <td>$${parseFloat(p.price).toFixed(2)}</td>
            <td>${parseInt(p.qty)}</td>
            <td><span class="badge ${p.qty > 10 ? "badge-success" : "badge-warning"}">${p.qty > 10 ? "In Stock" : "Low Stock"}</span></td>
          </tr>
        `,
      )
      .join("");
  }
}

function loadDashboardCategories() {
  const tbody = document.getElementById("dashboardCategories");
  if (tbody) {
    if (!Array.isArray(categories) || categories.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="3" class="text-center">No categories found</td></tr>';
      return;
    }

    tbody.innerHTML = categories
      .slice(0, 5)
      .map(
        (c, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(c)}</td>
            <td>${products.filter((p) => p.category === c).length}</td>
          </tr>
        `,
      )
      .join("");
  }
}

function loadDashboardOrders() {
  const tbody = document.getElementById("dashboardOrders");
  if (tbody) {
    if (!Array.isArray(orders) || orders.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center">No orders found</td></tr>';
      return;
    }

    tbody.innerHTML = orders
      .slice(0, 5)
      .map(
        (o) => `
          <tr>
            <td>${escapeHtml(o.name)}</td>
            <td>${escapeHtml(o.product)}</td>
            <td>${parseInt(o.qty)}</td>
            <td>${escapeHtml(o.date)}</td>
          </tr>
        `,
      )
      .join("");
  }
}

function loadDashboardUsers() {
  const tbody = document.getElementById("dashboardUsers");
  if (tbody) {
    if (!Array.isArray(users) || users.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = users
      .slice(0, 5)
      .map(
        (u) => `
          <tr>
            <td>${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</td>
            <td>${escapeHtml(u.email)}</td>
            <td><span class="badge bg-secondary">${escapeHtml(u.role)}</span></td>
            <td><span class="badge ${u.status === "Active" ? "badge-success" : "badge-danger"}">${escapeHtml(u.status)}</span></td>
          </tr>
        `,
      )
      .join("");
  }
}

// ===== PRODUCT FUNCTIONS =====
function openProductModal() {
  const titleEl = document.getElementById("productModalTitle");
  const formEl = document.getElementById("productForm");
  const idEl = document.getElementById("productId");

  if (titleEl) titleEl.textContent = "Add Product";
  if (formEl) formEl.reset();
  if (idEl) idEl.value = "";
  updateDropdowns();

  if (productModal) productModal.show();
}

function loadProducts() {
  const tbody = document.getElementById("productsTable");
  if (!tbody) return;

  if (!Array.isArray(products)) {
    console.error("Products data is not available");
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Error loading products</td></tr>';
    return;
  }

  if (products.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = products
    .map(
      (p) => `
        <tr>
          <td>${escapeHtml(p.id)}</td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td>${escapeHtml(p.category)}</td>
          <td>$${parseFloat(p.price).toFixed(2)}</td>
          <td>${parseInt(p.qty)}</td>
          <td>${p.description ? escapeHtml(p.description) : "-"}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editProduct(${p.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('product', ${p.id}, '${escapeHtml(p.name)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function displayFilteredProducts(filtered) {
  const tbody = document.getElementById("productsTable");
  if (!tbody) return;

  if (!Array.isArray(filtered) || filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (p) => `
        <tr>
          <td>${escapeHtml(p.id)}</td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td>${escapeHtml(p.category)}</td>
          <td>$${parseFloat(p.price).toFixed(2)}</td>
          <td>${parseInt(p.qty)}</td>
          <td>${p.description ? escapeHtml(p.description) : "-"}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editProduct(${p.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('product', ${p.id}, '${escapeHtml(p.name)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function saveProduct() {
  const name = document.getElementById("productName")?.value?.trim();
  const price = parseFloat(document.getElementById("productPrice")?.value);
  const qty = parseInt(document.getElementById("productQty")?.value);
  const category = document.getElementById("productCategory")?.value;
  const desc = document.getElementById("productDesc")?.value?.trim();
  const id = document.getElementById("productId")?.value;

  if (!name || !price || !qty || !category) {
    showToast("Please fill all required fields", "error");
    return;
  }

  if (isNaN(price) || price <= 0) {
    showToast("Please enter a valid price", "error");
    return;
  }

  if (isNaN(qty) || qty < 0) {
    showToast("Please enter a valid quantity", "error");
    return;
  }

  if (id) {
    const index = products.findIndex((p) => p.id === parseInt(id));
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name,
        price,
        qty,
        category,
        description: desc,
      };
      showToast("Product updated successfully");
    }
  } else {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name,
      price,
      qty,
      category,
      description: desc,
    };
    products.push(newProduct);
    showToast("Product added successfully");
  }

  saveToStorage();
  if (productModal) productModal.hide();
  loadProducts();
  loadAllData();
  updateDropdowns();
}

function editProduct(id) {
  const p = products.find((p) => p.id === id);
  if (p) {
    document.getElementById("productModalTitle").textContent = "Edit Product";
    document.getElementById("productId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productQty").value = p.qty;
    document.getElementById("productCategory").value = p.category;
    document.getElementById("productDesc").value = p.description || "";
    updateDropdowns();
    if (productModal) productModal.show();
  } else {
    showToast("Product not found", "error");
  }
}

// ===== CATEGORY FUNCTIONS =====
function openCategoryModal() {
  document.getElementById("categoryModalTitle").textContent = "Add Category";
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryId").value = "";
  if (categoryModal) categoryModal.show();
}

function loadCategories() {
  const tbody = document.getElementById("categoriesTable");
  if (!tbody) return;

  if (!Array.isArray(categories)) {
    console.error("Categories data is not available");
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-danger">Error loading categories</td></tr>';
    return;
  }

  if (categories.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
    return;
  }

  tbody.innerHTML = categories
    .map(
      (c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${escapeHtml(c)}</strong></td>
          <td>${products.filter((p) => p.category === c).length}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editCategory(${i})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('category', ${i}, '${escapeHtml(c)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function displayFilteredCategories(filtered) {
  const tbody = document.getElementById("categoriesTable");
  if (!tbody) return;

  if (!Array.isArray(filtered) || filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map((c, i) => {
      const originalIndex = categories.findIndex((cat) => cat === c);
      return `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${escapeHtml(c)}</strong></td>
          <td>${products.filter((p) => p.category === c).length}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editCategory(${originalIndex})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('category', ${originalIndex}, '${escapeHtml(c)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function saveCategory() {
  const catId = document.getElementById("categoryId")?.value;
  const catName = document.getElementById("categoryName")?.value?.trim();

  if (!catName) {
    showToast("Please enter category name", "error");
    return;
  }

  const existingCategory = categories.find(
    (c) => c.toLowerCase() === catName.toLowerCase(),
  );

  if (catId) {
    const index = parseInt(catId);
    if (index >= 0 && index < categories.length) {
      const oldName = categories[index];

      if (existingCategory && existingCategory !== oldName) {
        showToast("Category name already exists", "error");
        return;
      }

      products.forEach((p) => {
        if (p.category === oldName) {
          p.category = catName;
        }
      });

      categories[index] = catName;

      showToast("Category updated successfully");
      saveToStorage();
      if (categoryModal) categoryModal.hide();
      loadCategories();
      loadAllData();
      updateDropdowns();
    }
  } else {
    if (!existingCategory) {
      categories.push(catName);
      saveToStorage();
      showToast("Category added successfully");
      if (categoryModal) categoryModal.hide();
      loadCategories();
      loadAllData();
      updateDropdowns();
    } else {
      showToast("Category already exists", "error");
    }
  }
}

function editCategory(index) {
  if (index >= 0 && index < categories.length) {
    const categoryName = categories[index];

    document.getElementById("categoryModalTitle").textContent = "Edit Category";
    document.getElementById("categoryId").value = index;
    document.getElementById("categoryName").value = categoryName;

    if (categoryModal) categoryModal.show();
  }
}

// ===== ORDER FUNCTIONS =====
function openOrderModal() {
  document.getElementById("orderModalTitle").textContent = "Add Order";
  document.getElementById("orderForm").reset();
  document.getElementById("orderId").value = "";

  const dateEl = document.getElementById("orderDate");
  if (dateEl) {
    const today = new Date().toISOString().split("T")[0];
    dateEl.value = today;
  }

  updateDropdowns();
  if (orderModal) orderModal.show();
}

function loadOrders() {
  const tbody = document.getElementById("ordersTable");
  if (!tbody) return;

  if (!Array.isArray(orders)) {
    console.error("Orders data is not available");
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Error loading orders</td></tr>';
    return;
  }

  if (orders.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = orders
    .map(
      (o) => `
        <tr>
          <td>${escapeHtml(o.id)}</td>
          <td><strong>${escapeHtml(o.name)}</strong></td>
          <td>${escapeHtml(o.product)}</td>
          <td>${parseInt(o.qty)}</td>
          <td>${escapeHtml(o.date)}</td>
          <td><span class="badge ${getOrderStatusBadge(o.status)}">${escapeHtml(o.status)}</span></td>
          <td>
            <button class="action-btn btn-edit" onclick="editOrder(${o.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('order', ${o.id}, '${escapeHtml(o.name)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function displayFilteredOrders(filtered) {
  const tbody = document.getElementById("ordersTable");
  if (!tbody) return;

  if (!Array.isArray(filtered) || filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (o) => `
        <tr>
          <td>${escapeHtml(o.id)}</td>
          <td><strong>${escapeHtml(o.name)}</strong></td>
          <td>${escapeHtml(o.product)}</td>
          <td>${parseInt(o.qty)}</td>
          <td>${escapeHtml(o.date)}</td>
          <td><span class="badge ${getOrderStatusBadge(o.status)}">${escapeHtml(o.status)}</span></td>
          <td>
            <button class="action-btn btn-edit" onclick="editOrder(${o.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteItem('order', ${o.id}, '${escapeHtml(o.name)}')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function saveOrder() {
  const id = document.getElementById("orderId")?.value;
  const name = document.getElementById("orderName")?.value?.trim();
  const pname = document.getElementById("orderProduct")?.value;
  const qty = parseInt(document.getElementById("orderQty")?.value);
  const date = document.getElementById("orderDate")?.value;
  const status = document.getElementById("orderStatus")?.value || "Pending";

  if (!name || !pname || !qty || !date) {
    showToast("Please fill all required fields", "error");
    return;
  }

  if (isNaN(qty) || qty <= 0) {
    showToast("Please enter a valid quantity", "error");
    return;
  }

  const prod = products.find((p) => p.name === pname);

  if (id) {
    const existingOrderIndex = orders.findIndex((o) => o.id === parseInt(id));

    if (existingOrderIndex !== -1) {
      const oldOrder = orders[existingOrderIndex];

      if (oldOrder.product !== pname || oldOrder.qty !== qty) {
        const oldProd = products.find((p) => p.name === oldOrder.product);
        if (oldProd) {
          oldProd.qty = (oldProd.qty || 0) + oldOrder.qty;
        }

        if (prod && (prod.qty || 0) < qty) {
          if (oldProd) {
            oldProd.qty = (oldProd.qty || 0) - oldOrder.qty;
          }
          showToast(
            `Insufficient stock for ${pname}! Available: ${prod.qty || 0}`,
            "error",
          );
          return;
        }

        if (prod) {
          prod.qty = (prod.qty || 0) - qty;
        }
      }

      orders[existingOrderIndex] = {
        ...orders[existingOrderIndex],
        name,
        product: pname,
        qty,
        date,
        status,
      };

      showToast("Order updated successfully");
    }
  } else {
    if (prod && (prod.qty || 0) < qty) {
      showToast(`Insufficient stock! Available: ${prod.qty || 0}`, "error");
      return;
    }

    if (prod) {
      prod.qty = (prod.qty || 0) - qty;
    }

    const newId =
      orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const newOrder = {
      id: newId,
      name,
      product: pname,
      qty,
      date,
      status,
    };
    orders.push(newOrder);
    showToast("Order added successfully");
  }

  saveToStorage();
  if (orderModal) orderModal.hide();
  loadOrders();
  loadAllData();
  updateDropdowns();
}

function editOrder(id) {
  const order = orders.find((o) => o.id === id);

  if (order) {
    document.getElementById("orderModalTitle").textContent = "Edit Order";
    document.getElementById("orderId").value = order.id;
    document.getElementById("orderName").value = order.name;
    document.getElementById("orderProduct").value = order.product;
    document.getElementById("orderQty").value = order.qty;
    document.getElementById("orderDate").value = order.date;
    document.getElementById("orderStatus").value = order.status;

    updateDropdowns();
    if (orderModal) orderModal.show();
  } else {
    showToast("Order not found", "error");
  }
}

// ===== USER FUNCTIONS =====
function openUserModal() {
  const titleEl = document.getElementById("userModalTitle");
  const formEl = document.getElementById("userForm");
  const idEl = document.getElementById("userId");

  if (titleEl) titleEl.textContent = "Add User";
  if (formEl) formEl.reset();
  if (idEl) idEl.value = "";

  if (userModal) userModal.show();
}

function loadUsers() {
  const tbody = document.getElementById("usersTable");
  if (!tbody) {
    console.error("Users table body not found");
    return;
  }

  if (!users) {
    users = [];
  }

  if (!Array.isArray(users)) {
    console.error("Users is not an array:", users);
    users = [];
  }

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No users found.  </tr>';
    return;
  }

  try {
    tbody.innerHTML = users
      .map((user) => {
        const safeUser = {
          id: user.id || "N/A",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: user.role || "User",
          status: user.status || "Active",
          phone: user.phone || "",
        };

        return `
          <tr>
            <td>${escapeHtml(String(safeUser.id))}</td>
            <td><strong>${escapeHtml(safeUser.firstName)} ${escapeHtml(safeUser.lastName)}</strong></td>
            <td>${escapeHtml(safeUser.email)}</td>
            <td><span class="badge bg-secondary">${escapeHtml(safeUser.role)}</span></td>
            <td><span class="badge ${safeUser.status === "Active" ? "badge-success" : "badge-danger"}">${escapeHtml(safeUser.status)}</span></td>
            <td>${safeUser.phone ? escapeHtml(safeUser.phone) : "-"}</td>
            <td>
              <button class="action-btn btn-edit" onclick="editUser(${safeUser.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="action-btn btn-delete" onclick="deleteItem('user', ${safeUser.id}, '${escapeHtml(safeUser.firstName)} ${escapeHtml(safeUser.lastName)}')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error rendering users:", error);
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Error loading users. Please refresh the page.</td></tr>';
  }
}

function displayFilteredUsers(filtered) {
  const tbody = document.getElementById("usersTable");
  if (!tbody) return;

  if (!Array.isArray(filtered) || filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No matching users found</td></tr>';
    return;
  }

  try {
    tbody.innerHTML = filtered
      .map((user) => {
        const safeUser = {
          id: user.id || "N/A",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: user.role || "User",
          status: user.status || "Active",
          phone: user.phone || "",
        };

        return `
          <tr>
            <td>${escapeHtml(String(safeUser.id))}</td>
            <td><strong>${escapeHtml(safeUser.firstName)} ${escapeHtml(safeUser.lastName)}</strong></td>
            <td>${escapeHtml(safeUser.email)}</td>
            <td><span class="badge bg-secondary">${escapeHtml(safeUser.role)}</span></td>
            <td><span class="badge ${safeUser.status === "Active" ? "badge-success" : "badge-danger"}">${escapeHtml(safeUser.status)}</span></td>
            <td>${safeUser.phone ? escapeHtml(safeUser.phone) : "-"}</td>
            <td>
              <button class="action-btn btn-edit" onclick="editUser(${safeUser.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="action-btn btn-delete" onclick="deleteItem('user', ${safeUser.id}, '${escapeHtml(safeUser.firstName)} ${escapeHtml(safeUser.lastName)}')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error rendering filtered users:", error);
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Error displaying results</td></tr>';
  }
}

function editUser(id) {
  if (!users || !Array.isArray(users)) {
    showToast("Users data not available", "error");
    return;
  }

  const numericId = typeof id === "string" ? parseInt(id) : id;
  const user = users.find((u) => u.id === numericId || u.id === id);

  if (user) {
    const modalTitle = document.getElementById("userModalTitle");
    const userIdEl = document.getElementById("userId");
    const firstNameEl = document.getElementById("firstName");
    const lastNameEl = document.getElementById("lastName");
    const emailEl = document.getElementById("email");
    const roleEl = document.getElementById("role");
    const statusEl = document.getElementById("userStatus");
    const phoneEl = document.getElementById("phone");

    if (modalTitle) modalTitle.textContent = "Edit User";
    if (userIdEl) userIdEl.value = user.id;
    if (firstNameEl) firstNameEl.value = user.firstName || "";
    if (lastNameEl) lastNameEl.value = user.lastName || "";
    if (emailEl) emailEl.value = user.email || "";
    if (roleEl) roleEl.value = user.role || "User";
    if (statusEl) statusEl.value = user.status || "Active";
    if (phoneEl) phoneEl.value = user.phone || "";

    if (userModal) userModal.show();
  } else {
    showToast("User not found", "error");
  }
}

function saveUser() {
  const id = document.getElementById("userId")?.value;
  const firstName = document.getElementById("firstName")?.value?.trim();
  const lastName = document.getElementById("lastName")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const role = document.getElementById("role")?.value || "User";
  const status = document.getElementById("userStatus")?.value || "Active";
  const phone = document.getElementById("phone")?.value?.trim();

  if (!firstName || !lastName || !email) {
    showToast("Please fill all required fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please enter a valid email address", "error");
    return;
  }

  if (!Array.isArray(users)) {
    users = [];
  }

  if (id) {
    const userIndex = users.findIndex((u) => String(u.id) === String(id));

    if (userIndex !== -1) {
      const emailExists = users.some(
        (u) =>
          String(u.id) !== String(id) &&
          u.email?.toLowerCase() === email.toLowerCase(),
      );

      if (emailExists) {
        showToast("Email already exists for another user", "error");
        return;
      }

      users[userIndex] = {
        id: users[userIndex].id,
        firstName,
        lastName,
        email,
        role,
        status,
        phone: phone || "",
      };

      showToast("User updated successfully");
    } else {
      showToast("User not found", "error");
      return;
    }
  } else {
    if (users.some((u) => u.email?.toLowerCase() === email.toLowerCase())) {
      showToast("Email already exists", "error");
      return;
    }

    const newId =
      users.length > 0
        ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1
        : 1;
    const newUser = {
      id: newId,
      firstName,
      lastName,
      email,
      role,
      status,
      phone: phone || "",
    };
    users.push(newUser);
    showToast("User added successfully");
  }

  saveToStorage();

  if (userModal) userModal.hide();

  loadUsers();
  loadAllData();
}

// ===== DELETE FUNCTIONS =====
function deleteItem(type, id, name) {
  currentDeleteType = type;
  currentDeleteId = id;
  const nameEl = document.getElementById("deleteItemName");
  if (nameEl) nameEl.textContent = name;
  if (deleteModal) deleteModal.show();
}

function confirmDelete() {
  switch (currentDeleteType) {
    case "product":
      products = products.filter((p) => p.id !== currentDeleteId);
      loadProducts();
      break;
    case "category":
      if (currentDeleteId >= 0 && currentDeleteId < categories.length) {
        const categoryToDelete = categories[currentDeleteId];
        const productsInCategory = products.filter(
          (p) => p.category === categoryToDelete,
        );

        if (productsInCategory.length > 0) {
          {
            if (deleteModal) deleteModal.hide();
            return;
          }
        }

        categories.splice(currentDeleteId, 1);
        loadCategories();
        updateDropdowns();
      }
      break;
    case "order":
      orders = orders.filter((o) => o.id !== currentDeleteId);
      loadOrders();
      break;
    case "user":
      users = users.filter((u) => u.id !== currentDeleteId);
      loadUsers();
      break;
  }

  saveToStorage();
  loadAllData();
  if (deleteModal) deleteModal.hide();
  showToast(`${currentDeleteType} deleted successfully`);
}

// ===== UPDATE DROPDOWNS =====
function updateDropdowns() {
  const catSelect = document.getElementById("productCategory");
  if (catSelect) {
    catSelect.innerHTML =
      '<option value="">Select Category</option>' +
      categories
        .map(
          (c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`,
        )
        .join("");
  }

  const prodSelect = document.getElementById("orderProduct");
  if (prodSelect) {
    prodSelect.innerHTML =
      '<option value="">Select Product</option>' +
      products
        .map(
          (p) =>
            `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} ($${parseFloat(p.price).toFixed(2)} - Stock: ${parseInt(p.qty)})</option>`,
        )
        .join("");
  }

  const statusSelect = document.getElementById("orderStatus");
  if (statusSelect && statusSelect.options.length === 0) {
    const statuses = ["Pending", "Processing", "Completed", "Cancelled"];
    statusSelect.innerHTML = statuses
      .map((s) => `<option value="${s}">${s}</option>`)
      .join("");
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const id = "toast-" + Date.now();
  const icon =
    type === "success" ? "check-circle-fill" : "exclamation-triangle-fill";
  const bgClass = type === "success" ? "bg-success" : "bg-danger";

  const html = `
    <div id="${id}" class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center">
          <i class="bi bi-${icon} me-2"></i>
          ${escapeHtml(message)}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);

  const el = document.getElementById(id);
  if (el) {
    const toast = new bootstrap.Toast(el, { delay: 3000, animation: true });
    toast.show();

    el.addEventListener("hidden.bs.toast", function () {
      if (el && el.parentNode) {
        el.remove();
      }
    });
  }
}

// ===== EXPORT FUNCTIONALITY =====
function exportToCSV(type) {
  let data, filename, headers;

  switch (type) {
    case "products":
      data = products;
      headers = ["ID", "Name", "Category", "Price", "Quantity", "Description"];
      filename = "products.csv";
      break;
    case "orders":
      data = orders;
      headers = ["ID", "Customer", "Product", "Quantity", "Date", "Status"];
      filename = "orders.csv";
      break;
    case "users":
      data = users;
      headers = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Role",
        "Status",
        "Phone",
      ];
      filename = "users.csv";
      break;
    default:
      return;
  }

  if (!data || data.length === 0) {
    showToast("No data to export", "error");
    return;
  }

  const csvRows = [];
  csvRows.push(headers.join(","));

  for (const item of data) {
    let row;
    if (type === "products") {
      row = [
        item.id,
        `"${item.name}"`,
        item.category,
        item.price,
        item.qty,
        `"${item.description || ""}"`,
      ];
    } else if (type === "orders") {
      row = [
        item.id,
        `"${item.name}"`,
        `"${item.product}"`,
        item.qty,
        item.date,
        item.status,
      ];
    } else {
      row = [
        item.id,
        `"${item.firstName}"`,
        `"${item.lastName}"`,
        item.email,
        item.role,
        item.status,
        `"${item.phone || ""}"`,
      ];
    }
    csvRows.push(row.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Exported ${data.length} ${type} to CSV`);
}
