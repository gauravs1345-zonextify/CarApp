document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('car-list');
  const pagination = document.getElementById('pagination');
  const makeSelect = document.getElementById('any-type');
  const modelSelect = document.getElementById('any-model');
  const yearSelect = document.getElementById('any-year');
  const applyButton = document.getElementById('apply-filters');

  const recordsPerPage = 20;
  let currentPage = 1;
  let carData = [];
  let filteredData = [];

  fetch('/listings')
    .then(res => res.json())
    .then(data => {
      carData = data;
      filteredData = [...carData];
      populateMakeOptions(carData);
      renderPage(currentPage, filteredData);
      renderPaginationControls(filteredData);
    })
    .catch(err => console.error('Error fetching listings:', err));

  function populateMakeOptions(data) {
    const makes = new Set();
    data.forEach(car => {
      if (car["Make"]) makes.add(car["Make"]);
    });

    makeSelect.innerHTML = '<option value="">Make</option>';
    [...makes].sort().forEach(make => {
      const option = document.createElement('option');
      option.value = make;
      option.textContent = make;
      makeSelect.appendChild(option);
    });
  }

  function updateModelOptions() {
    const selectedMake = makeSelect.value;
    const models = new Set();

    carData.forEach(car => {
      if (car["Make"] === selectedMake && car["Model"]) {
        models.add(car["Model"]);
      }
    });

    modelSelect.innerHTML = '<option value="">Model</option>';
    [...models].sort().forEach(model => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }

  function updateYearOptions() {
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const years = new Set();

    carData.forEach(car => {
      const matchMake = selectedMake ? car["Make"] === selectedMake : true;
      const matchModel = selectedModel ? car["Model"] === selectedModel : true;

      if (matchMake && matchModel && car["Model year"]) {
        years.add(car["Model year"]);
      }
    });

    yearSelect.innerHTML = '<option value="">Year</option>';
    [...years].sort((a, b) => b - a).forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }

  makeSelect.addEventListener('change', () => {
    updateModelOptions();
    updateYearOptions();
  });

  modelSelect.addEventListener('change', updateYearOptions);

  applyButton.addEventListener('click', () => {
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const selectedYear = yearSelect.value;

    filteredData = carData.filter(car => {
      const matchMake = selectedMake ? car["Make"] === selectedMake : true;
      const matchModel = selectedModel ? car["Model"] === selectedModel : true;
      const matchYear = selectedYear ? car["Model year"] == selectedYear : true;
      return matchMake && matchModel && matchYear;
    });

    currentPage = 1;
    renderPage(currentPage, filteredData);
    renderPaginationControls(filteredData);
  });

  function renderPage(page, data) {
    
    container.innerHTML = '';
    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(car => {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
     <div class="row car-card" onclick="window.location.href='details.html?id=${car['_id']}'">

      <div class="col-md-4">
        <img src="${car["mainImage"] || 'fallback.jpg'}" alt="${car["Listing title"] || 'Car Image'}">
      </div>

      <div class="col-md-8 car-card-main" >
        <div class="car-overlay d-flex flex-column justify-content-between ">
          <div class="car-card-main2" style="padding:0">
            <h5>${car["Model year"]} ${car["Make"]} ${car["Model"]}</h5>
            <p class="mb-2"><em>${car["Variant/Trim"]}</em></p>

            <div class="row">
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-speedometer2"></i> <span>${car["Mileage (km)"].toLocaleString()} KM</span>
                  </div>
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-gear"></i> <span>Automatic</span>
                  </div>
            </div>

            <div class="row">
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-palette"></i> <span>${car["Exterior color"]}</span>
                  </div>
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-lightning-charge"></i> <span>${car["Horsepower"]} HP</span>
                  </div>
            </div>

            <div class="row">
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-geo-alt"></i> <span>${car["Seller address"]}</span>
                  </div>
                  <div class="col-sm-6 detail-row">
                    <i class="bi bi-building"></i> <span>${car["Company/Dealer name"]}</span>
                  </div>
            </div>


            <p class="desc">Experience the perfect blend of performance and comfort with this ${car["Model year"]} ${car["Make"]} ${car["Model"]} ${car["Variant/Trim"]}, finished in sleek {Color}. With just {Mileage} km on the clock, it offers rear-wheel drive and an impressive ${car["Horsepower"]} HP.</p>
                          </div>
                          <div class="d-flex justify-content-between align-items-center mt-2">
                  <p class="price mb-0" style="font-weight: bold; font-size: 1.2rem; color: #fa7f72;">${car.Currency} ${car["Main price"]}</p>
                  <a href="tel:${car["Phone"]}" 
                    class="btn btn-primary btn-phone" 
                    style="background-color:#007bff; border:none; padding:6px 12px; border-radius:6px; font-weight:500;">
                    <i class="bi bi-telephone-fill"></i> ${car["Phone"]}
                  </a>
                </div>

           </div>
        </div>
    </div>

       
      `;
      container.appendChild(card);
    });
  }

  function renderPaginationControls(data) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(data.length / recordsPerPage);
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    const createButton = (label, page, disabled = false) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      if (disabled) btn.disabled = true;
      btn.addEventListener('click', () => {
        currentPage = page;
        renderPage(currentPage, filteredData);
        renderPaginationControls(filteredData);
      });
      pagination.appendChild(btn);
    };

    createButton('« First', 1, currentPage === 1);
    createButton('‹ Prev', currentPage - 1, currentPage === 1);

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active-page' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage(currentPage, filteredData);
        renderPaginationControls(filteredData);
      });
      pagination.appendChild(btn);
    }

    createButton('Next ›', currentPage + 1, currentPage === totalPages);
    createButton('Last »', totalPages, currentPage === totalPages);
  }
});
