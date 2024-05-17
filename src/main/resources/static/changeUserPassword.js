$(document).ready(() => {
    const saveChangedUserDataForm = $('#saveChangedUserPassword');
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
        })
    saveChangedUserDataForm.on('submit', (e) =>{
        e.preventDefault()
        if($('#userFirstPassword').val() !== $('#userSecondPassword').val()) {
            alert('Пароли не совпадают!')
            return;
        }
        let formData = new FormData()
        formData.append('password', $('#userSecondPassword').val())
        fetch('api/v1/personal-data/password/change', {
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
})

