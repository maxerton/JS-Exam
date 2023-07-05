'use strict'
import { Modal } from '../bootstrap.bundle.min.js';


class ModalView {
  constructor(modal) {
    this.modal = modal;
    this.bsModal = new Modal(this.modal)
  }

  renderBook(name = '') {
    let s = `
    <div class="modal-header">
      <h5 class="modal-title">Створити нову книгу</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-book"></i></span>
              <input type="text" class="form-control" placeholder="Назва книги" aria-label="Username" data-form="bookName" value="${name}">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      
      ${name !== '' ? '<button type="button" class="btn btn-danger" data-role="deleteItem">Видалити запис</button>' : ''}
      <button type="button" class="btn btn-primary" data-role="saveChanges">Зберегти зміни</button>
    </div>
    `;
    this.modal.querySelector('.modal-content').innerHTML = s
  }
  
  renderVisitor(obj) {
    let name = '', phone = '';
    if (obj) {
      name = obj.name;
      phone = obj.phone;
    }

    let s = `
    <div class="modal-header">
      <h5 class="modal-title">Додати нового відвідувача</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
              <input type="text" class="form-control" placeholder="Ім'я відвідувача" aria-label="Username" data-form="visitorName" value="${name}">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
              <input type="phone" class="form-control" pattern="0[96][0-9]{8}" placeholder="Номер відвідувача" aria-label="Username" data-form="visitorPhone" value="${phone}">
            </div>
          </div>
        </div>
      </div>
      <span class='error' style="display: none">Ой лишенько, сталася помилка, перевірьте корректність введених данних, номер починається з нуля та має довжину у 10 цифр. Ім'я не повинно бути пустим.</span>
    </div>
    <div class="modal-footer">
      
      ${name !== '' ? '<button type="button" class="btn btn-danger" data-role="deleteItem">Видалити запис</button>' : ''}
      <button type="button" class="btn btn-primary" data-role="saveChanges">Зберегти зміни</button>
    </div>
    `;
    this.modal.querySelector('.modal-content').innerHTML = s
  }
  
  renderCard(obj) {
    const renderOptions = (list) => {
      const retOptions = [];
      list.forEach(elem => retOptions.push(`<option value="${elem.value}">${elem.name}</option>`));
      return retOptions.join('');
    }

    let s = `
    <div class="modal-header">
      <h5 class="modal-title">Додати нового відвідувача</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
              <select class="form-select" data-form="visitorId">
                <option selected disabled>Виберіть відвідувача</option>
                ${renderOptions(obj.listVisitors)}
              </select>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
              <select class="form-select" data-form="bookId">
                <option selected disabled>Виберіть книгу</option>
                ${renderOptions(obj.listBooks)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <span class='error' style="display: none">Ой лишенько, сталася помилка, перевірьте корректність введених данних, номер починається з нуля та має довжину у 10 цифр. Ім'я не повинно бути пустим.</span>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" data-role="saveChanges">Зберегти зміни</button>
    </div>
    `;
    this.modal.querySelector('.modal-content').innerHTML = s
  }

  show() {
    this.bsModal.show();
  }

  hide() {
    this.bsModal.hide();
  }

  error() {
    this.modal.querySelector('.error').style.display = 'block';
  }
}


class BookView {
  constructor(element) {
    this.elem = element;
  }

  #renderListItem(elem) {
    return `
    <tr>
        <td>${elem.id}</td>
        <td>${elem.name}</td>
        <td>${elem.visitorName}</td>
        <td><button class="btn" data-role="editBookModal" data-id="${elem.id}">
            <i data-action="fa-hover" class="fa-solid fa-pencil"></i>
        </button></td>
    </tr>
    `
  }

  #renderList(data) {
    return data.map(this.#renderListItem).join('');
  }

  render(data) {
    const s = `
    <div class="container">
      <div class="row">
          <div class="col d-flex align-content-center">
              <h6 class="logo">всі книги:</h6>
          </div>
          <div class="col d-flex justify-content-end align-content-center">
              <button class="btn custom-btn" data-role="newBookModal">Нова книга</button>
          </div>
      </div>
      <hr>
      <div class="row">
          <div class="col d-flex align-content-center">
              <div class="input-group my-3">
                  <select class="form-select" aria-describedby="basic-addon1" data-role="sortList">
                      <option value="id" ${data.sortType === 'id' ? 'selected' : ''}>ID</option>
                      <option value="name" ${data.sortType === 'name' ? 'selected' : ''}>Назва книги</option>
                  </select>
                  <button class="btn btn-secondary" data-role="sort">Сортувати</button>
              </div>
          </div>
          <div class="col d-flex justify-content-end align-content-center">
              <div class="input-group my-3">
                  <input type="text" class="form-control" data-role="searchPrompt" value="${data.search}">
                  <button class="btn btn-secondary" data-role="search">Шукати</button>
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col">
              <table class="table table-bordered table-hover table-striped">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Назва книги</th>
                          <th>У кого</th>
                          <th>Дії</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${this.#renderList(data.list)}
                  </tbody>
              </table>
          </div>
      </div>
  </div>
    `

    this.elem.innerHTML = s;
  }
}


