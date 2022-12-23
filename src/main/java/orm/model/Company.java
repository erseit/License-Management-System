package orm.model;

import java.io.Serializable;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "Tcompany")
public class Company implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
    @Id
    @SequenceGenerator(name = "tcompanySeq", sequenceName = "ZSEQ_TCOMPANY_ID", allocationSize = 1, initialValue = 10)
    @GeneratedValue(generator = "tcompanySeq")
    
    @Column(name = "ID")
    private Long id;

    @Basic(optional=false)
    @Column(name = "companyname", length=64)
    private String companyname;
      
    @Basic(optional=false)
    @Column(name = "address", length=64)
    private String address;
    
    @Basic(optional=true)
    @Column(name = "addressDetails", length=64)
    private String addressDetails;
    
	public Company() {
	}

	public Company(String name, String address, String addressDetails) {
		this.companyname = name;
		this.address = address;
		this.addressDetails = addressDetails;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCompanyname() {
		return this.companyname;
	}

	public void setCompanyname(String name) {
		this.companyname = name;
	}
	

	public String getAdress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	public String getAdressDetails() {
		return this.addressDetails;
	}

	public void setAddressDetails(String addressDetails) {
		this.addressDetails = addressDetails;
	}
	
}