'use strict'


class LocalStorage {
  #keys=[];

  constructor () {
    this.#refreshKeys();
  }

  get length() {
    return localStorage.length;
  }

  get keys() {
    return [...this.#keys]
  }

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    this.#refreshKeys();
  }

  read(key) {
    let data = localStorage.getItem(key)
    if (data === null) {
      data = '[]';
    }
    return JSON.parse(data)
  }

  #refreshKeys() {
    let len = this.length;
    this.#keys = [];
    for (let i = 0; i < len; i++) {
      this.keys.push(localStorage.key(i));
    }
  }
}


class BooksModel{
  #data = [];
  constructor(storage) {
    this.storage = storage;
    this.#data = this.#read();
    this.prompt = '';
    this.callForVisitor;
  }

  get lastId() {
    let lid = 0;
    this.#data.forEach(el => el.id > lid && (lid = el.id));
    return lid;
  }

  addVisitor(arr) {
    if (this.callForVisitor) {
      const listVisitor = this.callForVisitor();
      
      arr.map(el => {
        const t = listVisitor.filter(els => els.bookId === el.id)[0];
        if (t) {
          el['visitorName'] = t.visitorName;
        } else {
          el['visitorName'] = '-';
        }
        return arr;
        })
    }
    return arr
  }

  getById() {
    let retArr = [...this.#data];
    retArr.sort((a, b) => a.id - b.id);
    return this.addVisitor(retArr.filter((elem) => (new RegExp(this.prompt, 'gmi')).test(elem.name)));
  }

  getByName() {
    let retArr = [...this.#data];
    retArr.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
    return this.addVisitor(retArr.filter((elem) => (new RegExp(this.prompt, 'gmi')).test(elem.name)));
  }

  #read() {return this.storage.read('books')}

  #write() {return this.storage.write('books', this.#data)}

  getItem(id) {
    let d = {};
    this.#data.forEach(elem => {
      if (elem.id === id) {
        d = elem;
      }
    });
    return d;
  }

  addNewBook(name) {
    this.#data.push({
      id: this.lastId + 1,
      name: name
    });
    this.#write();
  }

  editBook(id, name) {
    this.#data.forEach(elem => {
      if (elem.id === id) {
        elem.name = name
      }
    });
    this.#write();
  }

  deleteBook(id) {
    this.#data = this.#data.filter(el => el.id !== id);
    this.#write();
  }
}


class VisitorModel{
  #data = [];
  constructor(storage) {
    this.storage = storage;
    this.#data = this.#read();
    this.prompt = '';
  }

  get lastId() {
    let lid = 0;
    this.#data.forEach(el => el.id > lid && (lid = el.id));
    return lid;
  }

  getById() {
    let retArr = [...this.#data];
    retArr.sort((a, b) => a.id - b.id);
    return retArr.filter((elem) => (new RegExp(this.prompt, 'gmi')).test(elem.name));
    // return retArr;
  }

  getByName() {
    let retArr = [...this.#data];
    retArr.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
    return retArr.filter((elem) => (new RegExp(this.prompt, 'gmi')).test(elem.name));
  }

  #read() {return this.storage.read('visitors')}

  #write() {return this.storage.write('visitors', this.#data)}

  getItem(id) {
    let d = {};
    this.#data.forEach(elem => {
      if (elem.id === id) {
        d = elem;
      }
    });
    return d;
  }

  addNewVisitor(name, phone) {
    this.#data.push({
      id: this.lastId + 1,
      name: name,
      phone: phone
    });
    this.#write();
  }

  editVisitor(id, name, phone) {
    this.#data.forEach(elem => {
      if (elem.id === id) {
        elem.name = name;
        elem.phone = phone;
      }
    });
    this.#write();
  }

  deleteVisitor(id) {
    this.#data = this.#data.filter(el => el.id !== id);
    this.#write();
  }
}


class CardModel{
  #data = [];
  constructor(storage, bModel, vModel) {
    this.storage = storage;
    this.#data = this.#read();
    this.prompt = '';
    this.bModel = bModel;
    this.vModel = vModel;
    this.refreshS;
  }

  get lastId() {
    let lid = 0;
    this.#data.forEach(el => el.id > lid && (lid = el.id));
    return lid;
  }

