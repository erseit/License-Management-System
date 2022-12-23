package jaxrs.resources;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import orm.dao.UserDao;
import orm.model.User;
import io.vertx.core.http.HttpServerRequest;

@RequestScoped
@Path("/")
public class UserResource {

    @Inject
    UserDao userDao;
    
    @Context
    HttpServerRequest request;

    @POST
    @Path("getuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User getUser(User user) {
        return userDao.getUser(user.getToken());
    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User login (User user) {
    	User template = userDao.login(user.getUsername(), user.getPassword());
        if(template.getId() == 0) {
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }
    	return template;
    }

    @POST
    @Path("allusers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers(User user) {
        return userDao.getUsers(user.getCompanyID());
    }

    @POST
    @Path("adduser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String addUser(User user) {
        String result = userDao.save(user);
        if(result.equalsIgnoreCase("Persistence Exception")) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else if(result.equalsIgnoreCase("Bad Request")) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST); 
       } 
       else {
           throw new WebApplicationException(Response.Status.OK); 
       }
    } 
    
    @PUT
    @Path("updateuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateUser(User user) {
        String result = userDao.save(user);
        if(result.equalsIgnoreCase("Persistence Exception")) {
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
       } else if(result.equalsIgnoreCase("Bad Request")) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST); 
       } 
       else {
           throw new WebApplicationException(Response.Status.OK); 
       }
    }
    
    @DELETE
    @Path("deleteuser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void removeUser(User user) {
    	String result = userDao.deleteUser(user.getId());
    	if(result.equalsIgnoreCase("Illegal State Exception")) { 
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR); 
        } else {
            throw new WebApplicationException(Response.Status.OK); 
        }
    }
}