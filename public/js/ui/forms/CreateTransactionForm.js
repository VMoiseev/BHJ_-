/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (error, response) => {
      if (response.data) {
        this.element.querySelector(".accounts-select").innerHTML = "";
        response.data.forEach(item => {
          this.element.querySelector(".accounts-select").innerHTML += `
          <option value="${item.id}">${item.name}</option>
        `});
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (error, response) => {
      if (response.success) {
        if (data.type === "income") {
          App.getModal("newIncome").close();
        }
        if (data.type === "expense") {
          App.getModal("newExpense").close();
        }
        App.update();
        this.element.reset();
        App.getModal("");
      }
    });
  }
}