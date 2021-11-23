package com.vy.HomeKeeper;

import com.vy.HomeKeeper.Domain.MonthCalculation;
import com.vy.HomeKeeper.Domain.MonthData;
import com.vy.HomeKeeper.Repo.MonthDataRepo;

public class Utils {


    public static class Calculator {
        public static MonthCalculation calculate(MonthData currentMonthData, MonthDataRepo monthDataRepo) {
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

            MonthCalculation monthCalculation = new MonthCalculation();

            // TODO: Тарифы из БД
            monthCalculation.setColdwater((currentMonthData.getColdwater() - prevMonthData.getColdwater()) * 20.35);
            monthCalculation.setHotwater((currentMonthData.getHotwater() - prevMonthData.getHotwater()) * 117.90);
            monthCalculation.setDrainage(((currentMonthData.getColdwater() - prevMonthData.getColdwater()) + (currentMonthData.getHotwater() - prevMonthData.getHotwater())) * 15.77);
            monthCalculation.setElectricity((currentMonthData.getElectricity() - prevMonthData.getElectricity()) * 2.93);

            return monthCalculation;
        }
    }
}
