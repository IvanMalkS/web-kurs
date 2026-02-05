<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';
?>

<main class="main">
    <section class="section">
        <h2 class="section__title">Наши услуги</h2>
        <p>Мы предлагаем широкий спектр медицинских услуг:</p>
        <ul class="services">
            <li class="services__item">Терапия</li>
            <li class="services__item">Кардиология</li>
            <li class="services__item">Неврология</li>
            <li class="services__item">УЗИ-диагностика</li>
            <li class="services__item">Лабораторные анализы</li>
            <li class="services__item">Педиатрия</li>
        </ul>
    </section>
</main>

<?php require __DIR__ . '/templates/footer.php'; ?>
