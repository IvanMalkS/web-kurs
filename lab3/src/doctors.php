<?php
require __DIR__ . '/config/db.php';

require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';

$doctorsStmt = $pdo->query('SELECT name, specialty, photo FROM doctors');

?>

<main class="main">
    <section class="section">
        <h2 class="section__title" id="doctors">Наши специалисты</h2>
        <p class="section__subtitle">Высококвалифицированные врачи с многолетним опытом работы.</p>
        
        <div class="doctors">
            <?php foreach ($doctorsStmt as $doctor): ?>
                <div class="doctor-card">
                    <div class="doctor-card__image-container">
                        <?php if ($doctor['photo'] && file_exists(__DIR__ . '/img/' . $doctor['photo'])): ?>
                            <img src="img/<?= htmlspecialchars($doctor['photo']) ?>" alt="" class="doctor-card__photo">
                        <?php else: ?>
                            <div class="doctor-card__photo-placeholder">👨‍⚕️</div>
                        <?php endif; ?>
                    </div>
                    <h3 class="doctor-card__name"><?= htmlspecialchars($doctor['name']) ?></h3>
                    <p class="doctor-card__specialty"><?= htmlspecialchars($doctor['specialty']) ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
</main>

<?php require __DIR__ . '/templates/footer.php'; ?>
