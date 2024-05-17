$(document).ready(() => {
    const changePasswordButton = $('#changePassword');
    const saveChangedUserDataForm = $('#saveChangedUserData');
    const urlSearch = new URLSearchParams(window.location.search)
    fetch("api/v1/user/avatar")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const imgElement = document.querySelector('#userPhoto');
            imgElement.src = 'data:' + data.contentType + ';base64,' + data.bytes;
        })
    fetch("api/v1/personal-data")
        .then((res) =>
            res.json()
        )
        .then(data => {
            $('#userLoginForm').val(data.name)
            $('#userFirstNameForm').val(data.firstName)
            $('#userLastNameForm').val(data.lastName)
            $('#userPatronymicForm').val(data.middleName)
        })
    $('#photoinput').on('change', (e) => {
        e.target.files[0];
        console.log(e.target.files[0])
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        fetch("api/v1/user/avatar", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const imgElement = document.querySelector('#userPhoto');
                imgElement.src = 'data:' + data.contentType + ';base64,' + data.bytes;
            })
    })
    saveChangedUserDataForm.on('submit', (e) =>{
        e.preventDefault()
        let formData = new FormData()
        formData.append('login', $('#userLoginForm').val())
        formData.append('name', $('#userFirstNameForm').val())
        formData.append('surname', $('#userLastNameForm').val())
        formData.append('middleName', $('#userPatronymicForm').val())
        fetch('api/v1/personal-data/change', {
            method: "POST",
            body: formData
        })
            .then((res)  => {
                if (res.ok){
                    alert("Данные изменены")
                    window.location.href = '/account'
                }
            })
    })
    changePasswordButton.on('click', (e) => {
        e.preventDefault();
        window.location.href = '/changeUserPassword'
    })
})


