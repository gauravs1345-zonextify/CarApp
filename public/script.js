document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('car-list');
  const pagination = document.getElementById('pagination');
  const recordsPerPage = 20;
  let currentPage = 1;
  let carData = [];

  // Fetch data
  fetch('/listings')
    .then(res => res.json())
    .then(data => {
      carData = data;
      renderPage(currentPage);
      renderPaginationControls();
    })
    .catch(err => console.error('Error fetching listings:', err));

  // Render cars for current page
  function renderPage(page) {
    container.innerHTML = '';
    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = carData.slice(start, end);

    pageData.forEach(car => {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
    
              <div class="car-card">
                <div class="car-image">
                    <img src="${car["mainImage"]}" alt="Skoda Enyaq 80 iV Sportline 5d">
                </div>
                 <h3 class="car-name">${car["Listing title"]}</h3>
                <div class="car-details-grid">
                   

                    <div class="detail-item"><span>Make:</span> ${car["Make"]}</div>
                    <div class="detail-item"><span>Model:</span> ${car["Model"]}</div>
                    <div class="detail-item"><span>Year:</span> ${car["Model year"]}</div>
                    <div class="detail-item"><span>Mileage:</span> ${car["Mileage (km)"]}</div>
        
                    <div class="detail-item"><span>Drive Type:</span> ${car["Drivetype"]}</div>
                    <div class="detail-item"><span>Exterior color:</span> ${car["Exterior color"]}</div>
                    <div class="detail-item"><span>Seller:</span> ${car["Seller type"]}</div>
                    <div class="detail-item"><span>Horsepower:</span> ${car["Horsepower"]}</div>
                    <div class="detail-item"><span>Price:</span> €${car["Main price"]}</div>
                    <div class="detail-item"><span>Monthly Cost:</span> €5006/month</div>
                    <div class="detail-item"><span>Savings:</span> -10,000 kr.</div>
                </div>

                <div class="car-features">
                    <strong>Key Features:</strong> Sportline, Matrix LED, Varmepumpe, 77kWh Battery
                </div>

                <a href="#" class="details-link">View Listing</a>
            </div>

     
      `;
      container.appendChild(card);
    });
  }

  // Render pagination buttons
  function renderPaginationControls() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(carData.length / recordsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active-page' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage(currentPage);
        renderPaginationControls();
      });
      pagination.appendChild(btn);
    }
  }
});
