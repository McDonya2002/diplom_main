$(document).ready( () => {
    fetch("api/v1/user/avatar")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const imgElement = document.querySelector('#userAvatarMenu');
            imgElement.src = 'data:' + data.contentType + ';base64,' + data.bytes;
        })
})

