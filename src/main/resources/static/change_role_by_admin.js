$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    fetch('/api/v1/personal-data/' + userId).then(res => res.json())
        .then((res) => {
            let innerUserData = '';
            let select;
            let dataForSelect;
            fetch('/api/v1/roles')
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    response.map((item) => {
                        dataForSelect += `<option value="${item}">${item}</option>`
                    })
                    console.log(dataForSelect)
                    select = '<select class="block min-w-[200px] w-full message-no-input" name="userRole" id="userRole" value="USER">' + dataForSelect + '</select>';
                    innerUserData += `
                    <div class="form-row">
                        <label for="inputName">Логин</label>
                        <span class="my-1 block w-full message-no-input">${res.name}</span>
                    </div>
                     <div class="form-row">
                        <label for="inputName">Фамилия</label>
                        <span class="my-1 block w-full message-no-input">${res.lastName}</span>
                    </div>
                     <div class="form-row">
                        <label for="inputName">Имя</label>
                        <span class="my-1 block w-full message-no-input">${res.firstName}</span>
                    </div>
                    <div class="form-row">
                    <label for="inputName">Отчество</label>
                    <span class="my-1 block w-full message-no-input">${res.middleName}</span>
                    </div>
                    <div class="form-row">
                      <label for="inputName">Роль</label>
                      ${select}
                    </div>
                    <button class="d-block  md:w-1/2 text-center rounded-md py-3 px-5 md:mx-auto bg-green text-white text-xl md:text-xl" 
                    type="submit">Изменить роль</button>
                    `
                    $('#userDataForAdmin').html(innerUserData);
                })

        })
    $('.change-role').on('submit', function login(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        const selectedRole = $('select#userRole option:selected').val()
        fetch("api/v1/user/" + userId + "/" + selectedRole, {
            method: "POST"
        }).then((res) => {
            if(res.ok){
                alert("Роль изменена")
                window.location.href = "/account"
            }

        })
    })
})

