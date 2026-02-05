document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    
    if (!form) return;

    const patientName = document.getElementById('patientName');
    const patientPhone = document.getElementById('patientPhone');
    const doctorSelect = document.getElementById('doctorSelect');
    const visitDate = document.getElementById('visitDate');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const doctorError = document.getElementById('doctorError');
    const dateError = document.getElementById('dateError');

    patientPhone.addEventListener('input', function(e) {
        let value = patientPhone.value.replace(/\D/g, '');
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        
        let formattedValue = '+7 ';
        if (value.length > 0) {
            formattedValue += '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formattedValue += '-' + value.substring(8, 10);
        }
        
        patientPhone.value = formattedValue;
    });

    form.addEventListener('submit', function(event) {
        let isValid = true;

        [nameError, phoneError, doctorError, dateError].forEach(el => el.textContent = '');
        [patientName, patientPhone, doctorSelect, visitDate].forEach(el => el.classList.remove('form__input--invalid'));

        const nameVal = patientName.value.trim();
        if (nameVal.split(' ').length < 2) {
            nameError.textContent = 'Введите полное имя (ФИО)';
            patientName.classList.add('form__input--invalid');
            isValid = false;
        }

        const digits = patientPhone.value.replace(/\D/g, '');
        if (digits.length < 11) {
            phoneError.textContent = 'Введите номер телефона полностью';
            patientPhone.classList.add('form__input--invalid');
            isValid = false;
        }

        if (!doctorSelect.value) {
            doctorError.textContent = 'Выберите врача из списка';
            doctorSelect.classList.add('form__input--invalid');
            isValid = false;
        }

        const selectedDate = new Date(visitDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!visitDate.value) {
            dateError.textContent = 'Выберите дату визита';
            visitDate.classList.add('form__input--invalid');
            isValid = false;
        } else if (selectedDate < today) {
            dateError.textContent = 'Дата не может быть в прошлом';
            visitDate.classList.add('form__input--invalid');
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    patientName.addEventListener('input', () => {
        nameError.textContent = '';
        patientName.classList.remove('form__input--invalid');
    });
    
    patientPhone.addEventListener('input', () => {
        phoneError.textContent = '';
        patientPhone.classList.remove('form__input--invalid');
    });
});
