package orm.dao;

import java.util.List;
import java.util.ArrayList;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.transaction.Transactional;
import org.jboss.logging.Logger;

import orm.model.*;

@ApplicationScoped
public class UserDao {

    @Inject
    EntityManager em;
	
	private static final Logger LOGGER = Logger.getLogger(UserDao.class);
	
	public User getUser(String token) {
		Query qF = em.createQuery("SELECT u FROM User u WHERE u.token=:token").setParameter("token", token);
		User user = (User) qF.getSingleResult();

		Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID", user.getCompanyID());
		@SuppressWarnings("unchecked")
		List <Contract> contracts = qS.getResultList();

		for(int j = 0; j < contracts.size(); j++){
			if(user.getId().equals(contracts.get(j).getUserID()) || user.getId().equals(contracts.get(j).getUserIDSecond())) {
				user.getAllContracts().add(contracts.get(j));
			}			
		}
		return user;
	}
	
	public User login(String username, String password) {
		User template = new User();
		try {
			LOGGER.debug("Checking for user name and password");
			template = (User) em.createQuery("SELECT u FROM User u WHERE u.username=:username AND "
					+ "u.password=:password")
					.setParameter("username", username)
					.setParameter("password", password).getSingleResult();
			template.setPassword("");
			template.setUsername("");
			return template;
		} catch(NoResultException e) {
			User u = new User();
			u.setId(0L);
			return u;
		}
	}

	public List<User> getUsers(Long id) {
		try {
			Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID", id);
			@SuppressWarnings("unchecked")
			List<User> users = qF.getResultList();

			Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID", id);
			@SuppressWarnings("unchecked")
			List <Contract> contracts = qS.getResultList();

			for(int i = 0; i < users.size(); i++) {
				for(int j = 0; j < contracts.size(); j++){
					if(users.get(i).getId().equals(contracts.get(j).getUserID()) || users.get(i).getId().equals(contracts.get(j).getUserIDSecond())) {
						users.get(i).getAllContracts().add(contracts.get(j));
					}			
				}
			}	
			return users;
		} catch(NoResultException e) {
			return new ArrayList<>();
		}	
	}

	public List<User> getOnlyUsers(Long id) {
		try {
			Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID", id);
			@SuppressWarnings("unchecked")
			List<User> users = qF.getResultList();
			return users;
		} catch(NoResultException e) {
			return new ArrayList<>();
		}	
	}

    @Transactional
    public String save(User user) {
		User templateUser = new User();
		try{
			Query q = em.createQuery("SELECT u FROM User u WHERE u.username=:username")
			.setParameter("username", user.getUsername());
			User template = (User) q.getSingleResult();
			templateUser.setId(template.getId());
			} catch(NoResultException e) {
				templateUser.setId(0L);
		}
		if(templateUser.getId() == 0L) {
			try {
				if (user.getId() != null) {
					em.merge(user);
				} else {
				em.persist(user);
				}
			}catch(PersistenceException ep) {
				return "Persistence Exception";
			}
			return "Saved";
		} else {
			if(!templateUser.getId().equals(user.getId())) {
				return "Bad Request";
			} else {
				Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID", user.getCompanyID());
				@SuppressWarnings("unchecked")
				List <Contract> contracts = qS.getResultList();
				String name = user.getFirstname() + " " + user.getLastname();
				for(int i = 0; i < contracts.size(); i++) {
					if(user.getId().equals(contracts.get(i).getUserID())) {
						contracts.get(i).setResponsable(name);
					}
					if(user.getId().equals(contracts.get(i).getUserIDSecond())) {
						contracts.get(i).setSecondResponsable(name);
					}
				}
				em.merge(user);
			}
			return "Saved";
		}			
    }
	
	@Transactional
	public String deleteUser(Long id) {
		try {
			User user = em.find(User.class, id);
			if (user != null) {
				Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID", user.getCompanyID());
				@SuppressWarnings("unchecked")
				List <Contract> contracts = qS.getResultList();
				for(int i = 0; i < contracts.size(); i++) {
					if(user.getId().equals(contracts.get(i).getUserID())) {
						contracts.get(i).setResponsable("");
						contracts.get(i).setUserID(0L);
					}
					if(user.getId().equals(contracts.get(i).getUserIDSecond())) {
						contracts.get(i).setSecondResponsable("");
						contracts.get(i).setUserIDSecond(0L);
					}
				}
				em.remove(user);
			}
		}catch(IllegalStateException e) {
			return "Illegal State Exception";
		}
		return "Deleted";
	}
	
}
