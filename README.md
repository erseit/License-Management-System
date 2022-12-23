<h1 align="center">License Management System</h1>

<p align="center">Microsoft Teams App for License Management was made for the Projektarbeit at HS-Esslingen.</p>

## 📌 - Description

It is a Three Tier Web Application which is to be integrated with Microsoft Teams App as Registerkarte. You can manage customer companies. All customer related management is to be reserved to administrators. Administrative users may edit customer profiles, add customers, and delete them. A company can have many users and service contracts. Administrative users may edit other users profiles, add users, and delete them. They may also add, edit and delete service contracts. A service contract is bound to a customer; typically a customer can have many service contracts. A service contract is associated with at most two users from the associated company. Users associated with a service contract can see its details, but can not be able to change them.

## 📚 - Structure

```
.
│   # Frontend
├── /tabs
│   ├── /src
│   │   ├── /components     
│   │   |   ├── /companies
│   │   |   |   └── ...
│   │   |   ├── /contracts
│   │   |   |   └── ...
│   │   ├── /main
│   │   |   |   └── ...
│   │   ├── /users
│   │   |   |   └── ...
│   ├── .env            # Configurations and environment variables
│   ├── next.config.js  # All configurations and environment variables for frontend
│   ├── ...

│   # Backend
├── /src
│   ├── /main
│   │   ├── /java
│   │   |   ├── /orm
│   │   |   |   ├── /model      # Entity Klassen
|   │   │   |   |   └── Company.java
|   │   │   |   |   └── Contract.java
|   │   │   |   |   └── User.java
│   │   |   |   ├── /dao      # Data Access Klassen
|   │   │   |   |   └── CompanyDao.java
|   │   │   |   |   └── ContractDao.java
|   │   │   |   |   └── UserDao.java
│   │   ├── /resources
|   │   │   |   └── application.properties      # All configurations and environment variables for backend
|   │   │   |   └── import.sql                  # Initial data for users tabelle
│   ├── /test
│   │   ├── /java
│   │   |   ├── /orm
│   │   |   |    └── CompanyDaoTest.java 
│   │   |   |    └── ContractDaoTest.java 
│   │   |   |    └── UserDaoTest.java 

```

## ⚙️ - Installation

1. Clone the Git-Repository.

```
git clone https://github.com/erseit/LicenseManagementSystem
```

2. Build backend

- Go to root folder with command lines
```
cd [path_to_root_folder]
```

- Start Backend with gradle quarkus
```
gradle quarkusDev
```

3. Now server is available on `http://localhost:8811`.

- To change Port Nummer go to [application.properties]()

4. Build frontend

- Go to client folder with command lines
```
cd [path_to_root_folder]/tabs
```
- If it is the first run:
```
npm install
``````
- To start the client server:
```
npm run dev:teamsfx
``````

5. Now you can use the app in microsoft Teams or local on https://localhost:53000

