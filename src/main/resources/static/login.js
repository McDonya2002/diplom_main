
$(document).ready(() => {
    $('.login-form').on('submit', function login(e) {
        e.preventDefault();
        console.log(e.target)
        const userName = $('#userLoginForm').val();
        const userPassword = $('#userPasswordForm').val();
        console.log(userName,userPassword )
        var formData = new FormData();
        formData.append('username', userName)
        formData.append('password', userPassword)
        const data = JSON.stringify({username: userName, password: userPassword})
        fetch(`/login`, {
            method: "POST",
            body: formData
        })
            .then(res => {
                if(res.ok){
                    window.location.href = res.url
                }
        })
    })    
})
