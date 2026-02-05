<?php
require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';

$jsonFile = __DIR__ . '/../data/results.json';
$items = [];

if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    $items = json_decode($jsonData, true);
}
?>

<main class="main">
    <section>
        <h1 class="section__title">Geely Cityray</h1>
        <p class="section__subtitle">Автоматизированный мониторинг цен и комплектаций</p>

        <?php if (empty($items)): ?>
            <div style="text-align: center; padding: 50px; background: white; border-radius: 12px;">
                <p>Данные в данный момент недоступны. Запустите процесс парсинга.</p>
            </div>
        <?php else: ?>
            <div class="news">
                <?php foreach ($items as $item): ?>
                    <article class="news__item">
                        <?php if (!empty($item['photo'])): ?>
                            <div class="news__image-container" style="margin-bottom: 15px; border-radius: 8px; overflow: hidden; height: 180px;">
                                <img src="<?= htmlspecialchars($item['photo']) ?>" alt="<?= htmlspecialchars($item['title']) ?>" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        <?php endif; ?>
                        <h3 class="news__title"><?= htmlspecialchars($item['title']) ?></h3>
                        <p class="news__price"><?= htmlspecialchars($item['price']) ?> ₽</p>
                        <p class="news__content"><?= htmlspecialchars($item['description']) ?></p>
                        <?php if ($item['link'] !== '#' && !empty($item['link'])): ?>
                            <a href="<?= htmlspecialchars($item['link']) ?>" target="_blank" class="news__link">Детали на сайте</a>
                        <?php else: ?>
                            <span class="news__link" style="opacity: 0.5; cursor: not-allowed;">В архиве</span>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>
</main>

<?php require __DIR__ . '/templates/footer.php'; ?>
