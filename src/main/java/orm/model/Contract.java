package orm.model;

import java.io.Serializable;
import java.util.Random;
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
@Table(name = "Tcontract")
public class Contract implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
    @Id
    @SequenceGenerator(name = "tcontractSeq", sequenceName = "ZSEQ_TCONTRACT_ID", allocationSize = 1, initialValue = 10)
    @GeneratedValue(generator = "tcontractSeq")
    
    @Column(name = "ID")
    private Long id;

	@Basic(optional=false)
    @Column(name = "startDate", length=64)
    private String startDate;
    
    @Basic(optional=false)
    @Column(name = "endDate", length=64)
    private String endDate;

	@Basic(optional=false)
    @Column(name = "version", length=64)
    private String version;

	@Basic(optional=false)
    @Column(name = "responsable", length=64)
    private String responsable;

	@Basic(optional=true)
    @Column(name = "secondResponsable", length=64)
    private String secondResponsable;

	@Basic(optional=false)
    @Column(name = "firstIP", length=64)
    private String firstIP;

	@Basic(optional=false)
    @Column(name = "secondIP", length=64)
    private String secondIP;

	@Basic(optional=false)
    @Column(name = "ipSechs", length=64)
    private String ipSechs;

	@Basic(optional=true)
    @Column(name = "port", length=64)
    private int port;

	@Basic(optional=true)
    @Column(name = "issuerID", length=64)
    private int issuerID;

	@Basic(optional=true)
    @Column(name = "serialNo", length=64)
    private int serialNo;

	@Basic(optional=true)
    @Column(name = "keyToken", length=255)
    private String keyToken;

	@Basic(optional=false)
    @Column(name = "companyID", length=64)
    private Long companyID;

	@Basic(optional=true)
    @Column(name = "userID", length=64)
    private Long userID;

	@Basic(optional=true)
    @Column(name = "secondUserID", length=64)
    private Long secondUserID;

	@Transient
	private List<String> allUsers;

	public Contract() {
		this.version = "1.0.1";
		this.keyToken = this.generateKey();
		this.allUsers = new ArrayList<>();
	}

	public Contract(String startDate, String endDate,String responsable, String secondResponsable, String firstIP,
					String secondIp, String ipSechs, int port, int issuerID, int serialNo, Long companyID, Long userID, Long secondUserID,List<String>allUsers) {
		this.startDate= startDate;
		this.endDate = endDate;
		this.version = "1.0.1";
		this.responsable = responsable;
		this.secondResponsable = secondResponsable;
		this.firstIP = firstIP;
		this.secondIP = secondIp;
		this.ipSechs = ipSechs;
		this.port = port;
		this.issuerID = issuerID;
		this.serialNo = serialNo;
		this.keyToken = this.generateKey();
		this.companyID = companyID;
		this.userID = userID;
		this.secondUserID = secondUserID;
		this.allUsers = allUsers;
	}

	public String generateKey() {
		int lowerLimit = 43;
		int upperLimit = 122;
		Random random = new Random();
		StringBuffer r = new StringBuffer(255);
		for (int i = 0; i < 255; i++) {
			int n = lowerLimit + (int)(random.nextFloat() * (upperLimit-lowerLimit + 1));
			if((n==43) || (n>=47 && n<=57) || (n >=65 && n<=90) || (n>=97 && n<=122)) r.append((char)n);
		}
		return r.toString();
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStartDate() {
		return this.startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return this.endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getVersion() {
		return this.version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getResponsable() {
		return this.responsable;
	}

	public void setResponsable(String responsable) {
		this.responsable = responsable;
	}

	public String getSecondResponsable() {
		return this.secondResponsable;
	}

	public void setSecondResponsable(String secondResponsable) {
		this.secondResponsable = secondResponsable;
	}

	public String getFirstIP() {
		return this.firstIP;
	}

	public void setFirstIP(String ip) {
		this.firstIP = ip;
	}

	public String getSecondIP() {
		return this.secondIP;
	}

	public void setSecondIP(String ip) {
		this.secondIP = ip;
	}

	public String getIpSechs() {
		return this.ipSechs;
	}

	public void setIpSechs(String ip) {
		this.ipSechs = ip;
	}

	public int getPort() {
		return this.port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public int getIssuerID() {
		return this.issuerID;
	}

	public void setIssuerID(int id) {
		this.issuerID = id;
	}


	public int getSerialNo() {
		return this.serialNo;
	}

	public void setSerialNo(int feature) {
		this.serialNo = feature;
	}

	public String getKeyToken() {
		return this.keyToken;
	}

	public void setKeyToken(String keyToken) {
		this.keyToken = keyToken;
	}

	public Long getCompanyID() {
		return this.companyID;
	}

	public void setCompanyID(Long id) {
		this.companyID = id;
	}

	public Long getUserID() {
		return this.userID;
	}

	public void setUserID(Long id) {
		this.userID = id;
	}

	public Long getUserIDSecond() {
		return this.secondUserID;
	}

	public void setUserIDSecond(Long id) {
		this.secondUserID = id;
	}

	public List<String> getAllUsers() {
		return this.allUsers;
	}

	public void setAllUsers(List<String> list) {
		this.allUsers = list;
	}
}

