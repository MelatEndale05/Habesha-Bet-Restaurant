// beverages js
function openModal(title, description, imgSrc) {
  document.getElementById("drinkModal").style.display = "flex";
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDesc").innerText = description;
  document.getElementById("modalImg").src = imgSrc;
}

function closeModal() {
  document.getElementById("drinkModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("drinkModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


function openModal(title, description, imgSrc) {
  document.getElementById("foodModal").style.display = "flex";
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDesc").innerText = description;
  document.getElementById("modalImg").src = imgSrc;
}

function closeModal() {
  document.getElementById("foodModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("foodModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

//menu js
document.querySelectorAll(".menu-box").forEach((box) => {
  box.addEventListener("click", (e) => {
    // Only navigate if not clicking directly on a link
    if (!e.target.closest("a")) {
      const link = box.querySelector("a.cta");
      if (link) {
        window.location.href = link.href;
      }
    }
  });
});

//review js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("review-form");
  const reviewsList = document.getElementById("reviews-list");
  const stars = document.querySelectorAll("#star-rating span");
  let rating = 0;
  let isAuthenticated = false;

  // Check authentication status and update UI
  const checkAuth = async () => {
    try {
      const res = await fetch('../auth/check.php');
      const js = await res.json();
      const authArea = document.getElementById('auth-area');
      const nameInput = document.getElementById('name');
      if (js.authenticated) {
        isAuthenticated = true;
        const display = js.display_name && js.display_name.length ? js.display_name : js.username;
        if (authArea) authArea.innerHTML = `Signed in as <strong>${display}</strong> &nbsp;|&nbsp; <a href="../auth/logout.php">Sign out</a>`;
        if (nameInput) {
          nameInput.value = display;
          nameInput.readOnly = true;
        }
      } else {
        isAuthenticated = false;
        if (authArea) authArea.innerHTML = `<a href="../auth/login.php" id="auth-login">Sign in</a> &nbsp;|&nbsp; <a href="../auth/register.php" id="auth-register">Register</a>`;
        if (nameInput) { nameInput.value = ''; nameInput.readOnly = false; }
      }
    } catch (e) {
      console.error('Auth check failed', e);
    }
  };

  checkAuth();

  // Load reviews from database
  const loadReviews = async () => {
    var response;
    try {
      response = await fetch("get_reviews.php");
      const reviews = await response.json();
      console.log(reviews);
      reviewsList.innerHTML = ""; // Clear existing reviews
      reviews.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");
        // Determine image source: prefer stored path, fall back to base64 blob, then default
        let imgSrc = '../Images/user1.png';
        if (review.image && review.image.length) {
          imgSrc = review.image;
        } else if (review.image_blob && review.image_blob.length && review.image_type) {
          imgSrc = `data:${review.image_type};base64,${review.image_blob}`;
        }
        reviewCard.innerHTML = `
          <img src="${imgSrc}" alt="${review.name}">
          <div class="review-content">
            <h3>${review.name}</h3>
            <div class="stars">${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )}</div>
            <p>${review.message}</p>
          </div>
        `;
        reviewsList.appendChild(reviewCard);
      });
    } catch (error) {
      console.log(response);
      console.error("Error loading reviews:", error);
    }
  };

  // Initial load of reviews
  loadReviews();

  // Star selection lighting and keyboard support
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      rating = parseInt(star.getAttribute("data-value"), 10);
      stars.forEach((s) => {
        const val = parseInt(s.getAttribute("data-value"), 10);
        if (val <= rating) {
          s.classList.add("selected");
        } else {
          s.classList.remove("selected");
        }
      });
    });

    // keyboard support
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        star.click();
      }
    });
  });

  // Submit review
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // require sign in before submitting
      window.location.href = '../auth/login.php';
      return;
    }

    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const imageInput = document.getElementById('image');

    if (name && message && rating > 0) {
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('rating', rating);
        formData.append('message', message);
        if (imageInput && imageInput.files && imageInput.files[0]) {
          formData.append('image', imageInput.files[0]);
        }

        const response = await fetch('add_review.php', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        alert(data.message); // Replace with better UI notification in production

        if (data.success) {
          // Reset form
          form.reset();
          stars.forEach((s) => s.classList.remove("selected"));
          rating = 0;
          const preview = document.getElementById('image-preview');
          if (preview) { preview.style.display = 'none'; preview.src = ''; }
          // Reload reviews to include the new one
          await loadReviews();
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
      }
    } else {
      alert("Please fill in all fields and select a star rating.");
    }
  });

  // Image preview
  const imageInputEl = document.getElementById('image');
  const imagePreview = document.getElementById('image-preview');
  if (imageInputEl) {
    imageInputEl.addEventListener('change', () => {
      const file = imageInputEl.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
      }
    });
  }
});
