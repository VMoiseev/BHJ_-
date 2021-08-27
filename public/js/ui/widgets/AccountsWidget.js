/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error ("Ошибка! Элемент не существует!");
    }
      
    this.element = element; 
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = this.element.querySelector(".create-account");

    createAccount.addEventListener("click", (e) => {
      e.preventDefault();
      App.getModal("createAccount").open();
    });

    this.element.addEventListener("click", (e) => {
      e.preventDefault();
      const currentElement = e.target;
      const account = currentElement.closest(".account");
      if (account && account.classList.contains("account")) {
        this.onSelectAccount(currentElement);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (error, response) => {
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = Array.from(document.querySelectorAll(".account"));

    accounts.forEach(item => {
      item.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const active = this.element.querySelector(".active");
    if (active) {
      active.classList.remove("active");
    }
    element.classList.add("active");
    this.currentAccountId = element.dataset.id
    App.showPage("transactions", {account_id: this.currentAccountId});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `<li class="account" data-id=${item.id}>
              <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum}</span>
              </a>
            </li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const element = document.createElement("div");
    element.innerHTML = this.getAccountHTML(data);
    this.element.appendChild(element.firstChild);
  }
}