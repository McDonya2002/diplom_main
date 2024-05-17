$(document).ready(() => {
    const date = new Date().toJSON().split('T')[0]
    $('#pointCardDate').val(date)
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
            $("#pointCardCoordinates").val(result.geoObjects.get(0).geometry.getCoordinates())
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

    var form = document.querySelector('#addPointForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        ymaps.geolocation.get({
            mapStateAutoApply: true,
            provider: 'browser'
        }).then(function (result) {
            var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
            var formData = new FormData();
            console.log(userCoodinates)
            const description = document.querySelector("#pointCardDescription").value
            const name = document.querySelector("#pointCardName").value
            const file = document.querySelector("#pointCardFile")
            formData.append('file', file.files[0]);
            formData.append('name', name);
            formData.append('latitude', userCoodinates[1])
            formData.append('longitude', userCoodinates[0])
            formData.append('description', description)
            console.log(formData)
            fetch('/api/v1/points', {
                    method: 'POST',
                    body: formData
                }
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.text();
                })
                .then(data => {
                    alert(data);
                    window.location.href = '/';
                })
                .catch(error => {
                    alert('Error: ' + error);
                });
        });
    });
})

