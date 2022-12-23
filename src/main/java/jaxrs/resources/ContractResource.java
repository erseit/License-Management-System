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

import orm.dao.ContractDao;
import orm.model.*;
import io.vertx.core.http.HttpServerRequest;


@RequestScoped
@Path("/contracts")
public class ContractResource {

    @Inject
    ContractDao contractDao;
    
    @Context
    HttpServerRequest request;

    @POST
    @Path("addContract")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void addContract(Contract contract){
        String result = contractDao.save(contract);
        if(result.equalsIgnoreCase("Persistence Exception")) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else {
           throw new WebApplicationException(Response.Status.OK); 
       }
    }
    
    @PUT
    @Path("updateContract")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void updateContract(Contract contract) {
        String result = contractDao.save(contract);
        if(result.equalsIgnoreCase("Persistence Exception")) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else {
           throw new WebApplicationException(Response.Status.OK); 
       }
    }

    @POST
    @Path("updateKey")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Contract updateKey(Contract contract) {
        Contract template = contractDao.updateKey(contract.getId());
        if(template.getId() == 0) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else {
           return template;
       }
    }

   @POST
    @Path("allContracts")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Contract> getAllContracts(Contract contract) {
       return contractDao.getContracts(contract.getCompanyID());
    }
    
    @DELETE
    @Path("deleteContract")
    @Produces(MediaType.APPLICATION_JSON)
    public void removeCompany(Contract contract){
    	String result = contractDao.deleteContract(contract.getId());
    	if(result.equalsIgnoreCase("Illegal State Exception")) { 
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
        } else {
            throw new WebApplicationException(Response.Status.OK); 
        }
    }    
}