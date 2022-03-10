// API
const api = "https://raw.githubusercontent.com/rimonians/chart.js-result-app/main/data.json";

// Select element
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const preview = document.querySelector(".preview");
const chartContainer = document.querySelector(".chartContainer");
const result = document.querySelector(".result");
const notFound = document.querySelector(".notFound");
const chartTypes = [...document.querySelectorAll(".chartType button")];

// State
let globalData = "";

// Fetch data
const fetchData = async (roll, type) => {
  try {
    const res = await fetch(api);
    const data = await res.json();
    globalData = data;
    displayChart(roll, data, type);
  } catch (err) {
    preview.classList.remove("show");
    notFound.classList.add("showErr");
  }
};

// Display chart
const displayChart = (roll, data, type = "line") => {
  const singleData = data.find((el) => el.roll === roll);
  if (singleData) {
    preview.classList.add("show");
    notFound.classList.remove("showErr");
    createChart(singleData, type);
    printResult(singleData);
  } else {
    preview.classList.remove("show");
    notFound.classList.add("showErr");
  }
};

// Create chart
const createChart = (credential, type) => {
  const subjects = credential.result.subjects;
  const marks = credential.result.marks;

  const data = {
    labels: subjects,
    datasets: [
      {
        label: `Result of ${credential.name}`,
        backgroundColor: "royalblue",
        borderColor: "dodgerblue",
        data: marks,
        fill: false,
      },
    ],
  };

  const config = {
    type: type,
    data: data,
    options: {},
  };

  chartContainer.innerHTML = `<canvas id="chart"></canvas>`;

  const myChart = new Chart(document.querySelector("#chart"), config);
};

// Print result
const printResult = (credential) => {
  result.innerHTML = "";
  result.innerHTML = `<h3>Result of ${credential.name}</h3>`;
  const subjects = credential.result.subjects;
  const marks = credential.result.marks;
  subjects.forEach(
    (el, index) =>
      (result.innerHTML += `<p>${subjects[index]}: ${marks[index]}</p>`)
  );
};

// Set event listener
searchBtn.addEventListener("click", () => {
  const chartType = chartTypes.find((el) => el.classList.contains("active"));
  const searchInputValue = Number(searchInput.value);
  fetchData(searchInputValue, "radar");
});

// Update chart type
chartTypes.forEach((el) => {
  el.addEventListener("click", () => {
    displayChart(Number(searchInput.value), globalData, el.value);
    chartTypes.forEach((el) => el.classList.remove("active"));
    el.classList.add("active");
  });
});
