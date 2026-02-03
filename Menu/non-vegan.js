/* 
  Put your food images inside /images/ and change the image filenames below.
  To add a new dish just add a new object to the 'foods' array.
*/

const foods = [
  {
    id: "doro",
    name: "Doro Wot",
    amharic: "ዶሮ ወጥ",
    price: "ETB 250 - 350",
    image: "../Images/doro.jpg",
    short: "Spicy chicken stew with berbere and hard-boiled egg.",
    desc: "Doro Wot is a classic Ethiopian spicy chicken stew cooked with berbere spice and slow-simmered onions. Served with injera or bread.",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    amharic: "ክትፎ",
    price: "ETB 300 - 450",
    image: "../Images/kitfo.jpg",
    short: "Minced beef, warmed with spices and butter.",
    desc: "Kitfo is finely minced raw beef seasoned with mitmita and niter kibbeh (spiced butter). Served mild or spicy with cheese and greens.",
  },
  {
    id: "shiro",
    name: "Siga Wot ",
    amharic: "ሥጋ ወጥ",
    price: "ETB 140 - 240",
    image: "../Images/siga.jpg",
    short: " Meat in rich berbere sauce with traditional Ethiopian spices.",
    desc: "meat in rich berbere sauce with traditional Ethiopian spices.",
  },
  {
    id: "tibs",
    name: "Tibs",
    amharic: "ትብስ",
    price: "ETB 200 - 380",
    image: "../Images/tibs.jpg",
    short: "Sizzling pan-fried beef/lamb with onions & peppers.",
    desc: "Tibs is pieces of tender meat quickly sautéed with spices, onions and peppers. Served sizzling and aromatic.",
  },
  {
    id: "doro",
    name: "Beyaynetu",
    amharic: "በያይነቱ",
    price: "ETB 250 - 350",
    image: "../Images/beyeant.jpg",
    short:
      "Traditional Ethiopian platter with various stews and served on injera.",
    desc: "Traditional Ethiopian platter with various stews and served on injera",
  },
  {
    id: "gored",
    name: "Tire Siga ",
    amharic: "ጥሬ ሥጋ",
    price: "ETB 260 - 420",
    image: "../Images/tire.jpg",
    short:
      "Raw meat with senafich, awaze, and mitmita, served with injera and bread.",
    desc: "Raw meat with senafich, awaze, and mitmita, served with injera and bread.",
  },
  {
    id: "gored",
    name: "Gored Gored",
    amharic: "ጎሬድ ጎሬድ",
    price: "ETB 260 - 420",
    image: "../Images/gored.jpg",
    short: "Cubed beef tossed in mitmita and butter.",
    desc: "Gored Gored is bite-sized cubes of beef tossed with spices and clarified butter — bold and beefy.",
  },
  {
    id: "firfir",
    name: "Firfir (Injera Firfir)",
    amharic: "ፍርፍር (እንጀራ ፍርፍር)",
    price: "ETB 160 - 260",
    image: "../Images/firfir.jpg",
    short:
      "Torn injera quickly stirred with spicy sauce , minced meat & nitere kibe .",
    desc: "Firfir is shredded injera mixed with flavorful sauces — a popular and comforting meal for any time of day.",
  },
];

/* render menu items */
const container = document.getElementById("menu-items");

function render() {
  foods.forEach((food, i) => {
    const side = i % 2 === 0 ? "left" : "right";
    const item = document.createElement("div");
    item.className = `menu-item ${side}`;
    item.innerHTML = `
      <div class="disc" aria-hidden="true">
        <img src="${food.image}" alt="${food.name}">
      </div>

      <div class="ribbon" data-id="${
        food.id
      }" role="button" tabindex="0" aria-pressed="false" aria-label="${
      food.name
    } - ${food.amharic}">
        <div class="ribbon-inner">
          <h3 class="dish">${food.name} <span class="amharic">${
      food.amharic
    }</span></h3>
          <div class="price">${food.price} per serving</div>
        </div>
      </div>

      <div class="short-desc">${food.short || ""}</div>
    `;
    container.appendChild(item);

    // open modal on click or Enter key
    const ribbon = item.querySelector(".ribbon");
    ribbon.addEventListener("click", () => openModal(food));
    ribbon.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openModal(food);
    });
  });
}

/* Modal behavior */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalAmharic = document.getElementById("modal-amharic");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalClose = document.getElementById("modal-close");
const modalOverlay = document.getElementById("modal-overlay");

function openModal(food) {
  modalImg.src = food.image;
  modalImg.alt = food.name;
  modalTitle.textContent = food.name;
  modalAmharic.textContent = food.amharic;
  modalPrice.textContent = food.price + " per serving";
  modalDesc.textContent = food.desc || food.short || "";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* close handlers */
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* demo order button (hook into your ordering flow) */
const orderBtn = document.getElementById("order-btn");
if (orderBtn) {
  // remove only the demo order button, keep the modal-actions container (so review link remains)
  orderBtn.remove();
}

/* initialize */
render();
