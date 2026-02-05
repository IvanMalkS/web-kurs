import requests
from bs4 import BeautifulSoup
import json
import os
import time
import logging

log_dir = os.path.join(os.path.dirname(__file__), '../logs')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'parser.log')

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_file, encoding='utf-8'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def parse_cars():
    url = "https://auto.drom.ru/geely/cityray/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
    }

    results = []

    logger.info(f"Запуск парсинга. Целевой URL: {url}")

    try:
        logger.debug(f"Отправка GET запроса с заголовками: {headers}")
        response = requests.get(url, headers=headers, timeout=15)
        logger.info(f"Ответ от сервера получен. Статус-код: {response.status_code}")
        
        if response.status_code == 200:
            logger.debug("Начало парсинга HTML контента")
            soup = BeautifulSoup(response.text, 'html.parser')
            
            items = soup.find_all('div', {'data-ftid': 'bulls-list_bull'})
            logger.info(f"Найдено потенциальных элементов: {len(items)}")

            if len(items) == 0:
                logger.warning("Элементы не найдены. Пробуем старый селектор...")
                items = soup.find_all('a', {'data-ftid': 'component_cars-list-item'})
                logger.info(f"Найдено элементов по старому селектору: {len(items)}")

            if len(items) == 0:
                logger.warning("Элементы всё еще не найдены. Возможно, сайт вернул капчу или структура сильно изменилась.")
                logger.debug(f"Первые 1000 символов ответа: {response.text[:1000]}")
            
            for i, item in enumerate(items[:12]):
                try:
                    title_link = item.find('a', {'data-ftid': 'bull_title'})
                    if not title_link:
                         title_link = item if item.name == 'a' and item.get('data-ftid') == 'component_cars-list-item' else None
                    
                    title = "N/A"
                    link = "#"
                    if title_link:
                        title_elem = title_link.find('h3') or title_link.find('span')
                        title = title_elem.text.strip() if title_elem else title_link.text.strip()
                        link = title_link.get('href', '#')

                    price_elem = item.find('span', {'data-ftid': 'bull_price'})
                    price = price_elem.text.replace('\xa0', ' ').strip() if price_elem else "N/A"
                    
                    desc_container = item.find('div', {'data-ftid': 'component_inline-bull-description'})
                    if desc_container:
                        desc_items = desc_container.find_all('span', {'data-ftid': 'bull_description-item'})
                        info = ", ".join([d.text.strip().replace('\xa0', ' ') for d in desc_items])
                    else:
                        info = ""

                    img_elem = item.find('img')
                    photo = img_elem.get('src') or img_elem.get('srcset', '').split(' ')[0] if img_elem else ""

                    logger.debug(f"Элемент [{i+1}]: {title} - {price}")
                    
                    results.append({
                        "title": title,
                        "price": price,
                        "description": info,
                        "link": link,
                        "photo": photo
                    })
                except Exception as e:
                    logger.error(f"Ошибка при обработке элемента {i+1}: {e}", exc_info=True)
                    continue
        else:
            logger.error(f"Сервер вернул ошибку: {response.status_code}")
            if response.status_code == 403:
                logger.error("Доступ запрещен (403 Forbidden). Скорее всего, IP заблокирован.")

    except requests.exceptions.Timeout:
        logger.error("Таймаут ожидания ответа от сервера.")
    except Exception as e:
        logger.critical(f"Критическая ошибка при выполнении запроса: {e}", exc_info=True)

    time.sleep(1)
    
    if not results:
        logger.warning("Результаты пусты. Используем демонстрационные данные для отладки.")

    output_path = os.path.join(os.path.dirname(__file__), '../data/results.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=4)
        logger.info(f"Данные успешно сохранены в {output_path}. Количество записей: {len(results)}")
    except Exception as e:
        logger.error(f"Ошибка при сохранении в JSON: {e}")

if __name__ == "__main__":
    parse_cars()