  getById() {
    let retArr = [...this.#data];
    const vOrig = this.vModel.getByName();
    const bOrig = this.bModel.getById();
    const vi = vOrig.map(el => el.id);
    const bi = bOrig.map(el => el.id);
    retArr.sort((a, b) => a.id - b.id);
    retArr.forEach(elem => {
      elem.visitorName = vOrig[vi.indexOf(elem.visitorId)].name;
      elem.bookName = bOrig[bi.indexOf(elem.bookId)].name;
    });
    return retArr.filter((elem) => ((new RegExp(this.prompt, 'gmi')).test(elem.visitorName) || (new RegExp(this.prompt, 'gmi')).test(elem.bookName)));
  }

  getByVisitor() {
    let retArr = [...this.#data];
    const vOrig = this.vModel.getByName();
    const bOrig = this.bModel.getById();
    const vi = vOrig.map(el => el.id);
    const bi = bOrig.map(el => el.id);
    retArr.sort((a, b) => vi.indexOf(a.visitorId) - vi.indexOf(b.visitorId));
    retArr.forEach(elem => {
      elem.visitorName = vOrig[vi.indexOf(elem.visitorId)].name;
      elem.bookName = bOrig[bi.indexOf(elem.bookId)].name;
    });
    return retArr.filter((elem) => ((new RegExp(this.prompt, 'gmi')).test(elem.visitorName) || (new RegExp(this.prompt, 'gmi')).test(elem.bookName)));
  }

  getByBook() {
    let retArr = [...this.#data];
    const vOrig = this.vModel.getById();
    const bOrig = this.bModel.getByName();
    const vi = vOrig.map(el => el.id);
    const bi = bOrig.map(el => el.id);
    retArr.sort((a, b) => bi.indexOf(a.bookId) - bi.indexOf(b.bookId));
    retArr.forEach(elem => {
      elem.visitorName = vOrig[vi.indexOf(elem.visitorId)].name;
      elem.bookName = bOrig[bi.indexOf(elem.bookId)].name;
    });
    return retArr.filter((elem) => ((new RegExp(this.prompt, 'gmi')).test(elem.visitorName) || (new RegExp(this.prompt, 'gmi')).test(elem.bookName)));
  }

  #read() {return this.storage.read('cards')}

  #write() {return this.storage.write('cards', this.#data)}

  #getVisitor(id) {
    return this.vModel.getItem(id);
  }
  
  #getBook(id) {
    return this.bModel.getItem(id);
  }

  validateIds(visitor_id, book_id) {
    return !this.isObjectEmpty(this.#getVisitor(visitor_id)) && !this.isObjectEmpty(this.#getBook(book_id));
  }

  isObjectEmpty(objectName) {
    return Object.keys(objectName).length === 0 && objectName.constructor === Object;
  }

  getForModal() {
    const bids = this.getById().filter(el => el.return === null).map(el => el.bookId);
    const vOrig = this.vModel.getByName();
    const bOrig = this.bModel.getByName().filter(el => !bids.includes(el.id));
    return {
      listVisitors: vOrig,
      listBooks: bOrig
    }
  }

  getVisitorForBook() {
    let retArr = [...this.#data];
    retArr = retArr.filter(el => el.return === null);
    const vOrig = this.vModel.getByName();
    const vi = vOrig.map(el => el.id);
    retArr.forEach(elem => {
      elem.visitorName = vOrig[vi.indexOf(elem.visitorId)].name;
    });
    return retArr;
  }

  getItem(id) {
    let d = {};
    this.#data.forEach(elem => {
      if (elem.id === id) {
        d = elem;
      }
    });
    return d;
  }

  getStatistic() {
    const bookS = {};
    const visitorS = {};
    this.getById().forEach(el => {
      bookS[el.bookId.toString()] ? bookS[el.bookId.toString()] += 1 : bookS[el.bookId.toString()] = 1;
      visitorS[el.visitorId.toString()] ? visitorS[el.visitorId.toString()] += 1 : visitorS[el.visitorId.toString()] = 1;
    });

    let bk = Object.keys(bookS);
    bk.sort((a, b) => bookS[b] - bookS[a]);
    bk.length = 15;
    bk = bk.map(el => this.bModel.getItem(Number.parseInt(el)).name);

    let vk = Object.keys(visitorS);
    vk.sort((a, b) => visitorS[b] - visitorS[a]);
    vk.length = 15;
    vk = vk.map(el => this.vModel.getItem(Number.parseInt(el)).name);

    return {bookList: bk, visitorList: vk};
  }

  addNewCard(visitor_id, book_id) {
    const cDate = new Date();
    this.#data.push({
      id: this.lastId + 1,
      visitorId: visitor_id,
      bookId: book_id,
      borrow: `${cDate.getDate().toString().padStart(2, '0')}.${cDate.getMonth().toString().padStart(2, '0')}.${cDate.getFullYear()}`,
      return: null
    });
    this.#write();
    this.refreshS();
  }

  retCard(id) {
    const cDate = new Date();
    this.getItem(id).return = `${cDate.getDate().toString().padStart(2, '0')}.${cDate.getMonth().toString().padStart(2, '0')}.${cDate.getFullYear()}`;
    this.#write();
    this.refreshS();
  }
}


class PrimaryModel{
  #memCache = {};
  constructor(type='LocalStorage') {
    if (type === 'LocalStorage') {
      this.storage = new LocalStorage();
    } else {
      this.storage = new LocalStorage();
    }
    this.bookModel = new BooksModel(this.storage);
    this.visitorModel = new VisitorModel(this.storage);
    this.cardModel = new CardModel(this.storage, this.bookModel, this.visitorModel);
    this.bookModel.callForVisitor = this.getVisitorsToBooks.bind(this);
  }

  getVisitorsToBooks() {
    return this.cardModel.getVisitorForBook()
  }
}


export {
  PrimaryModel
}
