package orm;

import java.util.List;
import java.util.ArrayList;
import javax.inject.Inject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;
import io.quarkus.test.junit.QuarkusTest;
import orm.model.*;
import orm.dao.*;

@QuarkusTest
class ContractDaoTest {

    @Inject
    UserDao userDao;

    @Inject
    ContractDao contractDao;

    public Contract createContract(String startDate, String endDate, String responsable, String secondResponsable,
            String firstIP, String secondIp, String ipSechs, int port, int issuerID, int serialNo, Long companyID,
            Long userID, Long secondUserID, List<String> allUsers) {

        Contract contract = new Contract(startDate, endDate, responsable, secondResponsable, firstIP, secondIp, ipSechs,
                port, issuerID, serialNo, companyID, userID, secondUserID, allUsers);
        return contract;
    }

    public User createUser(String username, String password, String role, String firstname, String lastname,
            String email,
            String phone, String mobile, Long companyID, List<Contract> allContracts) {

        User user = new User(username, password, role, firstname, lastname, email,
                phone, mobile, companyID, allContracts);
        return user;
    }

    @Test
    void checkCreateDeleteContract() {
        // create template users
        List<Contract> tempContracts = new ArrayList<>();
        User user = createUser("test1", "test123", "user", "Max", "Mustermann", "mustermann@tst.de", "123456789",
                "123456789", 10L, tempContracts);
        assertEquals(userDao.save(user), "Saved");

        List<Contract> tempContracts2 = new ArrayList<>();
        User user2 = createUser("test2", "test123", "user", "Max", "Musterfrau", "musterfrau@tst.de", "123456789",
                "123456789", 10L, tempContracts2);
        assertEquals(userDao.save(user2), "Saved");

        // create a template list with user names
        List<String> tempAllUsers = new ArrayList<>();
        tempAllUsers.add(user.getFirstname() + " " + user.getLastname());
        tempAllUsers.add(user2.getFirstname() + " " + user2.getLastname());
        // create a contract
        Contract contract = createContract("01.01.2022", "01.01.2023", user.getFirstname() + " " + user.getLastname(),
                user2.getFirstname() + " " + user2.getLastname(), "128.128.128.192", "10.10.10.16", "ff:ff:ff:dd:cc:aa",
                123, 456, 789, user.getCompanyID(), user.getId(), user2.getId(), tempAllUsers);
        assertEquals(contractDao.save(contract), "Saved");

        //delete users
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
		assertEquals(userDao.deleteUser(user2.getId()),"Deleted");

        // delete the contract
        assertEquals(contractDao.deleteContract(contract.getId()), "Deleted");   
    }

    @Test
    void checkUpdateContract() {
        // create template users
        List<Contract> tempContracts = new ArrayList<>();
        User user = createUser("test1", "test123", "user", "Max", "Mustermann", "mustermann@tst.de", "123456789",
                "123456789", 10L, tempContracts);
        assertEquals(userDao.save(user), "Saved");

        List<Contract> tempContracts2 = new ArrayList<>();
        User user2 = createUser("test2", "test123", "user", "Max", "Musterfrau", "musterfrau@tst.de", "123456789",
                "123456789", 10L, tempContracts2);
        assertEquals(userDao.save(user2), "Saved");

        // create a template list with user names
        List<String> tempAllUsers = new ArrayList<>();
        tempAllUsers.add(user.getFirstname() + " " + user.getLastname());
        tempAllUsers.add(user2.getFirstname() + " " + user2.getLastname());
        // create a contract
        Contract contract = createContract("01.01.2022", "01.01.2023", user.getFirstname() + " " + user.getLastname(),
                user2.getFirstname() + " " + user2.getLastname(), "128.128.128.192", "10.10.10.16", "ff:ff:ff:dd:cc:aa",
                123, 456, 789, user.getCompanyID(), user.getId(), user2.getId(), tempAllUsers);
        assertEquals(contractDao.save(contract), "Saved");

        //update some attributes
        contract.setFirstIP("128.128.172.172");
        contract.setEndDate("01.01.2024");
        assertEquals(contractDao.save(contract), "Saved");

        //check new values
		assertEquals(contractDao.getContract(contract.getId()).getFirstIP(), "128.128.172.172");
        assertEquals(contractDao.getContract(contract.getId()).getEndDate(), "01.01.2024");

        //delete users
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
		assertEquals(userDao.deleteUser(user2.getId()),"Deleted");

        // delete the contract
        assertEquals(contractDao.deleteContract(contract.getId()), "Deleted");   
    }

    @Test
    void checkUpdateKey() {
        // create template users
        List<Contract> tempContracts = new ArrayList<>();
        User user = createUser("test1", "test123", "user", "Max", "Mustermann", "mustermann@tst.de", "123456789",
                "123456789", 10L, tempContracts);
        assertEquals(userDao.save(user), "Saved");

        List<Contract> tempContracts2 = new ArrayList<>();
        User user2 = createUser("test2", "test123", "user", "Max", "Musterfrau", "musterfrau@tst.de", "123456789",
                "123456789", 10L, tempContracts2);
        assertEquals(userDao.save(user2), "Saved");

        // create a template list with user names
        List<String> tempAllUsers = new ArrayList<>();
        tempAllUsers.add(user.getFirstname() + " " + user.getLastname());
        tempAllUsers.add(user2.getFirstname() + " " + user2.getLastname());
        // create a contract
        Contract contract = createContract("01.01.2022", "01.01.2023", user.getFirstname() + " " + user.getLastname(),
                user2.getFirstname() + " " + user2.getLastname(), "128.128.128.192", "10.10.10.16", "ff:ff:ff:dd:cc:aa",
                123, 456, 789, user.getCompanyID(), user.getId(), user2.getId(), tempAllUsers);
        assertEquals(contractDao.save(contract), "Saved");

        //update key
        String oldKey = contract.getKeyToken();
        Contract updated = contractDao.updateKey(contract.getId());
        
        //check new key
		assertNotEquals(updated.getKeyToken(), oldKey);

        //delete users
		assertEquals(userDao.deleteUser(user.getId()),"Deleted");
		assertEquals(userDao.deleteUser(user2.getId()),"Deleted");

        // delete the contract
        assertEquals(contractDao.deleteContract(contract.getId()), "Deleted");   
    }

 

}