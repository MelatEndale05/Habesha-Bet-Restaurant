<?php
// test_connection.php
include 'db_config.php';

if ($conn !== false) {
  echo "Connection successful! Connected to database: HagerBetDB";
} else {
  echo "Connection failed: ";
  print_r(sqlsrv_errors(), true);
}
?>