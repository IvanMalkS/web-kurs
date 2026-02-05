<?php
require __DIR__ . '/config/db.php';

$success = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare(
        'INSERT INTO appointments (patient_name, phone, doctor_id, visit_date)
         VALUES (:name, :phone, :doctor, :date)'
    );

    $stmt->execute([
        'name'   => $_POST['name'] ?? '',
        'phone'  => $_POST['phone'] ?? '',
        'doctor' => $_POST['doctor'] ?? null,
        'date'   => $_POST['date'] ?? '',
    ]);

    header('Location: /appointment.php?success=1');
    exit;
}

$doctors = $pdo->query('SELECT id, name FROM doctors');

$appointments = $pdo->query('
    SELECT a.patient_name, a.phone, a.visit_date, d.name as doctor_name 
    FROM appointments a 
    JOIN doctors d ON a.doctor_id = d.id 
    ORDER BY a.created_at DESC
');

require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';
?>

<main class="main">
    <section class="section">
        <div class="section--appointment">
        <h2 class="section__title">Запись к врачу</h2>

        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert--success">
                Запись успешно сохранена! Мы свяжемся с вами в ближайшее время.
            </div>
        <?php endif; ?>

        <form method="post" class="form js-appointment-form" id="appointmentForm">
            <div class="form__group">
                <label class="form__label">Ваше ФИО:</label>
                <input name="name" class="form__input" id="patientName" placeholder="Иванов Иван Иванович" required>
                <span class="form__error" id="nameError"></span>
            </div>

            <div class="form__group">
                <label class="form__label">Телефон:</label>
                <input name="phone" class="form__input" id="patientPhone" placeholder="+7 (999) 000-00-00" required>
                <span class="form__error" id="phoneError"></span>
            </div>

            <div class="form__group">
                <label class="form__label">Выберите врача:</label>
                <select name="doctor" class="form__select" id="doctorSelect" required>
                    <option value="" disabled selected>-- Выберите специалиста --</option>
                    <?php foreach ($doctors as $doctor): ?>
                        <option value="<?= $doctor['id'] ?>">
                            <?= htmlspecialchars($doctor['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <span class="form__error" id="doctorError"></span>
            </div>

            <div class="form__group">
                <label class="form__label">Дата визита:</label>
                <input type="date" name="date" class="form__input" id="visitDate" required>
                <span class="form__error" id="dateError"></span>
            </div>

            <button type="submit" class="form__button">Записаться на приём</button>
        </form>
        </div>
    </section>

    <section class="section">
        <h2 class="section__title">Список записей</h2>
        <div class="table-container">
            <table class="schedule">
                <thead>
                    <tr class="schedule__row">
                        <th class="schedule__cell">Пациент</th>
                        <th class="schedule__cell">Телефон</th>
                        <th class="schedule__cell">Врач</th>
                        <th class="schedule__cell">Дата визита</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($appointments as $app): ?>
                        <tr class="schedule__row">
                            <td class="schedule__cell"><?= htmlspecialchars($app['patient_name']) ?></td>
                            <td class="schedule__cell"><?= htmlspecialchars($app['phone']) ?></td>
                            <td class="schedule__cell"><?= htmlspecialchars($app['doctor_name']) ?></td>
                            <td class="schedule__cell"><?= date('d.m.Y', strtotime($app['visit_date'])) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if ($appointments->rowCount() === 0): ?>
                        <tr class="schedule__row">
                            <td class="schedule__cell" colspan="4">Записей пока нет</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </section>
</main>

<script src="js/validation.js"></script>

<?php require __DIR__ . '/templates/footer.php'; ?>