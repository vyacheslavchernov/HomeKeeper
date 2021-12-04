package com.vy.HomeKeeper.Domain;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Модель данных для расчёта за месяц
 */
public class MonthCalculation {
    @JsonProperty("hotwater")
    private double hotwater;

    @JsonProperty("coldwater")
    private double coldwater;

    @JsonProperty("electricity")
    private double electricity;

    @JsonProperty("drainage")
    private double drainage;

    public double getHotwater() {
        return hotwater;
    }

    public void setHotwater(double hotwater) {
        this.hotwater = hotwater;
    }

    public double getColdwater() {
        return coldwater;
    }

    public void setColdwater(double coldwater) {
        this.coldwater = coldwater;
    }

    public double getElectricity() {
        return electricity;
    }

    public void setElectricity(double electricity) {
        this.electricity = electricity;
    }

    public double getDrainage() {
        return drainage;
    }

    public void setDrainage(double drainage) {
        this.drainage = drainage;
    }
}
