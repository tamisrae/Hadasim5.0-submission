CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(50),
    Family_Name VARCHAR(50),
    Gender VARCHAR(10),
    Father_Id INT NULL,
    Mother_Id INT NULL,
    Spouse_Id INT NULL,
    FOREIGN KEY (Father_Id) REFERENCES Persons(Person_Id),
    FOREIGN KEY (Mother_Id) REFERENCES Persons(Person_Id),
    FOREIGN KEY (Spouse_Id) REFERENCES Persons(Person_Id)
);

CREATE TABLE Family_Tree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    FOREIGN KEY (Person_Id) REFERENCES Persons(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES Persons(Person_Id)
);

INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id, 'father'
FROM Persons
WHERE Father_Id IS NOT NULL;

INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id, 'mother'
FROM Persons
WHERE Mother_Id IS NOT NULL;

INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id,
       CASE WHEN Gender = 'male' THEN 'son' ELSE 'doughter' END
FROM Persons
WHERE Father_Id IS NOT NULL;

INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id,
       CASE WHEN Gender = 'male' THEN 'son' ELSE 'doughter' END
FROM Persons
WHERE Mother_Id IS NOT NULL;


INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT p2.Person_Id, p1.Person_Id, 
       CASE WHEN p2.Gender = 'male' THEN 'brother' ELSE 'sister' END
FROM Persons p1
JOIN Persons p2 ON p1.Father_Id = p2.Father_Id AND p1.Mother_Id = p2.Mother_Id
WHERE p1.Person_Id <> p2.Person_Id;


INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id, 
       CASE WHEN Gender = 'male' THEN 'male soouse' ELSE 'female soouse' END
FROM Persons
WHERE Spouse_Id IS NOT NULL;

SELECT * FROM Family_Tree;
