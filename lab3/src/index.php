<?php
require __DIR__ . '/config/db.php';

require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';

$newsStmt = $pdo->query('SELECT title, content FROM news ORDER BY created_at DESC');

$days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
$months = [
    1 => 'января', 2 => 'февраля', 3 => 'марта', 4 => 'апреля',
    5 => 'мая', 6 => 'июня', 7 => 'июля', 8 => 'августа',
    9 => 'сентября', 10 => 'октября', 11 => 'ноября', 12 => 'декабря'
];

$date = new DateTime();
$dayOfWeek = $days[$date->format('w')];
$dayOfMonth = $date->format('j');
$monthNum = (int)$date->format('n');
$year = $date->format('Y');

$currentDate = "$dayOfMonth $months[$monthNum] $year, $dayOfWeek";
?>

<main class="main">

<section class="section">
    <h2 class="section__title">Сегодня: <?= $currentDate ?></h2>
    <p>Мы работаем для вашего здоровья каждый день. Запишитесь на прием к лучшим специалистам города!</p>
</section>

<section class="section section--light">
    <div class="section__container">
        <h2 class="section__title" id="news">Новости и акции</h2>
        <div class="news">
            <?php foreach ($newsStmt as $news): ?>
                <article class="news__item">
                    <h3><?= htmlspecialchars($news['title']) ?></h3>
                    <p><?= htmlspecialchars($news['content']) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section">
    <h2 class="section__title">О нашем центре</h2>
    <p>Медицинский центр «Здоровье+» — это современная клиника, оснащенная передовым диагностическим и лечебным оборудованием. Наши врачи постоянно повышают свою квалификацию, чтобы обеспечивать вам медицинскую помощь самого высокого уровня.</p>
</section>

</main>

<?php require __DIR__ . '/templates/footer.php'; ?>