
let travelData = {};

async function loadTravelData() {
  const response = await fetch("travel_recommendation_api.json");
  travelData = await response.json();
}

function createCard({ name, imageUrl, description }) {
  return `
    <div class="card">
      <img src="${imageUrl}" alt="${name}" />
      <div class="card-content">
        <h3>${name}</h3>
        <p>${description}</p>
        <button class="visit-btn">Visit</button>
      </div>
    </div>
  `;
}

function displayResults(keyword) {
  const searchTerm = keyword.toLowerCase();
  const resultsDiv = document.getElementById("results");
  let matched = [];

  if (!travelData || !travelData.countries) return;

  // Search in countries > cities
  travelData.countries.forEach(country => {
    country.cities.forEach(city => {
      if (
        city.name.toLowerCase().includes(searchTerm) ||
        city.description.toLowerCase().includes(searchTerm)
      ) {
        matched.push(city);
      }
    });
  });

  // Search in temples
  travelData.temples.forEach(temple => {
    if (
      temple.name.toLowerCase().includes(searchTerm) ||
      temple.description.toLowerCase().includes(searchTerm)
    ) {
      matched.push(temple);
    }
  });

  // Search in beaches
  travelData.beaches.forEach(beach => {
    if (
      beach.name.toLowerCase().includes(searchTerm) ||
      beach.description.toLowerCase().includes(searchTerm)
    ) {
      matched.push(beach);
    }
  });

  if (matched.length > 0) {
    resultsDiv.innerHTML = matched.map(createCard).join('');
    resultsDiv.style.display = "flex";
  } else {
    resultsDiv.innerHTML = `<p style="color: black; padding: 20px;">No results found.</p>`;
    resultsDiv.style.display = "block";
  }
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadTravelData();

  const searchBtn = document.getElementById("search_place");
  const clearBtn = document.getElementById("clear_place");
  const input = document.getElementById("search_input");
  const resultsDiv = document.getElementById("results");

  searchBtn.addEventListener("click", () => {
    const keyword = input.value.trim();
    if (keyword !== "") {
      displayResults(keyword);
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    resultsDiv.innerHTML = "";
    resultsDiv.style.display = "none";
  });
});