class VisitorView {
  constructor(element) {
    this.elem = element;
  }

  #renderListItem(elem) {
    return `
    <tr>
        <td>${elem.id}</td>
        <td>${elem.name}</td>
        <td>${elem.phone}</td>
        <td><button class="btn" data-role="editVisitorModal" data-id="${elem.id}">
            <i data-action="fa-hover" class="fa-solid fa-pencil"></i>
        </button></td>
    </tr>
    `
  }

  #renderList(data) {
    return data.map(this.#renderListItem).join('');
  }

  render(data) {
    const s = `
    <div class="container">
        <div class="row">
            <div class="col d-flex align-content-center">
                <h6 class="logo">всі відвідувачі:</h6>
            </div>
            <div class="col d-flex justify-content-end align-content-center">
                <button class="btn custom-btn" data-role="newVisitorModal">Новий відвідувач</button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col d-flex align-content-center">
                <div class="input-group my-3">
                    <select class="form-select" aria-describedby="basic-addon1" data-role="sortList">
                        <option value="id" ${data.sortType === 'id' ? 'selected' : ''}>ID</option>
                        <option value="name" ${data.sortType === 'name' ? 'selected' : ''}>Ім'я</option>
                    </select>
                    <button class="btn btn-secondary" data-role="sort">Сортувати</button>
                </div>
            </div>
            <div class="col d-flex justify-content-end align-content-center">
                <div class="input-group my-3">
                <input type="text" class="form-control" data-role="searchPrompt" value="${data.search}">
                <button class="btn btn-secondary" data-role="search">Шукати</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <table class="table table-bordered table-hover table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ім'я</th>
                            <th>Телефон</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.#renderList(data.list)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `

    this.elem.innerHTML = s;
  }
}

class CardsView {
  constructor(element) {
    this.elem = element;
  }

  #renderListItem(elem) {
    return `
    <tr>
        <td>${elem.id}</td>
        <td>${elem.visitorName}</td>
        <td>${elem.bookName}</td>
        <td>${elem.borrow}</td>
        <td>${elem.return ? `
          ${elem.return}
        ` : `<button class="btn" data-role="createReturnDate" data-id="${elem.id}"><i data-action="fa-hover" class="fa-solid fa-reply"></i></button>`}</td>
    </tr>
    `
  }

  #renderList(data) {
    return data.map(this.#renderListItem).join('');
  }

  render(data) {
    const s = `
    <div class="container">
        <div class="row">
            <div class="col d-flex align-content-center">
            <h6 class="logo">всі картки:</h6>
            </div>
            <div class="col d-flex justify-content-end align-content-center">
                <button class="btn custom-btn" data-role="newCardModal">Нова картка</button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col d-flex align-content-center">
                <div class="input-group my-3">
                    <select class="form-select" aria-describedby="basic-addon1" data-role="sortList">
                        <option value="id" ${data.sortType === 'id' ? 'selected' : ''}>ID</option>
                        <option value="visitor" ${data.sortType === 'visitor' ? 'selected' : ''}>Відвідувач</option>
                        <option value="book" ${data.sortType === 'book' ? 'selected' : ''}>Книга</option>
                    </select>
                    <button class="btn btn-secondary" data-role="sort">Сортувати</button>
                </div>
            </div>
            <div class="col d-flex justify-content-end align-content-center">
                <div class="input-group my-3">
                <input type="text" class="form-control" data-role="searchPrompt" value="${data.search}">
                <button class="btn btn-secondary" data-role="search">Шукати</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <table class="table table-bordered table-hover table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Відвідувач</th>
                            <th>Книга</th>
                            <th>Дата отримання</th>
                            <th>Дата повернення</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.#renderList(data.list)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `

    this.elem.innerHTML = s;
  }
}


class StatisticView{
  constructor(books, visitors) {
    this.books = books;
    this.visitors = visitors;
  }

  renderBook(bl) {
    this.books.innerHTML = bl.map(el => `<tr><td>${el}</td></tr>`).join('');
  }
  
  renderVisitor(vl) {
    this.visitors.innerHTML = vl.map(el => `<tr><td>${el}</td></tr>`).join('');
  }

  render(data) {
    this.renderBook(data.bookList);
    this.renderVisitor(data.visitorList);
  }
}


export {
  ModalView,
  BookView,
  VisitorView,
  CardsView,
  StatisticView
}
