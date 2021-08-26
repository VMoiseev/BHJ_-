/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  xhr.responseType = "json";

  if (options.method === "GET") {
    if (options.data != null) {
      options.url += "?";
      for (let i in options.data) {
        options.url += `${i}=${options.data[i]}.join("&")`;
      }
      options.url = options.url.slice(0,-1);
    }
    xhr.open(options.method, options.url, true);
  } else {
    for (let i in options.data) {
      formData.append(i, options.data[i]);
    }
    xhr.open(options.method, options.url, true);
    xhr.send(formData);
  }

  xhr.addEventListener("load", () => {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      let error = null;
      options.callback(error, xhr.response);
    }
  })
};