<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';
?>

<main class="main">
    <section class="section section--light">
        <h2 class="section__title">Контакты</h2>
        <div class="contacts">
            <div class="contacts__info">
                <p class="contacts__text"><strong>Адрес:</strong> г. Пермь, ул. Ленина, 10</p>
                <p class="contacts__text"><strong>Телефон:</strong> +7 (342) 222-33-44</p>
                <p class="contacts__text"><strong>Email:</strong> info@healthplus.ru</p>
            </div>
            
            <div class="contacts__geo">
                <button class="contacts__button contacts__button--geo" onclick="getLocation()">
                    Где я нахожусь?
                </button>
                <p id="location" class="contacts__location"></p>
            </div>
        </div>
    </section>
</main>

<script>
function getLocation() {
    const x = document.getElementById("location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            x.innerHTML = "Широта: " + position.coords.latitude + 
            "<br>Долгота: " + position.coords.longitude;
        }, (err) => {
            x.innerHTML = "Ошибка: " + err.message;
        });
    } else { 
        x.innerHTML = "Геолокация не поддерживается вашим браузером.";
    }
}
</script>

<?php require __DIR__ . '/templates/footer.php'; ?>
