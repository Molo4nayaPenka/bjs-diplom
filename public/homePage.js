// Выход из личного кабинета
const logoutBtn = new LogoutButton();
logoutBtn.logoutClick = logoutBtn.action(); 
logoutBtn.action = function() {
    ApiConnector.logout((response) => {
        console.log(response);
        if (response.success === true) {
            location.reload();
        }
    });
}

// Получение информации о пользователе
// apiconnector делает запрос. в функции описываем, как будем обрабатывать полученный ответ. ответ поступает в виде объекта.
// этот объект и становится аргументом колбэка.
ApiConnector.current(response => {    
    console.log(response);
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
getStonks = () => {
    ApiConnector.getStocks((response) => {
        console.log(response);
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
}
getStonks();
// кажется, этот интервал не работает. я смотрела, не появляются ли новые запросы во вкладке network, и там запрос stocks
// выполняется только один раз.
setInterval(getStonks, 3600000);

// ОПЕРАЦИИ С ДЕНЬГАМИ
const moneyManager = new MoneyManager();
// Пополнение баланса: 
moneyManager.addMoneyCallback = (data) => {
    console.log(data);
    ApiConnector.addMoney(data, (response) => {
        console.log(response);
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, message = `Успешно пополнили баланс на ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(true, message = response.data);
        }
    });
}

// Kонвертирование валюты:
moneyManager.conversionMoneyCallback = (data) => {
    console.log(data);
    ApiConnector.convertMoney(data, (response) => {
        console.log(response);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, message = `Успешно конвертировали ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
    console.log(data);
    ApiConnector.transferMoney(data, (response) => {
        console.log(response);
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, message = 'Перевод прошёл успешно')
        } else {
            moneyManager.setMessage(true, message = response.data);
        }
    })
}

//РАБОТА С ИЗБРАННЫМ
const favoritesWidget = new FavoritesWidget();
// Запрашиваем начальный список избранного:
ApiConnector.getFavorites((response) => {
    console.log(response);
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } 
});

// Добавляем пользователя в список избранных:
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        console.log(response);
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(false, 'Пользователь добавлен');
        } else {
            favoritesWidget.setMessage(true, response.data);
        }
    })
}

// Удаление пользователя из избранного:
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(false, 'Пользователь удалён');
        }
    })
}