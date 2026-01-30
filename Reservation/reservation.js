document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");
  const bookBtn = document.getElementById("book-btn");
  const dateInput = document.getElementById("date");

  // Set the minimum selectable date to today to prevent past-date selection
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.min = minDate;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Client-side validation: ensure the chosen date is today or in the future
    if (dateInput) {
      const selectedDate = dateInput.value;
      if (!selectedDate) {
        alert("Please select a reservation date.");
        return;
      }
      // string compare works for YYYY-MM-DD format
      if (selectedDate < dateInput.min) {
        alert("Please choose today or a future date for your reservation.");
        return;
      }
    }
    bookBtn.disabled = true; // Disable button to prevent multiple submissions
    bookBtn.textContent = "Booking...";

    const formData = new FormData(form);
    const data = new URLSearchParams(formData).toString();

    try {
      const response = await fetch("reserve_table.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      });
      const result = await response.json();

      alert(result.message); // Replace with better UI notification in production
      if (result.success) {
        form.reset();
      }
    } catch (error) {
      alert("An error occurred. Please try again.", error);
      console.error(error);
    } finally {
      bookBtn.disabled = false;
      bookBtn.textContent = "Book a Table";
    }
  });
});
