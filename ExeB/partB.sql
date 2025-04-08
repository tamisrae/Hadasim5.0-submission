CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(50),
    Family_Name VARCHAR(50),
    Gender VARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);


CREATE TABLE Family_Tree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id)
);


INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id, CASE WHEN Gender = 'male' THEN 'husband' ELSE 'wife' END
FROM Persons
WHERE Spouse_Id IS NOT NULL;


INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Spouse_Id, Person_Id,
       CASE WHEN Gender = 'male' THEN 'wife' ELSE 'husband' END
FROM Persons
WHERE Spouse_Id IS NOT NULL
  AND Spouse_Id NOT IN (
      SELECT Person_Id
      FROM Family_Tree
      WHERE Connection_Type IN ('husband', 'wife')
    );