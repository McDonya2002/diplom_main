$(document).ready(() => {
    let username;
    fetch("/api/v1/user/login", {
        method: 'get'
    }).then(res => res.text())
        .then((res) => {
            console.log(res);
            $('#userName').text(res);
            $('#nameChanger').val(res);
            username = res;
            let mockData = ' <div class="table-header bg-gray px-2 py-1"> ' +
                '<div id="pointName" class="inline-block w-10/12 font-medium">Название</div> ' +
                '<div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  ' +
                '</div>';
            fetch(`/api/v1/points?username=${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка HTTP: ' + response.status);
                    }
                    return response.text();
                })
                .then(pointsText => {
                    const points = JSON.parse(pointsText);
                    const pointsList = $(".table-custom");
                    points.forEach(point => {
                        mockData += ` <a href="/point-card?id=${point.id}" class="no-underline w-full">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="pointName" class="w-full font-light px-2 no-underline">
                                    ${point.name}
                                  </div>
                                    ${1 ?
                            ` <a
                                        href="point-card?id=${point.id}"
                                        class="${point.statusForWorker === 'Закрыть' ? 'bg-red rounded' : ''}"
                                        ><div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${point.statusForWorker} 
                                        </div></a
                                      >`
                            : ''}
              
                                </div>
                              </a>`
                    });
                    pointsList.html(mockData)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        })
})




