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
        <div class="car-image">
          <img src="${car["mainImage"] || 'fallback.jpg'}" alt="${car["Listing title"] || 'Car Image'}">
        </div>
        <h3 class="car-name">${car["Listing title"] || 'Unknown Title'}</h3>
        <div class="car-details-grid">
          <div class="detail-item"><span>Make:</span> ${car["Make"] || 'N/A'}</div>
          <div class="detail-item"><span>Model:</span> ${car["Model"] || 'N/A'}</div>
          <div class="detail-item"><span>Year:</span> ${car["Model year"] || 'N/A'}</div>
          <div class="detail-item"><span>Mileage:</span> ${car["Mileage (km)"] || 'N/A'} km</div>
          <div class="detail-item"><span>Drive Type:</span> ${car["Drivetype"] || 'N/A'}</div>
          <div class="detail-item"><span>Exterior Color:</span> ${car["Exterior color"] || 'N/A'}</div>
          <div class="detail-item"><span>Seller:</span> ${car["Seller type"] || 'N/A'}</div>
          <div class="detail-item"><span>Horsepower:</span> ${car["Horsepower"] || 'N/A'} HP</div>
          <div class="detail-item"><span>Price:</span> €${car["Main price"] || 'N/A'}</div>
        </div>
        <div class="car-features">
          <strong>Key Features:</strong> ${Array.isArray(car["Options list"]) ? car["Options list"].join(', ') : 'N/A'}
        </div>
        <a href="${car["Source URL"] || '#'}" class="details-link" target="_blank">View Listing</a>
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
