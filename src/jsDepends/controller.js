import {
  PrimaryModel
} from './model';
import {
  ModalView,
  BookView,
  VisitorView,
  CardsView,
  StatisticView
} from './view';

class ModalController {
  constructor(id, model) {
    this.modalId = document.getElementById(id);
    if (!this.modalId) {
      throw `"${id}" не є елементом дом дерева`;
    }
    this.callback;
    this.type;
    this.model = model;
    this.modalView = new ModalView(this.modalId);
    this.init();
  }

  delegateClickHandler(ev) {
    const t = ev.target;

    if (t.closest('button[data-role="saveChanges"]')) {
      const data = this.modalId.querySelectorAll('[data-form]');
      const dictDatas = { type: this.type };
      data.forEach(el => dictDatas[el.dataset.form] = el.value);
      this.callback(dictDatas) ? (this.modalView.hide(), this.callback = () => { }) : this.modalId.querySelector('.error').style.display = 'block';
    } else if (t.closest('button[data-role="deleteItem"]')) {
      this.callback({ type: 'delete' }) ? (this.modalView.hide(), this.callback = () => { }) : this.modalView.error();
    }
  }

  newBook(cb) {
    this.callback = cb;
    this.type = 'new';
    this.modalView.renderBook();
    this.modalView.show();
  }

  editBook(cb, firstData) {
    this.callback = cb;
    this.type = 'edit';

    this.modalView.renderBook(firstData);
    this.modalView.show();
  }

  newVisitor(cb) {
    this.callback = cb;
    this.type = 'new';
    this.modalView.renderVisitor();
    this.modalView.show();
  }

  editVisitor(cb, firstData) {
    this.callback = cb;
    this.type = 'edit';

    this.modalView.renderVisitor(firstData);
    this.modalView.show();
  }
  
  newCard(cb, obj) {
    this.callback = cb;
    this.type = 'new';
    obj.listVisitors = obj.listVisitors.map(elem => ({name: elem.name, value: elem.id}));
    obj.listBooks = obj.listBooks.map(elem => ({name: elem.name, value: elem.id}));
    this.modalView.renderCard(obj);
    this.modalView.show();
  }

  init() {
    this.modalId.addEventListener('click', this.delegateClickHandler.bind(this));
  }
}

class BooksController {
  constructor(id, mController, model) {
    this.elemId = document.getElementById(id);
    this.mController = mController;
    if (!this.elemId) {
      throw `"${id}" не є елементом дом дерева`;
    }
    this.bView = new BookView(this.elemId);
    this.model = model;
    this.sortFunc = {
      'id': this.model.getById.bind(this.model),
      'name': this.model.getByName.bind(this.model)
    };
    this.sortName = 'id';
    this.searchPrompt = '';
    this.init();
  }

  render() {
    this.model.prompt = this.searchPrompt;
    this.bView.render({ list: this.sortFunc[this.sortName](), sortType: this.sortName, search: this.searchPrompt });
  }

  delegateClickHandler(ev) {
    const t = ev.target;

    if (t.closest('button[data-role="newBookModal"]')) {
      this.mController.newBook(function (data) {
        if (data.type === 'new') {
          this.model.addNewBook(data.bookName);
        }
        this.render();
        return true;
      }.bind(this));
    }
    else if (t.closest('button[data-role="editBookModal"]')) {
      let id_ = +t.closest('button[data-role="editBookModal"]').dataset.id;
      this.mController.editBook(function (data) {
        if (data.type === 'edit') {
          this.model.editBook(id_, data.bookName);
        } else if (data.type === 'delete') {
          this.model.deleteBook(id_);
        }
        this.render();
        return true;
      }.bind(this), this.model.getItem(id_).name);
    }
    else if (t.closest('button[data-role="sort"]')) {
      const v = this.elemId.querySelector('select[data-role="sortList"]').value;
      this.sortName = v;
      this.render();
    }
    else if (t.closest('button[data-role="search"]')) {
      const v = this.elemId.querySelector('input[data-role="searchPrompt"]').value;
      this.searchPrompt = v;
      this.render();
    }
  }

  init() {
    this.render();
    this.elemId.addEventListener('click', this.delegateClickHandler.bind(this));
    document.getElementById('books-tab').addEventListener('click', function(ev) {this.render()}.bind(this))
  }
}


class VisitorController {
  constructor(id, mController, model) {
    this.elemId = document.getElementById(id);
    this.mController = mController;
    if (!this.elemId) {
      throw `"${id}" не є елементом дом дерева`;
    }
    this.vView = new VisitorView(this.elemId);
    this.model = model;
    this.sortFunc = {
      'id': this.model.getById.bind(this.model),
      'name': this.model.getByName.bind(this.model)
    };
    this.sortName = 'id';
    this.searchPrompt = '';
    this.init();
  }

  render() {
    this.model.prompt = this.searchPrompt;
    this.vView.render({ list: this.sortFunc[this.sortName](), sortType: this.sortName, search: this.searchPrompt });
  }

