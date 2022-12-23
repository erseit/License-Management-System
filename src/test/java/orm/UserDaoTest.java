package orm;

import java.util.List;
import java.util.ArrayList;
import javax.inject.Inject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import io.quarkus.test.junit.QuarkusTest;

import orm.model.*;
import orm.dao.*;

@QuarkusTest
class UserDaoTest {

	@Inject
	UserDao userDao;

	public User createUser(String username, String password, String role, String firstname, String lastname,
			String email,
			String phone, String mobile, Long companyID, List<Contract> allContracts) {

		User user = new User(username, password, role, firstname, lastname, email,
				phone, mobile, companyID, allContracts);
		return user;
	}

	@Test
	void checkCreateDeleteUser() {
		// create a user
		List<Contract> tempContracts = new ArrayList<>();
		User user = createUser("test", "test123", "adminCompany", "Max", "Mustermann", "mustermann@tst.de", "123456789",
				"123456789", 10L, tempContracts);
		assertEquals(userDao.save(user), "Saved");
	
		// give an error if there is already the same username
		User user2 = createUser("test", "test567", "user", "Max", "Musterfrau", "musterfrau@tst.de", "123456789",
				"123456789", 10L, tempContracts);
		assertEquals(userDao.save(user2), "Bad Request");

		//delete the user
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
	}

	@Test
	void checkUpdateUser() {
		// create a user
		List<Contract> tempContracts = new ArrayList<>();
		User user = createUser("test", "test123", "adminCompany", "Max", "Mustermann", "mustermann@tst.de", "123456789",
				"123456789", 10L, tempContracts);
		assertEquals(userDao.save(user), "Saved");
	
		// update a paar of attributes
		user.setLastname("Testmann");
		user.setUsername("testEdited");
		assertEquals(userDao.save(user), "Saved");

		//check new values
		assertEquals(userDao.getUser(user.getToken()).getLastname(), "Testmann");
		assertEquals(userDao.getUser(user.getToken()).getUsername(), "testEdited");
		
		//delete the user
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
	}

	@Test
	void checkLogin() {
		// create a user
		List<Contract> tempContracts = new ArrayList<>();
		User user = createUser("test", "test123", "adminCompany", "Max", "Mustermann", "mustermann@tst.de", "123456789",
				"123456789", 10L, tempContracts);
		assertEquals(userDao.save(user), "Saved");
	
		// check password and username
		assertNotNull(userDao.login(user.getUsername(), user.getPassword()));

		//delete the user
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
	}

}