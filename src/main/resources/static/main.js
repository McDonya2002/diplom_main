$(document).ready( () => {
    if(location.pathname === "/"){
        var map;
        ymaps.ready(function() {
            map = new ymaps.Map('map', {
                center: [55, 34],
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            });

            var geolocation = ymaps.geolocation;
            geolocation.get({
                provider: 'browser',
                mapStateAutoApply: true
            }).then(function(result) {
                result.geoObjects.options.set('preset', 'islands#redCircleIcon');
                map.geoObjects.add(result.geoObjects);
            });

            fetch('/api/v1/points')
                .then(response => response.json())
                .then(data => {
                    data.forEach(point => {
                        var coordinates = [point.longitude, point.latitude];
                        var placemark;
                        var preset = point.statusForUser === 'Закрыта' ?
                            'islands#greenCircleDotIcon' : 'islands#redCircleDotIcon';
                        placemark = new ymaps.Placemark(coordinates, {}, {
                            preset: preset
                        });
                        map.geoObjects.add(placemark);
                    });
                    const groupedPoints = {};
                    data.forEach(point => {
                        if (point.cluster !== -1) {
                            if (!groupedPoints[point.cluster]) {
                                groupedPoints[point.cluster] = [];
                            }
                            groupedPoints[point.cluster].push(point);
                        }
                    });

                    Object.values(groupedPoints).forEach(clusterPoints => {
                        const filteredPoints = clusterPoints.filter(point => point.place !== -1);
                        filteredPoints.sort((a, b) => a.place - b.place);
                        const coordinates = filteredPoints.map(point => [point.longitude, point.latitude]);
                        const polygon = new ymaps.Polygon([coordinates], {}, {
                            fillColor: '#d35a5a',
                            strokeColor: '#e30909',
                            opacity: 0.5,
                            strokeWidth: 2
                        });
                        map.geoObjects.add(polygon);
                    });
                })
                .catch(error => {
                    console.error('Error fetching points:', error);
                });
        });
    }

    let username;
    if (location.pathname.includes("account")) {
        fetch("/api/v1/user/login", {
            method: 'get'
        }).then(res => res.text())
            .then((res) => {
                console.log(res);
                $('#userName').text(res);
                $('#nameChanger').val(res);
                username = res;
            })

        fetch("api/v1/user/avatar")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const imgElement = document.querySelector('#userPhoto');
                imgElement.src = 'data:' + data.contentType + ';base64,' + data.bytes;
            })

        fetch("/api/v1/user/role")
            .then(res => res.text())
            .then(role => {
        if (role === "USER") {
            let mockData = ' <div class="table-header bg-gray px-2 py-1"> ' +
                '<div id="pointName" class="inline-block w-2/3 md:w-10/12 font-medium">Название</div> ' +
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
                                        class=""
                                        ><div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${point.statusForUser}
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
        }
        if (role === "ADMIN") {

            // Функция для получения данных по URL и обновления списка пользователей
            function getUsers() {
                let mockData = ' <div class="table-header bg-gray px-2 py-1"> <div id="pointName" ' +
                    'class="inline-block w-2/3 md:w-10/12 font-medium">Логин</div> <div id="pointStatus" ' +
                    'class="inline-block py-1 px-3 font-medium">Роль</div>  </div>';
                fetch('/api/v1/users')
                    .then(response => response.json())
                    .then(data => {
                        const userList = $(".user-table");
                        data.forEach(user => {
                            mockData += ` <a href="/admin-user-role-change?id=${user.id}" class="no-underline w-full user-table-link" id="${user.id}">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="userName" class="w-full font-light px-2 no-underline user-profile">
                                    ${user.name}
                                  </div>
                                <div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${user.role}
                                        </div>
              
            </div>
          </a>`
                        });
                        userList.html(mockData)
                    })
                    .catch(error => {
                        console.error('Произошла ошибка:', error);
                    });
            }

            function getPoints() {
                let mockData = ' <div class="table-header bg-gray px-2 py-1"> ' +
                    '<div id="pointName" class="inline-block w-2/3 md:w-10/12 font-medium">Название</div> ' +
                    '<div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  </div>';
                fetch('/api/v1/points/admin')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ошибка HTTP: ' + response.status);
                        }
                        return response.text();
                    })
                    .then(pointsText => {
                        const points = JSON.parse(pointsText);

                        const pointsList = $(".table-points");
                        points.forEach(point => {
                            mockData += ` <a href="/point-card?id=${point.id}" class="no-underline w-full">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="pointName" class="w-full font-light px-2 no-underline">
                                    ${point.name}
                                  </div>
                                    ${1 ?
                                ` <a
                                        href="point-card?id=${point.id}"
                                        class=""
                                        ><div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${point.statusForAdmin}
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
                        // Обработка ошибок
                    });
            }
            getUsers();
            getPoints();
        }
    }
            )}

    if (location.pathname.includes("role-change")){
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
                        select = '<select class="block min-w-[200px] w-full message-no-input" name="userRole" id="userRole" value="USER">'
                            + dataForSelect + '</select>';
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
                    <button class="ml-3 d-block  md:w-1/2 text-center rounded-md py-3 px-5 md:mx-auto bg-green 
                    text-white text-xl md:text-xl" type="button">Изменить роль</button>
                    `
                        $('#userDataForAdmin').html(innerUserData);
                    })
            })
    }

    $('#searchUsersForm').off('submit').on('submit', (e) => {
        e.preventDefault();
        let search = $('#userSearch').val();
        console.log(search)
        if (search === ''){
            search = '-'
        }
        console.log(search)
        $('user-table')
        let mockData = `<div class="table-header bg-gray px-2 py-1">
        <div id="pointName" class="inline-block w-2/3 md:w-10/12 font-medium">
          ИМЯ
        </div>
        <div id="pointStatus" class="inline-block py-1 px-3 font-medium">
          РОЛЬ
        </div>
      </div>`;

        fetch('/api/v1/user/name/' + search).then(res => res.text())
            .then((data) => {
                data = JSON.parse(data)
                data.map((item) => {
                    mockData += `
                <a href="#" class="no-underline w-full user-table-link">
                <div class="table-row-custom flex align-items-center px-2 py-1">
                  <div id="pointName" class="w-full font-light px-2 no-underline">
                    ${item.name}
                  </div>
                  <div id="pointStatusRow" class=" py-1 px-3 text-center no-underline">
                   ${item.role}
                  </div>
                </div>
              </a>
                `
                })
                $('.user-table').html(mockData)


            })
    })


    $('#searchPointsForm').on('submit', (e) => {
        e.preventDefault();
        let selected = $('#PointsByRole>option:selected').val();
        if (!selected) {
            selected = "-"
        }
        let mockData = `<div class="table-header bg-gray px-2 py-1">
        <div id="pointName" class="inline-block w-2/3 md:w-10/12 font-medium">
          ТОЧКА
        </div>
        <div id="pointStatus" class="inline-block py-1 px-3 font-medium">
          СТАТУС
        </div>
      </div>`;

        fetch('api/v1/points/admin/' + selected).then(res => res.text())
            .then((data) => {
                data = JSON.parse(data)
                data.map((item) => {
                    mockData += `
                <a href="/point-card?id=${item.id}" class="no-underline w-full user-point-link">
                <div class="table-row-custom flex align-items-center px-2 py-1">
                  <div id="pointName" class="w-full font-light px-2 no-underline">
                    ${item.name}
                  </div>
                  <div id="pointStatusRow" class=" py-1 px-3 text-center no-underline">
                   ${item.statusForAdmin}
                  </div>
                </div>
              </a>
                `
                })
                $('.table-points').html(mockData)
            })
    })
    $('.input-file input[type=file]').on('change', function () {
        let file = this.files[0];
        $(this).closest('.input-file').find('.input-file-text').html(file.name);
    });
    $('#edit').off('click').on('click', () => {
        window.location.href = "/personal-data"
    })

    $('#done').off('click').on('click', () => {
        let postData = {
            name: $('#nameChanger').val(),
        }
        //alert(postData.name, CONSTS.CHANGE_NAME)
        console.log(CONSTS.CHANGE_NAME)
        fetch("/api/v1/user/login/change", {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        }).then(() => {
            console.log(postData)
            //location.reload();
        })

        // $('#userName').toggleClass('hidden');
        // $('#nameChanger').toggleClass('hidden');
        // $('#done').toggleClass('hidden');
        // $('#edit').toggleClass('hidden');

    })
    if (location.pathname.includes('point-card')) {
        let point_latitude;
        let point_longitude;
        const urlParams = new URLSearchParams(window.location.search);
        const pointId = urlParams.get('id');
        console.log(pointId)
        // Используем Fetch API для получения данных
        fetch('/api/v1/points/' + pointId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const date = document.querySelector('.card-date-open span');
                const status = document.querySelector('.card-status span');
                const description = document.querySelector('.card-description span');
                const name = document.querySelector('.card-name span');

                date.innerText = new Date(data.date).toISOString().split('T')[0];
                status.innerText = data.statusForUser;
                description.innerText = data.description;
                point_latitude = data.latitude;
                point_longitude = data.longitude;
                name.innerText = data.name;

                ymaps.ready(init);

                function init() {
                    myMap = new ymaps.Map('map', {
                        center: [point_longitude, point_latitude], // Москва
                        zoom: 15
                    }, {
                        searchControlProvider: 'yandex#search'
                    });
                    var coordinates = [point_longitude, point_latitude];
                    var placemark = new ymaps.Placemark(coordinates);
                    myMap.geoObjects.add(placemark);
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });

        fetch("/api/v1/point/" + pointId + "/image")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Создаем элемент изображения
                const imgElement = document.querySelector('.card-img-user img');
                imgElement.src = 'data:' + data[0].contentType + ';base64,' + data[0].bytes;
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
        fetch("/api/v1/point/" + pointId + "/image/worker")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Создаем элемент изображения
                const imgElement = document.querySelector('.card-img-worker img');
                imgElement.src = 'data:' + data[0].contentType + ';base64,' + data[0].bytes;
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
    var $rows = $('.user-table a');
    $('#userSearch').keyup(function () {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        $rows.show().filter(function () {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });
})