package orm;

import javax.inject.Inject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import io.quarkus.test.junit.QuarkusTest;

import orm.model.*;
import orm.dao.*;

@QuarkusTest
class CompanyDaoTest {
	
    @Inject
    CompanyDao companyDao;
    
    public Company createCompany(String name, String address, String addressDetails) {
    		Company company = new Company (name, address, addressDetails);
    		return company;
	}

	@Test
	void checkCreateUpdateDeleteCompany() {
		// create a company
		Company temp = createCompany("Test GmbH", "Teststraße 123, 12345 Teststadt", "Baden-Württemberg");
		assertEquals(companyDao.save(temp),"Saved");
		// update the name of a company
		temp.setCompanyname("Test Edited GmbH");
		assertEquals(companyDao.save(temp),"Saved");
		// give an error if there is already the company
		Company temp2 = createCompany("Test Edited GmbH", "Teststraße 123, 12345 Teststadt", "Baden-Württemberg");
		assertEquals(companyDao.save(temp2),"Bad Request");
		//delete the company
		assertEquals(companyDao.deleteCompany(temp.getId()),"Deleted");
	}
}