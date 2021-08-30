/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = "/account";

  /**
   * Получает информацию о счёте
   * */
  static get(id = "", data, callback){
    createRequest({
      url: this.URL + "/" + id,
      method: "GET",
      data,
      callback,
    });
  }
}