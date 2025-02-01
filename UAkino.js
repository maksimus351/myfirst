(function() {
    var plugin = {
        id: 'uakino_source',
        name: 'uAkino.me',
        version: '1.0',
        description: 'Джерело фільмів з uakino.me',
        url: 'https://uakino.me', // Посилання на сайт
    };

    function search(query, callback) {
        var url = 'https://uakino.me/search?query=' + encodeURIComponent(query); // URL для пошуку фільмів на сайті

        fetch(url)
            .then(response => response.text())
            .then(text => {
                // Парсинг HTML відповіді, щоб отримати потрібні дані
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, 'text/html');
                var movies = doc.querySelectorAll('.item');

                var results = Array.from(movies).map(movie => ({
                    title: movie.querySelector('.title').innerText,
                    url: movie.querySelector('a').href,
                    poster: movie.querySelector('img') ? movie.querySelector('img').src : '',
                    year: movie.querySelector('.year') ? movie.querySelector('.year').innerText : '',
                    quality: movie.querySelector('.quality') ? movie.querySelector('.quality').innerText : 'Не вказано'
                }));

                callback(results); // Відправка результатів пошуку
            })
            .catch(error => console.error('Помилка при отриманні даних:', error));
    }

    function install() {
        Lampa.Source.add(plugin.id, {
            title: plugin.name,
            search: search
        });
    }

    Lampa.Plugin.add(plugin.id, install);
})();
