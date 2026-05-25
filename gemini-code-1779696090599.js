function calculate() {
    const MRP = 4325; // МРП 2026
    const CUSTOMS_FEE = 6 * MRP; // 25 950 ₸ согласно скрину и ЕЭК
    const NDS_RATE = 0.12;
    const USD_RATE = 475.20; // Твой курс доллара

    const inputPriceUsd = parseFloat(document.getElementById('carPrice').value) || 0;
    const carAge = document.getElementById('carAge').value; // 'new', 'mid', 'old'
    const engineVolume = parseFloat(document.getElementById('engineVolume').value) || 0;
    const engineType = document.getElementById('engineType').value;

    const carPriceKzt = inputPriceUsd * USD_RATE;

    // 1. Пошлина 15%
    let customsDuty = (engineType === 'bev') ? 0 : carPriceKzt * 0.15;

    // 2. Акциз
    let accise = (engineType !== 'bev' && engineVolume > 3000) ? engineVolume * 100 : 0;

    // 3. НДС (По точной формуле твоего калькулятора)
    let nds = (carPriceKzt + customsDuty) * NDS_RATE; 

    // 4. Утилизационный сбор с учетом возраста авто!
    let utilFee = 0;
    if (engineType !== 'bev') {
        let coef = 0;
        if (engineVolume <= 1000) coef = 1.5;
        else if (engineVolume > 1000 && engineVolume <= 2000) coef = 3.5;
        else if (engineVolume > 2000 && engineVolume <= 3000) coef = 5.0;
        else if (engineVolume > 3000) coef = 11.5;

        // Если машине старше 3 лет (Б/У), коэффициент удваивается (Закон РК)
        if (carAge === 'old') {
            coef = coef * 2; 
        }
        utilFee = (50 * MRP) * coef;
    }

    // 5. Первичная регистрация
    let regFee = 0;
    if (carAge === 'new') regFee = 0.25 * MRP;
    else if (carAge === 'mid') regFee = 50 * MRP;
    else if (carAge === 'old') regFee = 500 * MRP;

    // Допы
    let logisticsTotal = 0;
    if (document.getElementById('checkBroker').checked) logisticsTotal += 80000;
    if (document.getElementById('checkSbkts').checked) logisticsTotal += 50000; // на скрине 50к
    if (document.getElementById('checkDelivery').checked) logisticsTotal += 60000;

    // Считаем суммы
    const totalTaxesOnly = customsDuty + CUSTOMS_FEE + accise + nds + utilFee + regFee;
    const finalTotalKzt = carPriceKzt + totalTaxesOnly + logisticsTotal;
    const finalTotalUsd = finalTotalKzt / USD_RATE;

    // Вывод на экран
    document.getElementById('totalPriceKzt').innerText = Math.round(finalTotalKzt).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('totalPriceUsd').innerText = '≈ ' + Math.round(finalTotalUsd).toLocaleString('ru-RU') + ' USD';
    document.getElementById('outCarKzt').innerText = Math.round(carPriceKzt).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outCustomsFee').innerText = Math.round(CUSTOMS_FEE).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outCustomsDuty').innerText = Math.round(customsDuty).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outAccise').innerText = Math.round(accise).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outNds').innerText = Math.round(nds).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outUtil').innerText = Math.round(utilFee).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outReg').innerText = Math.round(regFee).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outLogistics').innerText = Math.round(logisticsTotal).toLocaleString('ru-RU') + ' ₸';
    document.getElementById('outTotalTaxesOnly').innerText = Math.round(totalTaxesOnly).toLocaleString('ru-RU') + ' ₸';
}