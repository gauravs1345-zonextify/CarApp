// ✅ Global toggleOptions function
function toggleOptions() {
  const hidden = document.querySelectorAll("#options li[style*='display: none']");
  const toggleBtn = document.querySelector(".show-more");

  if (hidden.length > 0) {
    hidden.forEach(li => li.style.display = "block");
    toggleBtn.textContent = "Show Less ▲";
  } else {
    document.querySelectorAll("#options li").forEach((li, i) => {
      if (i >= 8) li.style.display = "none";
    });
    toggleBtn.textContent = "Show More ▼";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const uniqueID = new URLSearchParams(window.location.search).get('id');
  console.log("Unique ID:", uniqueID);

  const url = `/listings/${uniqueID}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched car:", data);

      // 🏷️ Basic Info
      document.getElementById("listingTitle").textContent = data["Listing title"] || "N/A";
      document.getElementById("price").textContent =
        new Intl.NumberFormat().format(data["Main price"] || 0) + " " + (data["Currency"] || "");

      // 🧑‍💼 Seller Info
      document.getElementById("dealer").textContent = data["Company/Dealer name"] || "N/A";
      document.getElementById("phone").textContent = data["Phone"] || "N/A";
      document.getElementById("email").textContent = data["Email addresses"] || "N/A";
      document.getElementById("email").href = "mailto:" + (data["Email addresses"] || "");
      document.getElementById("website").href = data["Website URLs"] || "#";
      document.getElementById("location").textContent =
        `${data["Seller address"] || ""}, ${data["City"] || ""}, ${data["Country"] || ""}`;

      // 🖼️ Carousel Images
      const carousel = document.getElementById("carouselImages");
      const thumbs = document.getElementById("thumbs");
      let carouselHTML = '';
      let thumbsHTML = '';

      data.images.forEach((img, i) => {
        carouselHTML += `
          <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block w-100">
            <a href="${img}" data-lightbox="car-gallery">
              <button class="zoom-btn">🔍</button>
            </a>
          </div>`;
        thumbsHTML += `<img src="${img}" class="thumb" data-index="${i}">`;
      });

      carousel.innerHTML = carouselHTML;
      thumbs.innerHTML = thumbsHTML;

      // 🖱️ Thumbnail click binding
      document.querySelectorAll(".thumb").forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
          document.querySelectorAll('.carousel-item').forEach(item => item.classList.remove('active'));
          document.querySelectorAll('.carousel-item')[i].classList.add('active');
          $('#carCarousel').carousel(i);
        });
      });

      // 📋 Details Grid
      const details = [
        ["Make", data["Make"]], ["Model", data["Model"]], ["Trim", data["Variant/Trim"]],
        ["First Reg.", data["First registration date"]], ["Year", data["Model year"]],
        ["Mileage", (data["Mileage (km)"] || 0).toLocaleString() + " km"],
        ["Exterior", data["Exterior color"]], ["Interior", data["Interior color"]],
        ["Power", data["Horsepower"] + " hp"], ["Battery", data["Battery net capacity (kWh)"] + " kWh"],
        ["Range", data["Range WLTP (km)"] + " km"], ["Drivetype", data["Drivetype"]]
      ];

      const detailsDiv = document.getElementById("details");
      detailsDiv.innerHTML = details.map(d =>
        `<div class="card"><strong>${d[0]}:</strong> ${d[1] || "N/A"}</div>`
      ).join("");

      // 🛠️ Options List
      const optionsDiv = document.getElementById("options");
      data["Options list"].forEach((opt, i) => {
        const li = document.createElement("li");
        li.textContent = opt;
        if (i >= 8) li.style.display = "none";
        optionsDiv.appendChild(li);
      });

      // 📝 Description
      document.getElementById("description").textContent = data["description"] || "No description available.";

      // 🔘 Bind toggleOptions to button
      document.querySelector(".show-more").addEventListener("click", toggleOptions);
    })
    .catch(err => {
      console.error("Error fetching car:", err);
    });
});

