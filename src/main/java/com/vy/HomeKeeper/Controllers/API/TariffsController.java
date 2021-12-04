package com.vy.HomeKeeper.Controllers.API;

import com.vy.HomeKeeper.Domain.Tariffs;
import com.vy.HomeKeeper.Repo.TariffsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контроллер отвечающий за обработку коммунальных тарифов
 */
@RestController
public class TariffsController {

    private final TariffsRepo tariffsRepo;

    @Autowired
    public TariffsController(TariffsRepo tariffsRepo) {
        this.tariffsRepo = tariffsRepo;
    }

    /**
     * Получение тарифов по id
     *
     * @param id id тарифов
     * @return тарифы или null
     */
    @GetMapping("api/tariffs/getById")
    public Tariffs getById(@RequestParam String id) {
        return tariffsRepo.findById(id).orElse(null);
    }

    /**
     * Получение тарифов по дате
     *
     * @param year искомый год
     * @param month искомый месяц
     * @return тарифы на указанную дату или (?) TODO: Уточнить этот вопрос. Что возвращается
     */
    @GetMapping("api/tariffs/getByDate")
    public Tariffs getByDate(@RequestParam Long year, @RequestParam Long month) {
        Long halfOfYear = month <= 6L ? 1L : 2L;
        return tariffsRepo.findByYearAndHalfOfYear(year, halfOfYear);
    }

    /**
     * Получение всех имеющихся в БД тарифов
     *
     * @return массив тарифов
     */
    @GetMapping("api/tariffs/getall")
    public List<Tariffs> getAll() {
        return tariffsRepo.findAll();
    }

    /**
     * Добавление тарифов
     *
     * @param tariffs данные для добавления в БД
     * @return добавленный объект
     */
        @PostMapping("api/tariffs/add")
    public Tariffs addNew(@RequestBody Tariffs tariffs) {
        return tariffsRepo.save(tariffs);
    }
}
