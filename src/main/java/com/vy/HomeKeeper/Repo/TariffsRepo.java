package com.vy.HomeKeeper.Repo;

import com.vy.HomeKeeper.Domain.Tariffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TariffsRepo extends JpaRepository<Tariffs, String> {
    @Query("SELECT t FROM Tariffs t WHERE t.year = ?1 AND t.halfOfYear = ?2")
    Tariffs findByYearAndHalfOfYear(String year, String halfOfYear);
}
