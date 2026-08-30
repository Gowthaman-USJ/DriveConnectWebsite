package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VehID")
    private int vehID;

    @Column(name = "VehNo")
    private String vehNo;

    @Column(name = "Brand")
    private String brand;

    @Column(name = "Model")
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(name="FuelType")
    private FuelType fuelType;

    public enum FuelType{
        Petrol,
        Diesel,
        Hybrid,
        Electric
    }

    @Enumerated(EnumType.STRING)
    @Column(name="Transmission")
    private Transmission transmission;

    public enum Transmission{
        Automatic,
        Manual,
    }

    @Enumerated(EnumType.STRING)
    @Column(name="Status")
    private Status status;

    public enum Status{
        Available,
        InLesson,
        Maintenance

    }
    @Column(name = "Mileage")
    private int mileage;

    @Column(name = "Make_Year")
    private int makeYear;

    @Column(name = "Remarks")
    private String remarks;

    @ManyToOne
    @JoinColumn(name="dsID")
    private DrivingSchool drivingSchool;

}
