$(document).ready(() => {
    const form = $('#saveAprovePoint');
    form.on('submit', (e) => {
        e.preventDefault()
        const inputData = $('#aprovePointWorker').val();
        const urlSearch = new URLSearchParams(window.location.search)
        const pointId = urlSearch.get("id")
        console.log(inputData, pointId)
        fetch("api/v1/points/" + pointId + "/close/" + inputData, {
            method: "POST"
        })
            .then((res) => {
                if (res.ok){
                    alert("Точка верифицирована")
                    window.location.href = "/account"
                }})})})

