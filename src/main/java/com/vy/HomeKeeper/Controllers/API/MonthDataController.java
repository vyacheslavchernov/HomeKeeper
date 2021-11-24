package com.vy.HomeKeeper.Controllers.API;

import com.vy.HomeKeeper.Domain.MonthCalculation;
import com.vy.HomeKeeper.Domain.MonthData;
import com.vy.HomeKeeper.Repo.MonthDataRepo;
import com.vy.HomeKeeper.Repo.TariffsRepo;
import com.vy.HomeKeeper.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MonthDataController {

    private final MonthDataRepo monthDataRepo;
    private final TariffsRepo tariffsRepo;

    @Autowired
    public MonthDataController(MonthDataRepo monthDataRepo, TariffsRepo tariffsRepo) {
        this.monthDataRepo = monthDataRepo;
        this.tariffsRepo = tariffsRepo;
    }

    @PostMapping("api/monthdata/add")
    public boolean addMonthData(@RequestBody MonthData monthData) {
        monthDataRepo.save(monthData);
        return true;
    }

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

    @GetMapping("api/monthdata/get")
    public MonthData getMonthData(@RequestParam String id) {
        return monthDataRepo.findById(id).orElse(null);

    }

    @GetMapping("api/monthdata/all")
    public List<MonthData> getMonthData() {
        return monthDataRepo.findAll();

    }

    @GetMapping("api/monthdata/getCalc")
    public MonthCalculation getMonthCalc(@RequestParam String id) {
        return Utils.Calculator.calculate(monthDataRepo.getById(id), monthDataRepo, tariffsRepo);
    }

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
