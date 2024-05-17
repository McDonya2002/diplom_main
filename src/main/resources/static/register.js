$(document).ready(() => {
    $('.registry-form').on('submit', function login(e) {
        e.preventDefault();
        const userName = $('#userLoginForm').val();
        const userPassword = $('#userPasswordForm').val();
        const userFirstName = $('#userFirstNameForm').val();
        const userLastName = $('#userLastNameForm').val();
        const userPatronymicName = $('#userPatronymicForm').val();
        const userData = {
            name: userName,
            password: userPassword,
            firstName: userFirstName,
            lastName: userLastName,
            middleName: userPatronymicName
        }
        fetch('/api/v1/new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.text();
            })
            .then(data => {
                alert(data);
                window.location.href = '/account';
            })
            .catch(error => {
                // Обработка ошибки
                if (error.message === "422") {
                    alert('Error: ' + "Пользователь с таким Login уже существует");
                } else {
                    alert('Error: ' + error);
                }
            });
    })    
})
