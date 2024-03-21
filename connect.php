<?php

$email = filter_input(INPUT_POST, 'email');
$password = filter_input(INPUT_POST, 'password');

if (!empty($email)) {
    if (!empty($password)) {
        $server = "eu-az-sql-serv1.database.windows.net";
        $dbusername = "mbudgetinguser";
        $dbpassword = "Mijinitech@2024";
        $dbname = "mbudgetingdb";

        // Create a connection
        $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Prepare and bind the SQL statement
        $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $password);

        // Execute the statement
        if ($stmt->execute()) {
            echo "Email and password inserted successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Close the connection
        $stmt->close();
        $conn->close();
    } else {
        echo "Password is required";
    }
} else {
    echo "Email is required";
    die();
}
?>
