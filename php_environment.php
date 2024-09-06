<?php
// Execute the Python script
$output = shell_exec('python C:\xampp\htdocs\Miniproject\movie_recommendations.py 2>&1 "lala land"');

// Display the output
echo "<pre>$output</pre>";
?>
