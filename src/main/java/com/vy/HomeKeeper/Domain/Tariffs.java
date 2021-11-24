package com.vy.HomeKeeper.Domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
@ToString(of = {"id"})
@EqualsAndHashCode(of = {"id"})
public class Tariffs {
    @Id
    @JsonProperty("id")
    private String id; // YYYY+MM -> 2020 6 = 202006

    @JsonProperty("year")
    private Long year;

    @JsonProperty("halffOfYear")
    private Long halfOfYear;

    @JsonProperty("hotwater")
    private double hotwater;

    @JsonProperty("coldwater")
    private double coldwater;

    @JsonProperty("electricity")
    private double electricity;

    @JsonProperty("drainage")
    private double drainage;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public Long getHalfOfYear() {
        return halfOfYear;
    }

    public void setHalfOfYear(Long halfOfYear) {
        this.halfOfYear = halfOfYear;
    }

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
