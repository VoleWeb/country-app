(function (global, factory) {
  factory(global);
})(typeof window !== "undefined" ? window : this, function (window) {
  "use strict";
  const $document = window.document;
  const $body = $document.body;

  var allCountries = localStorage.getItem("countries") ?? [];

  const removeClassName = (elem, className) => {
    if (elem.classList.contains(className)) {
      elem.classList.remove(className);
    }
  };

  const addClassName = (elem, className) => {
    if (!elem.classList.contains(className)) {
      elem.classList.add(className);
    }
  };

  const getAll = new Promise(async (resolve, reject) => {
    const response = await axios({
      method: "get",
      url: "https://restcountries.com/v3.1/all",
    });

    if (response.status === 200) {
      resolve(await response.data);
    } else {
      reject("An error occurred while getting countries data");
    }
  });

  // Store countries data into: localStorage
  getAll
    .then((res) => {
      const convertString = JSON.stringify(res);
      allCountries = convertString;
      localStorage.setItem("countries", convertString);
    })
    .catch((err) => console.error(err));

  const render = () => {
    const countryList = $document.getElementById("country-list");
    const countries = JSON.parse(allCountries);

    countries.forEach((country) => {
      const { common: commonName } = country.name;
      const { svg: flagIcon } = country.flags;

      let text =
        commonName.length > 16
          ? `${commonName.substring(0, 13)}...`
          : commonName;

      let item = $document.createElement("button");
      item.setAttribute("type", "button");
      item.title = commonName;
      item.className =
        "bg-white shadow border rounded-md py-2 px-3 select-none tracking-tight leading-6 text-sm text-slate-700 flex items-center gap-2 justify-center hover:bg-gray-100 hover:scale-105 transition-transform transition-colors";
      item.innerHTML = `<img src="${flagIcon}" alt="icon" class="flag-icon"><span>${text}</span>`;
      countryList.appendChild(item);
    });

    removeClassName($body, "overflow-hidden");
    addClassName($document.getElementById("loader"), "hidden");
  };

  let accessData = setInterval(() => {
    if (allCountries.length > 0) {
      render();
      clearInterval(accessData);
    }
  }, 500);
});
