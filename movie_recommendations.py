#!C:\Users\Acer\AppData\Local\Programs\Python\Python310\python.exe
import openai
import sqlite3
import json
import re
import sys
import threading

openai.api_key = '//insert your openapi key here'

def search_imdb_database(movie_name, release_year):
    conn = sqlite3.connect('imdb-database.db')
    cursor = conn.cursor()

    cursor.execute("SELECT field1, field3, field6 FROM basics WHERE field3 LIKE ? AND field6 = ? AND field2 = ?", (movie_name + '%', release_year, 'movie'))
    rows = cursor.fetchall()

    results = []
    for row in rows:
        tconst, title, year = row
        print(f"tconst: {tconst}, Title: {title}, Year: {year}")
        results.append({"tconst": tconst, "title": title, "year": year})

    conn.close()
    return results

def search_movie_in_database(movie):
    search_results = search_imdb_database(movie["movie"], movie["year"])
    movie["search_results"] = search_results

def generate_movie_recommendations(movie_name):
    query_prompt = f"Recommend movies similar to '{movie_name}'. the output must be in the below format. Movie 1,Year 1\nMovie 2,Year 2\nMovie 3,Year 3\nMovie 4,Year 4\nMovie 5,Year 5\nMovie 6,Year 6\nMovie 7,Year 7\nMovie 8,Year 8\nMovie 9,Year 9\nMovie 10,Year 10"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=query_prompt,
        max_tokens=100,
        n=1,
        stop=None,
        frequency_penalty=0.2,
        presence_penalty=0.2
    )
    recommendations = []
    for choice in response.choices:
        recommendation = choice.text.strip()
        movies_years = re.findall(r"([^\n,]+),(\d+)", recommendation)
        for movie_year in movies_years:
            movie, year = movie_year
            recommendations.append({"movie": movie.strip(), "year": year.strip()})

    return recommendations

def main(movie_name):
    recommendations = generate_movie_recommendations(movie_name)

   
    threads = []
    for recommendation in recommendations:
        thread = threading.Thread(target=search_movie_in_database, args=(recommendation,))
        thread.start()
        threads.append(thread)


    for thread in threads:
        thread.join()

    with open("recommendations.json", "w") as file:
        json.dump(recommendations, file, indent=4)

    print("Recommendations exported to recommendations.json")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide a movie name as a command-line argument.")
    else:
        movie_name = sys.argv[1]
        main(movie_name)