  validatePhone(phone) {
    return /^[0][0-9]{9}$/.test(phone);
  }

  delegateClickHandler(ev) {
    const t = ev.target;

    if (t.closest('button[data-role="newVisitorModal"]')) {
      this.mController.newVisitor(function (data) {
        if (data.type === 'new') {
          if (this.validatePhone(data.visitorPhone)) {this.model.addNewVisitor(data.visitorName, data.visitorPhone)} else { return false };
        }
        this.render();
        return true;
      }.bind(this));
    }

    else if (t.closest('button[data-role="editVisitorModal"]')) {
      let id_ = +t.closest('button[data-role="editVisitorModal"]').dataset.id;
      this.mController.editVisitor(function (data) {
        if (data.type === 'edit') {
          if (this.validatePhone(data.visitorPhone)) {
            this.model.editVisitor(id_, data.visitorName, data.visitorPhone)
          } else { return false };
        } else if (data.type === 'delete') {
          this.model.deleteVisitor(id_);
        }
        this.render();
        return true;
      }.bind(this), { name: this.model.getItem(id_).name, phone: this.model.getItem(id_).phone });
    }

    else if (t.closest('button[data-role="sort"]')) {
      const v = this.elemId.querySelector('select[data-role="sortList"]').value;
      this.sortName = v;
      this.render();
    }

    else if (t.closest('button[data-role="search"]')) {
      const v = this.elemId.querySelector('input[data-role="searchPrompt"]').value;
      this.searchPrompt = v;
      this.render();
    }
  }

  init() {
    this.render();
    this.elemId.addEventListener('click', this.delegateClickHandler.bind(this));
    document.getElementById('visitors-tab').addEventListener('click', function(ev) {this.render()}.bind(this))
  }
}



class CardsController {
  constructor(id, mController, model) {
    this.elemId = document.getElementById(id);
    this.mController = mController;
    if (!this.elemId) {
      throw `"${id}" не є елементом дом дерева`;
    }
    this.сView = new CardsView(this.elemId);
    this.model = model;
    this.sortFunc = {
      'id': this.model.getById.bind(this.model),
      'visitor': this.model.getByVisitor.bind(this.model),
      'book': this.model.getByBook.bind(this.model)
    };
    this.sortName = 'id';
    this.searchPrompt = '';
    this.init();
  }

  render() {
    this.model.prompt = this.searchPrompt;
    this.сView.render({ list: this.sortFunc[this.sortName](), sortType: this.sortName, search: this.searchPrompt });
  }

  validateForm(data) {
    return true;
  }

  delegateClickHandler(ev) {
    const t = ev.target;

    if (t.closest('button[data-role="newCardModal"]')) {
      this.mController.newCard(function (data) {
        if (data.type === 'new') {
          data.visitorId = Number.parseInt(data.visitorId);
          data.bookId = Number.parseInt(data.bookId);
          if (this.validateForm(data)) {this.model.addNewCard(data.visitorId, data.bookId)} else { return false };
        }
        this.render();
        return true;
      }.bind(this), this.model.getForModal());
    }

    else if (t.closest('button[data-role="createReturnDate"]')) {
      let id_ = +t.closest('button[data-role="createReturnDate"]').dataset.id;
      this.model.retCard(id_);
      this.render();
    }

    else if (t.closest('button[data-role="sort"]')) {
      const v = this.elemId.querySelector('select[data-role="sortList"]').value;
      this.sortName = v;
      this.render();
    }

    else if (t.closest('button[data-role="search"]')) {
      const v = this.elemId.querySelector('input[data-role="searchPrompt"]').value;
      this.searchPrompt = v;
      this.render();
    }
  }

  init() {
    this.render();
    this.elemId.addEventListener('click', this.delegateClickHandler.bind(this));
    document.getElementById('cards-tab').addEventListener('click', function(ev) {this.render()}.bind(this))
  }
}


class StatisticController{
  constructor(cModel) {
    this.books = document.getElementById('bestbooks');
    this.visitors = document.getElementById('bestvisitors');
    if (!(this.books && this.visitors)) {
      throw 'Не знайдено елементів статистики';
    }
    this.view = new StatisticView(this.books, this.visitors);
    this.cModel = cModel;
    this.cModel.refreshS = this.render.bind(this);
    this.render();
  }

  render() {
    this.view.render(this.cModel.getStatistic());
  }
}


class PrimaryController {
  constructor() {
    this.mController = new ModalController('defaultModal');
    this.model = new PrimaryModel();
    this.bController = new BooksController('books', this.mController, this.model.bookModel);
    this.vController = new VisitorController('visitors', this.mController, this.model.visitorModel);
    this.cController = new CardsController('cards', this.mController, this.model.cardModel);
    this.sController = new StatisticController(this.model.cardModel);

    this.init();
  }

  init() {

  }
}

const pc = new PrimaryController()
