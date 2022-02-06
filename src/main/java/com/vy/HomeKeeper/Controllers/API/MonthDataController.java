package com.vy.HomeKeeper.Controllers.API;

import com.fasterxml.jackson.annotation.JsonView;
import com.vy.HomeKeeper.Domain.MonthCalculation;
import com.vy.HomeKeeper.Domain.MonthData;
import com.vy.HomeKeeper.Domain.Views;
import com.vy.HomeKeeper.Repo.MonthDataRepo;
import com.vy.HomeKeeper.Repo.TariffsRepo;
import com.vy.HomeKeeper.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер отвечающий за получение, добавление, удаление данных о месяце
 */
@RestController
public class MonthDataController {

    private final MonthDataRepo monthDataRepo;
    private final TariffsRepo tariffsRepo;

    @Autowired
    public MonthDataController(MonthDataRepo monthDataRepo, TariffsRepo tariffsRepo) {
        this.monthDataRepo = monthDataRepo;
        this.tariffsRepo = tariffsRepo;
    }

    /**
     * Добавление данных о новом месяце
     *
     * @param monthData Данные для добавления в БД
     * @return Добавленный объект при успехе
     */
    @PostMapping("api/monthdata/add")
    public MonthData addMonthData(@RequestBody MonthData monthData) {
        return monthDataRepo.save(monthData);
    }

    /**
     * Получение самого свежего месяца
     *
     * @return Данные месяце или null TODO: Оптимизировать поиск последнего месяца
     */
    @GetMapping("api/monthdata/getlast")
    public MonthData lastMonthData() {
        List<MonthData> monthDataList = monthDataRepo.findAll();

        Long maxYear = 0L;

        for (MonthData data : monthDataList) {
            if (data.getYear() > maxYear) {
                maxYear = data.getYear();
            }
        }

        MonthData lastData = null;

        for (MonthData data : monthDataList) {
            if (data.getYear().equals(maxYear)) {
                if (lastData != null) {
                    if (lastData.getMonth() < data.getMonth()) {
                        lastData = data;
                    }
                } else {
                    lastData = data;
                }
            }
        }

        return lastData;
    }

    /**
     * Поиск месяца по id
     *
     * @param id id искомого месяца
     * @return данные о месяце или null
     */
    @GetMapping("api/monthdata/get")
    public MonthData getMonthData(@RequestParam String id) {
        return monthDataRepo.findById(id).orElse(null);

    }

    /**
     * Получить данные за все доступные месяца
     *
     * @return Массив всех доступных данных TODO: Реализовать порционную выдачу и динамическую подгрузку на фронте
     */
    @GetMapping("api/monthdata/all")
    public List<MonthData> getMonthData() {
        return monthDataRepo.findAll();

    }

    /**
     * Получить все ID месяцев из БД
     *
     * @return Список ID всех месяцев из БД
     */
    @GetMapping("api/monthdata/allId")
    @JsonView(Views.onlyId.class)
    public List<MonthData> getMonthDataId() {
        return monthDataRepo.findAll();
    }

    /**
     * Получение рассчитанных значений по данным за месяц
     *
     * @param id id месяца для расчёта
     * @return рассчитанные значения или null
     */
    @GetMapping("api/monthdata/getCalc")
    public MonthCalculation getMonthCalc(@RequestParam String id) {
        // TODO: Перенести все расчёты с фронта на бэк - общие суммы и т.д.
        return Utils.Calculator.calculate(monthDataRepo.getById(id), monthDataRepo, tariffsRepo);
    }

    /**
     * Получение данных за предыдущий месяца от указанного
     *
     * @param id id месяца от которого идёт поиск
     * @return данные за месяц или null
     */
    @GetMapping("api/monthdata/getPrev")
    public MonthData getPrevMonthData(@RequestParam String id) {
        MonthData currentMonthData = monthDataRepo.getById(id);
        Long currentYear = currentMonthData.getYear();
        Long currentMonth = currentMonthData.getMonth();
        Long prevYear = currentYear;
        Long prevMonth = currentMonthData.getMonth() - 1;

        if (currentMonth.equals(1L)) {
            prevYear -= 1L;
            prevMonth = 12L;
        }

        String prevMonthStr = prevMonth < 10 ? "0" + prevMonth.toString() : prevMonth.toString();

        return monthDataRepo.findById(
                prevYear.toString() + prevMonthStr
        ).orElse(null);
    }
}
