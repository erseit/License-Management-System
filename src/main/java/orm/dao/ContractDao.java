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

import orm.model.*;

@ApplicationScoped
public class ContractDao {

	@Inject
	EntityManager em;

	public Contract getContract(Long id) {
		return em.find(Contract.class, id);
	}

	@Transactional
	public List<Contract> getContracts(Long id) {
		Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID", id);
		@SuppressWarnings("unchecked")
		List<User> allUsers = qF.getResultList();

		Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID",
				id);
		@SuppressWarnings("unchecked")
		List<Contract> contracts = qS.getResultList();
		if (!contracts.isEmpty()) {
			for (int i = 0; i < contracts.size(); i++) {
				for (int j = 0; j < allUsers.size(); j++) {
					String name = allUsers.get(j).getFirstname() + " " + allUsers.get(j).getLastname();
					contracts.get(i).getAllUsers().add(name);
				}
			}
		} else {
			Contract template = new Contract();
			template.setId(0L);
			template.setCompanyID(id);
			contracts.add(template);
			for (int j = 0; j < allUsers.size(); j++) {
				String name = allUsers.get(j).getFirstname() + " " + allUsers.get(j).getLastname();
				contracts.get(0).getAllUsers().add(name);
			}
		}
		return contracts;
	}

	@Transactional
	public List<Contract> getOnlyContracts(Long id) {
		try {
			Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID",
					id);
			@SuppressWarnings("unchecked")
			List<User> allUsers = qF.getResultList();
			Query qS = em.createQuery("SELECT c FROM Contract c WHERE c.companyID=:companyID").setParameter("companyID",
					id);
			@SuppressWarnings("unchecked")
			List<Contract> contracts = qS.getResultList();

			for (int i = 0; i < contracts.size(); i++) {
				for (int j = 0; j < allUsers.size(); j++) {
					String name = allUsers.get(j).getFirstname() + " " + allUsers.get(j).getLastname();
					contracts.get(i).getAllUsers().add(name);
				}
			}
			return contracts;
		} catch (NoResultException e) {
			return new ArrayList<>();

		}
	}

	@Transactional
	public String save(Contract contract) {
		try {
			String nameFirst = contract.getResponsable();
			String nameSecond = contract.getSecondResponsable();
			if (contract.getId() != null) {
				Query q = em.createQuery("SELECT c FROM Contract c WHERE c.id=:contractID").setParameter("contractID",
						contract.getId());
				Contract template = (Contract) q.getSingleResult();

				if (!template.getEndDate().equalsIgnoreCase(contract.getEndDate())
						|| !template.getFirstIP().equalsIgnoreCase(contract.getFirstIP()) ||
						!template.getSecondIP().equalsIgnoreCase(contract.getSecondIP())
						|| !template.getIpSechs().equalsIgnoreCase(contract.getIpSechs())) {
					String version = template.getVersion();
					String[] parts = version.split("\\.");
					int templateVFirst = Integer.parseInt(parts[0]);
					int templateVSecond = Integer.parseInt(parts[1]);
					int templateVThird = Integer.parseInt(parts[2]);
					if (templateVThird != 9) {
						templateVThird = templateVThird + 1;
					} else {
						if (templateVSecond != 9) {
							templateVSecond = templateVSecond + 1;
							templateVThird = 0;
						} else {
							templateVFirst = templateVFirst + 1;
							templateVSecond = 0;
							templateVThird = 0;
						}
					}
					version = templateVFirst + "." + templateVSecond + "." + templateVThird;
					contract.setVersion(version);
				} else {
					contract.setVersion(template.getVersion());
				}
				Long companyID = template.getCompanyID();
				contract.setCompanyID(companyID);
				contract.setKeyToken(template.getKeyToken());

				Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID",
						template.getCompanyID());
				@SuppressWarnings("unchecked")
				List<User> allUsers = qF.getResultList();
				for (int i = 0; i < allUsers.size(); i++) {
					String name = allUsers.get(i).getFirstname() + " " + allUsers.get(i).getLastname();
					if (name.equalsIgnoreCase(nameFirst)) {
						contract.setUserID(allUsers.get(i).getId());
					}
					if (name.equalsIgnoreCase(nameSecond)) {
						contract.setUserIDSecond(allUsers.get(i).getId());
					}
				}
				em.merge(contract);
			} else {
				Query qF = em.createQuery("SELECT u FROM User u WHERE u.companyID=:companyID").setParameter("companyID",
						contract.getCompanyID());
				@SuppressWarnings("unchecked")
				List<User> allUsers = qF.getResultList();
				for (int i = 0; i < allUsers.size(); i++) {
					String name = allUsers.get(i).getFirstname() + " " + allUsers.get(i).getLastname();
					if (name.equalsIgnoreCase(nameFirst)) {
						contract.setUserID(allUsers.get(i).getId());
					}
					if (name.equalsIgnoreCase(nameSecond)) {
						contract.setUserIDSecond(allUsers.get(i).getId());
					}
				}
				em.persist(contract);
			}
		} catch (PersistenceException e) {
			return "Persistence Exception";
		}
		return "Saved";
	}

	@Transactional
	public String deleteContract(Long id) {
		try {
			Contract cm = em.find(Contract.class, id);
			if (cm != null) {
				em.remove(cm);
			}
		} catch (IllegalStateException e) {
			return "Illegal State Exception";
		}
		return "Deleted";
	}

	@Transactional
	public Contract updateKey(Long id) {
		try {
			Query q = em.createQuery("SELECT c FROM Contract c WHERE c.id=:id").setParameter("id", id);
			Contract template = (Contract) q.getSingleResult();
			template.setKeyToken(template.generateKey());
			String version = template.getVersion();
			String[] parts = version.split("\\.");
			int templateVFirst = Integer.parseInt(parts[0]);
			int templateVSecond = Integer.parseInt(parts[1]);
			int templateVThird = Integer.parseInt(parts[2]);
			if (templateVThird != 9) {
				templateVThird = templateVThird + 1;
			} else {
				if (templateVSecond != 9) {
					templateVSecond = templateVSecond + 1;
					templateVThird = 0;
				} else {
					templateVFirst = templateVFirst + 1;
					templateVSecond = 0;
					templateVThird = 0;
				}
			}
			version = templateVFirst + "." + templateVSecond + "." + templateVThird;
			template.setVersion(version);
			return template;
		} catch (PersistenceException e) {
			Contract c = new Contract();
			c.setId(0L);
			return c;
		}

	}
}
