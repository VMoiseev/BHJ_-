/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error ("Ошибка! Элемент не существует!");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
      return;
    }
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener("click", (e) => {
      e.preventDefault();
      const removeBtn = e.target.closest(".remove-account");
      const transactionBtn = e.target.closest(".transaction__remove");
      if (removeBtn) {
        this.removeAccount();
      }
      if (transactionBtn) {
        this.removeTransaction(transactionBtn.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    
    const agreeBeforRemove = confirm("Вы действительно хотите удалить счёт?");
    if (agreeBeforRemove) {
      Account.remove(this.lastOptions.account_id, {}, (error, response) => {
        if (response.success) {
          this.clear();
          App.updateWidgets();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const currentTransactionElement = this.element
      .querySelector(`button[data-id="${id}"]`)
      .closest(".transaction");
    const agreeBeforRemoveTransaction = confirm("Вы действительно хотите удалить транзакцию?");
    if (agreeBeforRemoveTransaction) {
      currentTransactionElement.remove();
      Transaction.remove(id, User.current(), App.update.bind(App));
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;
    Account.get(options.account_id, User.current(), (error, response) => {
      this.renderTitle(response.data.name);
    });

    Transaction.list(options, (error, response) => {
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    return `${new Date(date).toLocaleString("ru", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} в ${new Date(date).toLocaleString("ru", {
      hour: "numeric",
      minute: "numeric",
    })}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type.toLowerCase()} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">
              ${item.name}
            </h4>
            <!-- дата -->
            <div class="transaction__date">
              ${this.formatDate(item.created_at)}
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <!-- в data-id нужно поместить id -->
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
          /button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    this.element.querySelector(".content").innerHTML = "";
    data.forEach(item => {
      this.element.querySelector(".content").innerHTML += this.getTransactionHTML(item);
    });
  }
}