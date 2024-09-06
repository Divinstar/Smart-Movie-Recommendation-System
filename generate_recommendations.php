<?php


require __DIR__ . '/vendor/autoload.php'; 

use Orhanerday\OpenAi\OpenAi;

$movieName = $_POST['movie_name']; 

if (empty($movieName)) {
    die("Please provide a movie name.");
}

$command = 'python C:\xampp\htdocs\Miniproject\movie_recommendations.py 2>&1"' . $movieName . '"';
$output = shell_exec($command);
echo $output;


$maxAttempts = 10;
$attempts = 0;
$recommendationsFile = 'recommendations.json';
$lastModifiedTime = filemtime($recommendationsFile);

while ($lastModifiedTime == filemtime($recommendationsFile) && $attempts < $maxAttempts) {
    sleep(1); 
    $attempts++;
}

if ($attempts < $maxAttempts) {
    header('Content-Type: application/json');
    readfile($recommendationsFile);
    
    echo "Python script executed successfully!";
} else {
    echo "Error: Failed to generate recommendations.";
}
?>