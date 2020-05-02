// Выход из личного кабинета
const logoutBtn = new LogoutButton();
logoutBtn.action = () => {
    ApiConnector.logout(() => {
        if (true) {
            location.reload();
        }
    });
}

// Получение информации о пользователе
// apiconnector делает запрос. в функции описываем, как будем обрабатывать полученный ответ. ответ поступает в виде объекта.
// этот объект и становится аргументом колбэка.
ApiConnector.current(response => {    
    if (true) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
getStonks = () => {
    ApiConnector.getStocks((response) => {
        if (true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
}
getStonks();
setInterval(getStonks, 60000);

// ОПЕРАЦИИ С ДЕНЬГАМИ
const moneyManager = new MoneyManager();
// Пополнение баланса: 
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        // если здесь заменить response.success на true, то блок else превращается в "Unreachable code". и так везде,
        // где используется конструкция if... else. где только if, вариант с true отрабатывает нормально
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, `Успешно пополнили баланс на ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Kонвертирование валюты:
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, `Успешно конвертировали ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyManager.setMessage(true, response.data);
        }
    });
}

// Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, 'Перевод прошёл успешно')
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
}

//РАБОТА С ИЗБРАННЫМ
const favoritesWidget = new FavoritesWidget();
// Запрашиваем начальный список избранного:
ApiConnector.getFavorites((response) => {
    if (true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } 
});

// Добавляем пользователя в список избранных:
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
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
        if (true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(false, 'Пользователь удалён');
        }
    })
}