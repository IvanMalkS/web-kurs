<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';
?>

<main class="main">
    <section class="section">
        <h2 class="section__title">Расписание работы</h2>
        <div class="table-container">
            <table class="schedule">
                <thead>
                    <tr class="schedule__row">
                        <th class="schedule__cell">Врач</th>
                        <th class="schedule__cell">Специальность</th>
                        <th class="schedule__cell">Будни</th>
                        <th class="schedule__cell">Суббота</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="schedule__row">
                        <td class="schedule__cell">Иванова И.И.</td>
                        <td class="schedule__cell">Терапевт</td>
                        <td class="schedule__cell">09:00–17:00</td>
                        <td class="schedule__cell">09:00–13:00</td>
                    </tr>
                    <tr class="schedule__row">
                        <td class="schedule__cell">Петрова А.В.</td>
                        <td class="schedule__cell">Кардиолог</td>
                        <td class="schedule__cell">10:00–18:00</td>
                        <td class="schedule__cell">—</td>
                    </tr>
                    <tr class="schedule__row">
                        <td class="schedule__cell">Сидорова Д.М.</td>
                        <td class="schedule__cell">Невролог</td>
                        <td class="schedule__cell">08:00–16:00</td>
                        <td class="schedule__cell">10:00–14:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</main>

<?php require __DIR__ . '/templates/footer.php'; ?>
