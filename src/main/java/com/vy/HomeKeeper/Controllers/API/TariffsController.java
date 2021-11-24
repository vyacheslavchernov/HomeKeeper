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
    public Tariffs getByDate(@RequestParam Long year, @RequestParam Long month) {
        Long halfOfYear = month <= 6L ? 1L : 2L;
        return tariffsRepo.findByYearAndHalfOfYear(year, halfOfYear);
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
