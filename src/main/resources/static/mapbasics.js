document.ready(() => {
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
})
