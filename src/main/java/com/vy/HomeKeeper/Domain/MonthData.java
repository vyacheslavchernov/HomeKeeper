package com.vy.HomeKeeper.Domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Модель данных для данных за месяц
 */
@Entity
@Table
@ToString(of = {"id"})
@EqualsAndHashCode(of = {"id"})
public class MonthData {
    @Id
    @JsonProperty("id")
    private String id; // MM+YYYY -> 06 2020 = 062020

    @JsonProperty("year")
    private Long year;

    @JsonProperty("month")
    private Long month;

    @JsonProperty("hotwater")
    private Long hotwater;

    @JsonProperty("coldwater")
    private Long coldwater;

    @JsonProperty("electricity")
    private Long electricity;

    @JsonProperty("rent")
    private double rent;

    @JsonProperty("ethernet")
    private double ethernet;

    @JsonProperty("peoples")
    private Long peoples;

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

    public Long getMonth() {
        return month;
    }

    public void setMonth(Long month) {
        this.month = month;
    }

    public Long getHotwater() {
        return hotwater;
    }

    public void setHotwater(Long hotwater) {
        this.hotwater = hotwater;
    }

    public Long getColdwater() {
        return coldwater;
    }

    public void setColdwater(Long coldwater) {
        this.coldwater = coldwater;
    }

    public Long getElectricity() {
        return electricity;
    }

    public void setElectricity(Long electricity) {
        this.electricity = electricity;
    }

    public double getRent() {
        return rent;
    }

    public void setRent(double rent) {
        this.rent = rent;
    }

    public double getEthernet() {
        return ethernet;
    }

    public void setEthernet(double ethernet) {
        this.ethernet = ethernet;
    }

    public Long getPeoples() {
        return peoples;
    }

    public void setPeoples(Long peoples) {
        this.peoples = peoples;
    }
}
