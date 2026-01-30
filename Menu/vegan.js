/* 
  Put your food images inside /images/ and change the image filenames below.
  To add a new dish just add a new object to the 'foods' array.
*/

const foods = [
  {
    id: "doro",
    name: "Beyaynetu",
    amharic: "በያይነቱ",
    price: "ETB 250 - 350",
    image: "../Images/vegan.jpg",
    short:
      "Traditional Ethiopian vegan platter with various stews and vegetables served on injera",
    desc: "Traditional Ethiopian vegan platter with various stews and vegetables served on injera",
  },
  {
    id: "kitfo",
    name: "Kik Alicha",
    amharic: "ክክ አልጫ",
    price: "ETB 300 - 450",
    image: "../Images/kik.jpg",
    short: "Yellow split pea stew with turmeric, ginger, and mild spices",
    desc: "Yellow split pea stew with turmeric, ginger, and mild spices",
  },
  {
    id: "shiro",
    name: "Shiro",
    amharic: "ሽሮ",
    price: "ETB 140 - 240",
    image: "../Images/shiro.jpg",
    short: "Creamy chickpea stew — vegetarian favorite.",
    desc: "Shiro is a smooth, rich stew made from ground chickpeas or broad beans and spices. Comforting and naturally vegetarian.",
  },
  {
    id: "tibs",
    name: "Key Sir",
    amharic: "ቀይ ሥር",
    price: "ETB 200 - 380",
    image: "../Images/keysir.jpg",
    short: "Fresh beetroot with potatoes",
    desc: "Fresh beetroot salad with onions,potatoes and green peppers",
  },
  {
    id: "misir",
    name: "Misir Wot",
    amharic: "ሚስር ወጥ",
    price: "ETB 120 - 220",
    image: "../Images/misir.jpg",
    short: "Red lentil stew with berbere.",
    desc: "Misir Wot is a hearty red lentil stew spiced with berbere and slow-cooked to a thick, flavorful consistency.",
  },
  {
    id: "gored",
    name: "Chechebsa",
    amharic: "ጨጨብሳ",
    price: "ETB 260 - 420",
    image: "../Images/chechebsa (2).jpg",
    short:
      "Torn pieces of bread mixed with spiced berbere sauce and vegan butter",
    desc: "Torn pieces of bread mixed with spiced berbere sauce and vegan butter.",
  },
  {
    id: "alicha",
    name: "Tikil Gomen",
    amharic: "ጥቅል ጎመን",
    price: "ETB 140 - 260",
    image: "../Images/tikil.jpg",
    short: "Mild turmeric-based vegetable .",
    desc: "Cabbage, potato, and carrot stew with turmeric and mild spices",
  },
  {
    id: "firfir",
    name: "Firfir (Injera Firfir)",
    amharic: "ፍርፍር (እንጀራ ፍርፍር)",
    price: "ETB 160 - 260",
    image: "../Images/firfir.jpg",
    short: "Torn injera quickly stirred with spicy sauce.",
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
