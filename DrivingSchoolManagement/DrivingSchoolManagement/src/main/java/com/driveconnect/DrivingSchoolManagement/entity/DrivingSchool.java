package com.driveconnect.DrivingSchoolManagement.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DrivingSchool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="DsID")
    private int dsID;

    @Column(name="SchoolName")
    private String schoolName;

    @Column(name="DS_LicenseNo")
    private String dsLicenseNo;

    @Column(name="Established_Year")
    private int estYear;

    @Column(name="PhoneNo")
    private String phoneNo;

    @Column(name="Description")
    private String description;

    @Column(name="ManagerName")
    private String manager;

    @Column(name="DirectPhone")
    private String directPhone;

    @Column(name="S_Address")
    private String address;

    @Column(name="City")
    private String city;

    @Column(name="State")
    private String state;

    @Column(name="P_Code")
    private int code;

    @Enumerated(EnumType.STRING)
    @Column(name="Trans_Offer")
    private Trans_Offer transmission;

    public enum Trans_Offer{
        Auto,
        Manual,
        Both
    }

    @Enumerated(EnumType.STRING)
    @Column(name="Operation_Time")
    private Operation_Time time;

    public enum Operation_Time{
        Weekday,
        Weekend,
        Both,
        Flex
    }

    @Column(name="InsuranceName")
    private String insName;

    @Column(name="InsuranceNo")
    private String insNo;

    @OneToOne
    @JoinColumn(name="loginID")
    private Login login;

}
