package com.vy.HomeKeeper.Repo;

import com.vy.HomeKeeper.Domain.Tariffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TariffsRepo extends JpaRepository<Tariffs, String> {
    Tariffs findByYearAndHalfOfYear(Long year, Long halfOfYear);
}
