package orm.model;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Tuser")
public class User implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
    @Id
    @SequenceGenerator(name = "tuserSeq", sequenceName = "ZSEQ_TUSER_ID", allocationSize = 1, initialValue = 10)
    @GeneratedValue(generator = "tuserSeq")
    
    @Column(name = "ID")
    private Long id;

    @Basic(optional=false)
    @Column(name = "username", length=64, unique = true)
    private String username;
    
    @Basic(optional=false)
    @Column(name = "password", length=64)
    private String password;
    
    @Basic(optional=false)
    @Column(name = "role", length=64)
    private String role;

	@Basic(optional=false)
    @Column(name = "token", length=64, unique = true)
    private String token;

    @Basic(optional=false)
    @Column(name = "firstname", length=64)
    private String firstname;

    @Basic(optional=false)
    @Column(name = "lastname", length=64)
    private String lastname;

    @Basic(optional=false)
    @Column(name = "email", length=64)
    private String email;

    @Basic(optional=false)
    @Column(name = "phone", length=64)
    private String phone;

    @Basic(optional=false)
    @Column(name = "mobile", length=64)
    private String mobile;

    @Basic(optional=false)
    @Column(name = "companyID", length=64)
    private Long companyID;

    @Transient
	private List<Contract> allContracts;

	public User() {
		this.token = UUID.randomUUID().toString();
        this.allContracts = new ArrayList<>();
	}

	public User(String username, String password, String role,String firstname, String lastname, String email, 
				String phone, String mobile,Long companyID, List<Contract>allContracts) {
		this.username = username;
		this.password = password;
		this.role = role;
		this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.mobile = mobile;
        this.companyID = companyID;
		this.token = UUID.randomUUID().toString();
        this.allContracts = allContracts;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getUsername() {
		return this.username;
	}

	public void setUsername(String name) {
		this.username = name;
	}
	

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getRole() {
		return this.role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getFirstname() {
        return this.firstname;
    }

    public void setFirstname(String name) {
        this.firstname = name;
    }

    public String getLastname() {
        return this.lastname;
    }

    public void setLastname(String name) {
        this.lastname = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMobile() {
        return this.mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Long getCompanyID() {
        return this.companyID;
    }

    public void setCompanyID(Long id) {
        this.companyID = id;
    }

	public String getToken() {
		return this.token;
	}

	public void setToken(String token) {
		this.token = token;
	}

    public List<Contract> getAllContracts() {
		return this.allContracts;
	}

	public void setAllUsers(List<Contract> list) {
		this.allContracts = list;
	}
}