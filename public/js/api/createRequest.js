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
        options.url += i + "=" + options.data[i] + "&";
      }
      options.url = options.url.slice(0,-1);
    }
  } else {
    for (let i in options.data) {
      formData.append(i, options.data[i]);
    }
  }

  xhr.addEventListener("load", () => options.callback(null, xhr.response));

  try {
    xhr.open(options.method, options.url, true);
    if (formData === undefined) {
      xhr.send();
    } else {
      xhr.send(formData);
    }
  } catch (e) {
    options.callback(e);
  }
};