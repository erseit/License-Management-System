package orm.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.transaction.Transactional;

import orm.model.*;

@ApplicationScoped
public class CompanyDao {

    @Inject
    EntityManager em;

	@Inject
    UserDao userDao;

	@Inject
    ContractDao comDao;

	public Company getCompany(Long id) {
		return em.find(Company.class, id);
	}
	
	@Transactional
	public List<Company> getCompanies(String token) {
		User template = new User();
		try {
			template =  (User) em.createQuery("SELECT u FROM User u WHERE u.token=:token")
					.setParameter("token", token).getSingleResult();
		} catch(NoResultException e) {
			template.setRole("");
		}
		if(	template.getRole().equalsIgnoreCase("adminSystem")) {
			Query q = em.createQuery("SELECT c FROM Company c");
			@SuppressWarnings("unchecked")
			List<Company> companies = q.getResultList();
			return companies;
		} else {
			return new ArrayList<>();
		}
	}

	@Transactional
	public HashMap<String, List<User>> getCompaniesWithUsers(String token) {
		User template = new User();
		try {
			template =  (User) em.createQuery("SELECT u FROM User u WHERE u.token=:token")
					.setParameter("token", token).getSingleResult();
		} catch(NoResultException e) {
			template.setRole("");
		}
		if(	template.getRole().equalsIgnoreCase("adminSystem")) {
			Query q = em.createQuery("SELECT c FROM Company c WHERE c.id >= 10");
			@SuppressWarnings("unchecked")
			List<Company> companies = q.getResultList();
			HashMap<String, List<User>> companiesWithUsers = new HashMap<>();

			for(int i = 0; i < companies.size(); i++) {
				String companyName = companies.get(i).getCompanyname();
				List<User> users = userDao.getOnlyUsers(companies.get(i).getId());
				companiesWithUsers.put(companyName, users);
			}
			return companiesWithUsers;
		} else {
			return new HashMap<>();
		}
	}

	@Transactional
	public HashMap<String, List<Contract>> getCompaniesWithContracts(String token) {
		User template = new User();
		try {
			template =  (User) em.createQuery("SELECT u FROM User u WHERE u.token=:token")
					.setParameter("token", token).getSingleResult();
		} catch(NoResultException e) {
			template.setRole("");
		}
		if(	template.getRole().equalsIgnoreCase("adminSystem")) {
			Query q = em.createQuery("SELECT c FROM Company c WHERE c.id >= 10");
			@SuppressWarnings("unchecked")
			List<Company> companies = q.getResultList();
			HashMap<String, List<Contract>> companiesWithContracts = new HashMap<>();

			for(int i = 0; i < companies.size(); i++) {
				String companyName = companies.get(i).getCompanyname();
				List<Contract> contracts = comDao.getOnlyContracts(companies.get(i).getId());
				companiesWithContracts.put(companyName, contracts);
			}
			return companiesWithContracts;
		} else {
			return new HashMap<>();
		}
	}

    @Transactional
    public String save(Company company) {
		Company template = new Company();
		try{
			Query q =  em.createQuery("SELECT c FROM Company c WHERE c.companyname=:name AND c.address=:address")
					.setParameter("name", company.getCompanyname())
					.setParameter("address", company.getAdress());
			template = (Company) q.getSingleResult();
			if(template.getId() != null && !template.getId().equals(company.getId())) {
				return "Bad Request";
			}
		}catch(NoResultException e) {
			template.setId(0L);
		}
		if(template.getId() == 0) {
			try {
				if (company.getId() != null)  {
					em.merge(company);
				} else {
					em.persist(company);
				}
			} catch(PersistenceException e) {
				return "Persistence Exception";
			}
		} else {
			try{
				em.merge(company);
			} catch(PersistenceException ep) {
				return "Persistence Exception";
			}
		}
		return "Saved";
    }
	
	@Transactional
	public String deleteCompany(Long id) {
		try {
			Query delF = em.createQuery("DELETE User u WHERE companyID IN(:companyID)")
			.setParameter("companyID", id);
    	    delF.executeUpdate();

			Query delS = em.createQuery("DELETE Contract c WHERE companyID IN(:companyID)")
			.setParameter("companyID", id);
    	    delS.executeUpdate();

			Company cm = em.find(Company.class, id);
			if (cm != null) {
				em.remove(cm);
			}
		}catch(IllegalStateException e) {
			return "Illegal State Exception";
		}
		return "Deleted";
	}
}
