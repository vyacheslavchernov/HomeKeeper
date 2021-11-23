package com.vy.HomeKeeper.Repo;

import com.vy.HomeKeeper.Domain.MonthData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthDataRepo extends JpaRepository<MonthData, String> {
}
