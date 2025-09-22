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

      // 🏷️ Specifications & Options

       const badgeColors = ["bg-primary", "bg-success",  "bg-info", "bg-danger", "bg-secondary" ,"bg-warning",];


       let html = `
    
          <hr class="my-4">

          <!-- Specifications -->
          <h4 style="font-style: italic;font-family: ui-rounded;font-weight: 700;color: rgb(44 45 46);text-decoration: underline;">Specifications</h4>
          <table class="table table-bordered table-striped spec-table">
            <tbody>
            
              <tr><td>Make</td><td>${data["Make"]}</td></tr>
              <tr><td>Model Year</td><td>${data["Model year"]}</td></tr>
              <tr><td>Model</td><td>${data["Model"]}</td></tr>
              <tr><td>Trim</td><td>${data["Variant/Trim"]}</td></tr>
              <tr><td>Mileage</td><td>$${data["Mileage (km)"]} km</td></tr>
              <tr><td>Horsepower</td><td>${data["Horsepower"]} hp</td></tr>
              <tr><td>Drive</td><td>${data["Drive"]}</td></tr>
              <tr><td>Exterior color</td><td>${data["Exterior color"]}</td></tr>
              <tr><td>Battery Gross</td><td>${data["Battery Gross"]} kWh</td></tr>
              <tr><td>Battery Net</td><td>${data["Battery Net"]} kWh</td></tr>
              <tr><td>Range (WLTP)</td><td>${data["Range (WLTP)"]} km</td></tr>
            </tbody>
          </table>

          <!-- Options -->
          <h4 style="font-style: italic;font-family: ui-rounded;font-weight: 700;color: rgb(44 45 46);text-decoration: underline;">Options & Features</h4>
          <div class="mb-3" style="display: flex !important; flex-wrap: wrap !important; gap: 5px;">
            ${Array.isArray(data["Options list"]) ? data["Options list"].map(opt => {
              const color = badgeColors[Math.floor(Math.random() * badgeColors.length)];
              return `<span class="badge ${color} option-badge">${opt}</span>`;
            }).join("") : ""}


          </div>
        
        `;

        document.getElementById("carContainer").innerHTML = html;



    })
    .catch(err => {
      console.error("Error fetching car:", err);
    });
});


