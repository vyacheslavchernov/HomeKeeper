package com.vy.HomeKeeper;

import com.vy.HomeKeeper.Domain.MonthCalculation;
import com.vy.HomeKeeper.Domain.MonthData;
import com.vy.HomeKeeper.Domain.Tariffs;
import com.vy.HomeKeeper.Repo.MonthDataRepo;
import com.vy.HomeKeeper.Repo.TariffsRepo;

/**
 * Различные операции реализованные через статические объекты и часто используемые фрагменты кода
 */
public class Utils {


    /**
     * Класс для произведения расчётов по месяцу
     */
    public static class Calculator {
        /**
         * Производит расчёт сумм на основе данных за месяц и тарифов
         *
         * @param currentMonthData данные месяца для расчёта
         * @param monthDataRepo репозиторий с данными за месяц
         * @param tariffsRepo репозиторий с данными по тарифам
         * @return рассчитанные данные за месяц или null
         */
        public static MonthCalculation calculate(MonthData currentMonthData, MonthDataRepo monthDataRepo, TariffsRepo tariffsRepo) {
            Long currentYear = currentMonthData.getYear();
            Long currentMonth = currentMonthData.getMonth();
            Long prevYear = currentYear;
            Long prevMonth = currentMonthData.getMonth() - 1;


            if (currentMonth.equals(1L)) {
                prevYear -= 1L;
                prevMonth = 12L;
            }

            String prevMonthStr = prevMonth < 10 ? "0" + prevMonth.toString() : prevMonth.toString();

            MonthData prevMonthData = monthDataRepo.findById(
                    prevYear.toString() + prevMonthStr
            ).orElse(null);

            if (prevMonthData == null)
                return null;


            Tariffs tariffs = tariffsRepo.findByYearAndHalfOfYear(currentYear, currentMonth <= 6L ? 1L : 2L);

            MonthCalculation monthCalculation = new MonthCalculation();

            monthCalculation.setColdwater((currentMonthData.getColdwater() - prevMonthData.getColdwater()) * tariffs.getColdwater());
            monthCalculation.setHotwater((currentMonthData.getHotwater() - prevMonthData.getHotwater()) * tariffs.getHotwater());
            monthCalculation.setDrainage(((currentMonthData.getColdwater() - prevMonthData.getColdwater()) + (currentMonthData.getHotwater() - prevMonthData.getHotwater())) * tariffs.getDrainage());
            monthCalculation.setElectricity((currentMonthData.getElectricity() - prevMonthData.getElectricity()) * tariffs.getElectricity());

            return monthCalculation;
        }
    }
}
