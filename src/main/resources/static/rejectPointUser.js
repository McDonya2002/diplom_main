$(document).ready(() => {
    const form = $('#saveRejectedPoint');
    form.on('submit', (e) => {
        e.preventDefault()
        const inputData = $('#rejectPointUser').val();
        const urlSearch = new URLSearchParams(window.location.search)
        const pointId = urlSearch.get("id")
        console.log(inputData, pointId)
        const formdata = new FormData()
        formdata.append('comment', inputData)
        fetch("/api/v1/points/reject/" + pointId, {
            method: "POST",
            body: formdata
        })
            .then((res) => {
                if (res.ok){
                    alert("Сотрудник назначен")
                    window.location.href = "/account"
                }
            })
    })
})


