package jaxrs.resources;

import java.util.List;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.HashMap;


import orm.dao.CompanyDao;
import orm.model.*;
import io.vertx.core.http.HttpServerRequest;


@RequestScoped
@Path("/companies")
public class CompanyResource {

    @Inject
    CompanyDao comDao;
    
    @Context
    HttpServerRequest request;
  
    @POST
    @Path("addCompany")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void addCompany(Company company){
        String result = comDao.save(company);
        if(result.equalsIgnoreCase("Persistence Exception")) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else if (result.equalsIgnoreCase("Bad Request")){
           throw new WebApplicationException(Response.Status.BAD_REQUEST); 
       }else {
           throw new WebApplicationException(Response.Status.OK); 
       }
    }
    
    @PUT
    @Path("updateCompany")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void updateCompany(Company company) {
        String result = comDao.save(company);
        if(result.equalsIgnoreCase("Persistence Exception")) {
             throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
        } else if (result.equalsIgnoreCase("Bad Request")){
            throw new WebApplicationException(Response.Status.BAD_REQUEST); 
        }else {
            throw new WebApplicationException(Response.Status.OK); 
        }
    }

    @POST
    @Path("allCompanies")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Company> getAllCompanies(User user) {
       return comDao.getCompanies(user.getToken());
      
    }

    @POST
    @Path("allCompanies/contracts")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public HashMap<String, List<Contract>> getCompaniesWithContracts(User user) {
       return comDao.getCompaniesWithContracts(user.getToken());
      
    }


    @POST
    @Path("allCompanies/users")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public HashMap<String, List<User>> getCompaniesWithUsers(User user) {
       return comDao.getCompaniesWithUsers(user.getToken());
      
    }
    
    @DELETE
    @Path("deleteCompany")
    @Produces(MediaType.APPLICATION_JSON)
    public void removeCompany(Company company){
    	String result = comDao.deleteCompany(company.getId());
    	if(result.equalsIgnoreCase("Illegal State Exception")) { 
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
        } else {
            throw new WebApplicationException(Response.Status.OK); 
        }
    }    
}