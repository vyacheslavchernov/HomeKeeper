package com.vy.HomeKeeper.Controllers.API;

import com.vy.HomeKeeper.Domain.Tariffs;
import com.vy.HomeKeeper.Repo.TariffsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TariffsController {

    private final TariffsRepo tariffsRepo;

    @Autowired
    public TariffsController(TariffsRepo tariffsRepo) {
        this.tariffsRepo = tariffsRepo;
    }

    @GetMapping("api/tariffs/getById")
    public Tariffs getById(@RequestParam String id) {
        return tariffsRepo.findById(id).orElse(null);
    }

    @GetMapping("api/tariffs/getByDate")
    public Tariffs getByDate(@RequestParam String year, @RequestParam Integer month) {
        int halfOfYear = month <= 6 ? 1 : 2;
        return tariffsRepo.findByYearAndHalfOfYear(year, month.toString());
    }

    @GetMapping("api/tariffs/getall")
    public List<Tariffs> getAll() {
        return tariffsRepo.findAll();
    }

        @PostMapping("api/tariffs/add")
    public Tariffs addNew(@RequestBody Tariffs tariffs) {
        return tariffsRepo.save(tariffs);
    }
}
