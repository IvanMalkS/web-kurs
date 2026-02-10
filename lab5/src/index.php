<?php
require __DIR__ . '/templates/header.php';
require __DIR__ . '/templates/nav.php';

$lat = 58.01;
$lon = 56.25;

$apiUrl = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure&timezone=auto";

$weatherData = null;
$error = null;

try {
    $response = file_get_contents($apiUrl);
    if ($response === false) {
        throw new Exception("Не удалось получить данные из API.");
    }
    $weatherData = json_decode($response, true);
} catch (Exception $e) {
    $error = $e->getMessage();
}

$rows = [];
if ($weatherData && isset($weatherData['hourly'])) {
    $hourly = $weatherData['hourly'];
    $count = count($hourly['time']);
    
    $limit = min($count, 48); 
    
    for ($i = 0; $i < $limit; $i++) {
        $rows[] = [
            'time' => date('d.m H:i', strtotime($hourly['time'][$i])),
            'temp' => $hourly['temperature_2m'][$i] . '°C',
            'humidity' => $hourly['relative_humidity_2m'][$i] . '%',
            'wind' => $hourly['wind_speed_10m'][$i] . ' км/ч',
            'precip' => $hourly['precipitation'][$i] . ' мм',
            'pressure' => round($hourly['surface_pressure'][$i] * 0.750062, 1) . ' мм рт. ст.'
        ];
    }
}
?>

<main class="main">
    <section class="section">
        <h1 class="section__title">Прогноз погоды (API)</h1>
        <p class="section__subtitle">Данные получены в реальном времени через Open-Meteo API для г. Пермь.</p>

        <?php if ($error): ?>
            <div class="error-message">
                <strong>Ошибка:</strong> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <div class="table-container">
            <table class="schedule">
                <thead>
                    <tr>
                        <th>Дата и время</th>
                        <th>Температура</th>
                        <th>Влажность</th>
                        <th>Ветер</th>
                        <th>Осадки</th>
                        <th>Давление</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($rows)): ?>
                        <tr><td colspan="6" class="table__no-data">Нет данных для отображения</td></tr>
                    <?php else: ?>
                        <?php foreach ($rows as $index => $row): ?>
                            <tr>
                                <td><?= $row['time'] ?></td>
                                <td class="temp-cell table__cell" style="text-align: center;"><?= $row['temp'] ?></td>
                                <td class="table__cell" style="text-align: center;"><?= $row['humidity'] ?></td>
                                <td class="table__cell" style="text-align: center;"><?= $row['wind'] ?></td>
                                <td class="table__cell" style="text-align: center;"><?= $row['precip'] ?></td>
                                <td class="table__cell" style="text-align: center;"><?= $row['pressure'] ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </section>
</main>

<?php require __DIR__ . '/templates/footer.php'; ?>
