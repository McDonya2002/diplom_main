$(document).ready(() => {
    const form = $('#saveRejectedPoint');
    form.on('submit', (e) => {
        e.preventDefault()
        const inputData = $('#rejectPointWorker').val();
        const urlSearch = new URLSearchParams(window.location.search)
        const pointId = urlSearch.get("id")
        console.log(inputData, pointId)
        fetch("/api/v1/point/" + pointId + "/worker/" + inputData, {
            method: "POST"
        })
            .then((res) => {
                if (res.ok){
                    alert("Сотрудник назначен")
                    window.location.href = "/account"
                }
            })
    })
})

