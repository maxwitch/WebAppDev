
let openRequest = indexedDB.open("RoleplayDB", 2);
let heroesVault = 'heroes';
let db;
function InitIDB() {
    openRequest.onupgradeneeded = function(event) {
        console.log('Нужен апгрейд')
        db = event.target.result;
        
        if (!db.objectStoreNames.contains(heroesVault)) { // если хранилище "heroes" не существует
            console.log('Хранилище heroes не найдено')
            db.createObjectStore(heroesVault, {KeyPath: 'ID', autoIncrement: true}); // создаём хранилище
            console.log('Хранилище heroes создано')
        }
    };
    
    openRequest.onerror = function() {
        console.error("Error", openRequest.error);
    };

    openRequest.onsuccess = function(event) {
        console.log('Хранилище RoleplayDB успешно открыто')
        db = event.target.result;
        console.log(db)
        fillList(db);
    };
    
    openRequest.onversionchange = function() {
        openRequest.close();
        alert("База данных устарела, пожалуйста, перезагрузите страницу.")
    };
};
InitIDB();

const confirmButtonA = document.getElementById('createheroconfirm'); // захват кнопки создания на модалке (уже декларировно в index.html)
//const modalwindow = document.getElementById('modalWindowOncreatehero'); // пока не нужно, но если че это модальное окно
//const nameHeroInputValue = document.getElementById('inputHeroName'); // Захват поля инпут для имени персонажа в модалке

function fillList(database) {
    db = database;

    let transaction = db.transaction(heroesVault, "readwrite");
    let heroeslist = transaction.objectStore(heroesVault);
    let heroes = heroeslist.getAll();
    heroes.onsuccess = function() {

        if (heroes.result.length) {
            heroesconteiner = heroes.result;
            console.log('Лист героев заполнен')
            heroeslistcontainer.innerHTML = heroesconteiner.map(heroeslist => `<div class="heroes-container">
            <p><a href='heroform.html'>${heroeslist.name}</a></p>
        </div>`).join('');
          } else {
            heroeslistcontainer.innerHTML = `<div class="heroes-container"><p>Пока нет героев</p></div>`
          } 
    }
    
}
confirmButtonA.addEventListener("click", function() { // рабочая функция добавления персонажа
    let inputVal = document.getElementById("inputHeroName").value;
    console.log('Захвачено значение поля ' + inputVal) 
    
    let transaction = db.transaction(heroesVault, "readwrite"); // создание транзакции, имя хранилища, тип транзакции

    let newHero = {
        name: inputVal
    }

    let request = transaction.objectStore(heroesVault).add(newHero); // добавление в хранилище нового героя

    request.onsuccess = function() { //
        console.log("Герой добавлен в хранилище", request.result);
      };
      
    request.onerror = function() {
        console.log("Ошибка", request.error);
      };
    
    fillList(db)

});
