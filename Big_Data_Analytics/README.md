# Project 1: Query Project

- In the Query Project, you will get practice with SQL while learning about
  Google Cloud Platform (GCP) and BiqQuery. You'll answer business-driven
  questions using public datasets housed in GCP. To give you experience with
  different ways to use those datasets, you will use the web UI (BiqQuery) and
  the command-line tools, and work with them in Jupyter Notebooks.

#### Problem Statement

- You're a data scientist at Lyft Bay Wheels (https://www.lyft.com/bikes/bay-wheels), formerly known as Ford GoBike, the
  company running Bay Area Bikeshare. You are trying to increase ridership, and
  you want to offer deals through the mobile app to do so. 
  
- What deals do you offer though? Currently, your company has several options which can change over time.  Please visit the website to see the current offers and other marketing information. Frequent offers include: 
  * Single Ride 
  * Monthly Membership
  * Annual Membership
  * Bike Share for All
  * Access Pass
  * Corporate Membership
  * etc.

- Through this project, you will answer these questions: 

  * What are the 5 most popular trips that you would call "commuter trips"? 
  
  * What are your recommendations for offers (justify based on your findings)?

- Please note that there are no exact answers to the above questions, just like in the proverbial real world.  This is not a simple exercise where each question above will have a simple SQL query. It is an exercise in analytics over inexact and dirty data. 

- You won't find a column in a table labeled "commuter trip".  You will find you need to do quite a bit of data exploration using SQL queries to determine your own definition of a communter trip.  In data exploration process, you will find a lot of dirty data, that you will need to either clean or filter out. You will then write SQL queries to find the communter trips.

- Likewise to make your recommendations, you will need to do data exploration, cleaning or filtering dirty data, etc. to come up with the final queries that will give you the supporting data for your recommendations. You can make any recommendations regarding the offers, including, but not limited to: 
  * market offers differently to generate more revenue 
  * remove offers that are not working 
  * modify exising offers to generate more revenue
  * create new offers for hidden business opportunities you have found
  * etc. 

#### All Work MUST be done in the Google Cloud Platform (GCP) / The Majority of Work MUST be done using BigQuery SQL / Usage of Temporary Tables, Views, Pandas, Data Visualizations

A couple of the goals of w205 are for students to learn how to work in a cloud environment (such as GCP) and how to use SQL against a big data data platform (such as Google BigQuery).  In keeping with these goals, please do all of your work in GCP, and the majority of your analytics work using BigQuery SQL queries.

You can make intermediate temporary tables or views in your own dataset in BigQuery as you like.  Actually, this is a great way to work!  These make data exploration much easier.  It's much easier when you have made temporary tables or views with only clean data, filtered rows, filtered columns, new columns, summary data, etc.  If you use intermediate temporary tables or views, you should include the SQL used to create these, along with a brief note mentioning that you used the temporary table or view.

In the final Jupyter Notebook, the results of your BigQuery SQL will be read into Pandas, where you will use the skills you learned in the Python class to print formatted Pandas tables, simple data visualizations using Seaborn / Matplotlib, etc.  You can use Pandas for simple transformations, but please remember the bulk of work should be done using Google BigQuery SQL.

#### GitHub Procedures

In your Python class you used GitHub, with a single repo for all assignments, where you committed without doing a pull request.  In this class, we will try to mimic the real world more closely, so our procedures will be enhanced. 

Each project, including this one, will have it's own repo.

Important:  In w205, please never merge your assignment branch to the master branch. 

Using the git command line: clone down the repo, leave the master branch untouched, create an assignment branch, and move to that branch:
- Open a linux command line to your virtual machine and be sure you are logged in as jupyter.
- Create a ~/w205 directory if it does not already exist `mkdir ~/w205`
- Change directory into the ~/w205 directory `cd ~/w205`
- Clone down your repo `git clone <https url for your repo>`
- Change directory into the repo `cd <repo name>`
- Create an assignment branch `git branch assignment`
- Checkout the assignment branch `git checkout assignment`

The previous steps only need to be done once.  Once you your clone is on the assignment branch it will remain on that branch unless you checkout another branch.

The project workflow follows this pattern, which may be repeated as many times as needed.  In fact it's best to do this frequently as it saves your work into GitHub in case your virtual machine becomes corrupt:
- Make changes to existing files as needed.
- Add new files as needed
- Stage modified files `git add <filename>`
- Commit staged files `git commit -m "<meaningful comment about your changes>"`
- Push the commit on your assignment branch from your clone to GitHub `git push origin assignment`

Once you are done, go to the GitHub web interface and create a pull request comparing the assignment branch to the master branch.  Add your instructor, and only your instructor, as the reviewer.  The date and time stamp of the pull request is considered the submission time for late penalties. 

If you decide to make more changes after you have created a pull request, you can simply close the pull request (without merge!), make more changes, stage, commit, push, and create a final pull request when you are done.  Note that the last data and time stamp of the last pull request will be considered the submission time for late penalties.

---

## Parts 1, 2, 3

We have broken down this project into 3 parts, about 1 week's work each to help you stay on track.

**You will only turn in the project once  at the end of part 3!**

- In Part 1, we will query using the Google BigQuery GUI interface in the cloud.

- In Part 2, we will query using the Linux command line from our virtual machine in the cloud.

- In Part 3, we will query from a Jupyter Notebook in our virtual machine in the cloud, save the results into Pandas, and present a report enhanced by Pandas output tables and simple data visualizations using Seaborn / Matplotlib.

---

## Part 1 - Querying Data with BigQuery

### SQL Tutorial

Please go through this SQL tutorial to help you learn the basics of SQL to help you complete this project.

SQL tutorial: https://www.w3schools.com/sql/default.asp

### Google Cloud Helpful Links

Read: https://cloud.google.com/docs/overview/

BigQuery: https://cloud.google.com/bigquery/

Public Datasets: Bring up your Google BigQuery console, open the menu for the public datasets, and navigate to the the dataset san_francisco.

- The Bay Bike Share has two datasets: a static one and a dynamic one.  The static one covers an historic period of about 3 years.  The dynamic one updates every 10 minutes or so.  THE STATIC ONE IS THE ONE WE WILL USE IN CLASS AND IN THE PROJECT. The reason is that is much easier to learn SQL against a static target instead of a moving target.

- (USE THESE TABLES!) The static tables we will be using in this class are in the dataset **san_francisco** :

  * bikeshare_stations

  * bikeshare_status

  * bikeshare_trips

- The dynamic tables are found in the dataset **san_francisco_bikeshare**

### Some initial queries

Paste your SQL query and answer the question in a sentence.  Be sure you properly format your queries and results using markdown. 

- What's the size of this dataset? (i.e., how many trips)

```sql
#standardSQL
SELECT count(*) 
FROM bigquery-public-data.san_francisco.bikeshare_trips
```
```
The dataset has a total of 983648 trips.
```

- What is the earliest start date and time and latest end date and time for a trip?

```sql
#standardSQL
SELECT min(start_date), max(end_date) 
FROM bigquery-public-data.san_francisco.bikeshare_trips
```
```
The earliest start date and time is 2013-08-29 09:08:00 UTC. The latest end date and time is 2016-08-31 23:48:00 UTC.
```

- How many bikes are there?

```sql
SELECT count(distinct bike_number)
FROM bigquery-public-data.san_francisco.bikeshare_tripss
```
```
There are 700 bikes.
```


### Questions of your own
- Make up 3 questions and answer them using the Bay Area Bike Share Trips Data.  These questions MUST be different than any of the questions and queries you ran above.

- Question 1: How many stations are there?
  * Answer: There are 74 stations.
  * SQL query: 
  ```sql
  SELECT COUNT(DISTINCT start_station_id) 
  FROM bigquery-public-data.san_francisco.bikeshare_trips
  ```

- Question 2: What are the shortest and longest duration times?
  * Answer: The shortest duration time was 60 seconds and the longest duration time was 200 days.
  * SQL query: 
  ```sql
  SELECT min(duration_sec) as min_time_sec, CAST(ROUND(max(duration_sec) / 86400) AS INT64) as max_time_days 
  FROM bigquery-public-data.san_francisco.bikeshare_trips
  ```

- Question 3: What is the most popular start station? How many trips started at that station?
  * Answer: The most popular start station is San Francisco Caltrain (Townsend at 4th), with a total of 72683 trips starting at that station.
  * SQL query: 
  ```sql
  SELECT start_station_name, COUNT(start_station_name) as start_station_count 
  FROM bigquery-public-data.san_francisco.bikeshare_trips 
  GROUP BY start_station_name 
  ORDER BY COUNT(start_station_name) DESC
  ```

### Bonus activity queries (optional - not graded - just this section is optional, all other sections are required)

The bike share dynamic dataset offers multiple tables that can be joined to learn more interesting facts about the bike share business across all regions. These advanced queries are designed to challenge you to explore the other tables, using only the available metadata to create views that give you a broader understanding of the overall volumes across the regions(each region has multiple stations)

We can create a temporary table or view against the dynamic dataset to join to our static dataset.

Here is some SQL to pull the region_id and station_id from the dynamic dataset.  You can save the results of this query to a temporary table or view.  You can then join the static tables to this table or view to find the region:
```sql
#standardSQL
select distinct region_id, station_id
from `bigquery-public-data.san_francisco_bikeshare.bikeshare_station_info`
```

- Top 5 popular station pairs in each region

- Top 3 most popular regions(stations belong within 1 region)

- Total trips for each short station name in each region

- What are the top 10 used bikes in each of the top 3 region. these bikes could be in need of more frequent maintenance.

---

## Part 2 - Querying data from the BigQuery CLI 

- Use BQ from the Linux command line:

  * General query structure

    ```
    bq query --use_legacy_sql=false '
        SELECT count(*)
        FROM
           `bigquery-public-data.san_francisco.bikeshare_trips`'
    ```

### Queries

1. Rerun the first 3 queries from Part 1 using bq command line tool (Paste your bq
   queries and results here, using properly formatted markdown):

  * What's the size of this dataset? (i.e., how many trips)
  ```
  bq query --use_legacy_sql=false '
      SELECT count(*) 
      FROM 
          `bigquery-public-data.san_francisco.bikeshare_trips`'
  ```

  * What is the earliest start time and latest end time for a trip?
  ```
  bq query --use_legacy_sql=false '
      SELECT min(start_date), max(end_date) 
      FROM 
          `bigquery-public-data.san_francisco.bikeshare_trips`'
  ```
  

  * How many bikes are there?
  ```
  bq query --use_legacy_sql=false '
      SELECT count(distinct bike_number)
      FROM 
          `bigquery-public-data.san_francisco.bikeshare_trips`'
  ```
  

2. New Query (Run using bq and paste your SQL query and answer the question in a sentence, using properly formatted markdown):

  * How many trips are in the morning vs in the afternoon?
  ```
  bq query --use_legacy_sql=false '
      SELECT start_hour_str, count(start_hour_str) as num_trips
      FROM 
      (
         SELECT start_date,
            EXTRACT(HOUR FROM start_date) AS start_hour,
            CASE 
                 WHEN EXTRACT(HOUR FROM start_date) <= 5  or EXTRACT(HOUR FROM start_date) >= 23 THEN "Nightime"
                 WHEN EXTRACT(HOUR FROM start_date) >= 6 and EXTRACT(HOUR FROM start_date) <= 12 THEN "Morning"
                 WHEN EXTRACT(HOUR FROM start_date) >= 13 and EXTRACT(HOUR FROM start_date) <= 17 THEN "Afternoon"
                 WHEN EXTRACT(HOUR FROM start_date) >= 18 and EXTRACT(HOUR FROM start_date) <= 22 THEN "Evening"
                 END AS start_hour_str
         FROM `bigquery-public-data.san_francisco.bikeshare_trips`
         ORDER BY start_date ASC
      ) as sub
      GROUP BY start_hour_str'
  ```
  
  ```
  There are 446771 trips in the morning vs 344249 trips in the afternoon, where morning is defined as a start time between 6am-12pm and afternoon is defined as a start time between 1pm-5pm.
  ```


### Project Questions
Identify the main questions you'll need to answer to make recommendations (list
below, add as many questions as you need).

- Question 1: How many trips have the same start and end station? 

- Quesiton 2: Of the trips that have the same start and end station, what are the 3 most popular stations (popular defined as having the most trips)?

- Question 3: Define a commuter time? How many trips travel during commuter times?

- Question 4: How many trips have the same start and end station, and fall within a commuter time?

- Question 5: How many trips are under 2 minutes? How many trips are over 5 hours? How many trips are over 1 day?

- Question 6: What days are the least busy? What days are the most busy?

- Question 7: What times (on average) are the least busy during the weekdays? Weekends?

- Question 8: What times (on average) are the most busy during the weekdays? Weekends?

### Answers

Answer at least 4 of the questions you identified above You can use either
BigQuery or the bq command line tool.  Paste your questions, queries and
answers below.

- Question 1: How many trips have the same start and end station? 
  * Answer: 32047 trips have the same start and end station
  * SQL query: 
    ```sql
    SELECT count(start_station_name)
    FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    WHERE start_station_name = end_station_name
    ```

- Question 2: Of the trips that have the same start and end stations, what are the 3 most popular stations (popular defined as having the most trips)?
  * Answer: Embarcadero at Sansome (2866 trips), Harry Bridges Plaza (Ferry Building) (2364 trips), University and Emerson (1184 trips)
  * SQL query:
    ```sql
    SELECT start_station_name, end_station_name, count(*) AS number_of_trips
    FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    WHERE start_station_name = end_station_name
    GROUP BY start_station_name, end_station_name
    ORDER BY number_of_trips DESC
    ```

- Question 3: Define a commuter time? How many trips travel during commuter times?
  * Answer: I defined a commuter time to have a start_time in between 7am-9am and in between 4pm-6pm, and are during weekdays. There are 560683 trips that travel during commuter times.
  * SQL query:
    ```sql
    SELECT count(*) as total_trips
    FROM
    (
      SELECT start_date,
      EXTRACT(DAYOFWEEK FROM start_date) AS dow_int,
      CASE 
        WHEN EXTRACT(DAYOFWEEK FROM start_date) IN (1, 7) THEN "Weekend"
        ELSE "Weekday"
        END AS dow_weekday,
      EXTRACT(HOUR FROM start_date) AS start_hour,
      CASE 
        WHEN EXTRACT(HOUR FROM start_date) >= 7 and EXTRACT(HOUR FROM start_date) <= 9 THEN "Commuter"
        WHEN EXTRACT(HOUR FROM start_date) >= 16 and EXTRACT(HOUR FROM start_date) <= 18 THEN "Commuter"        
        END AS start_hour_str,
      FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    )
    WHERE dow_weekday = 'Weekday' AND start_hour_str = "Commuter"
    ```
  
- Question 4: How many trips have the same start and end station, and fall within a commuter time?
  * Answer: There are 6552 trips that have the same start and end station, and fall within a commuter time
  * SQL query:
    ```sql
    SELECT count(*) as total_trips
    FROM 
    (
      SELECT start_station_name, end_station_name, start_date, end_date,
        EXTRACT(DAYOFWEEK FROM start_date) AS dow_int,
               CASE 
                   WHEN EXTRACT(DAYOFWEEK FROM start_date) IN (1, 7) THEN "Weekend"
                   ELSE "Weekday"
                   END AS dow_weekday,     
        EXTRACT(HOUR FROM start_date) AS start_hour,
              CASE 
                WHEN EXTRACT(HOUR FROM start_date) >= 7 and EXTRACT(HOUR FROM start_date) <= 9 THEN "Commuter"
                WHEN EXTRACT(HOUR FROM start_date) >= 16 and EXTRACT(HOUR FROM start_date) <= 18 THEN "Commuter"
                END AS start_hour_str,
          FROM `bigquery-public-data.san_francisco.bikeshare_trips`
          WHERE start_station_name = end_station_name
    )
    WHERE dow_weekday = "Weekday" AND start_hour_str = "Commuter"
    ```
  
- Question 5: How many trips are under 2 minutes? How many trips are over 5 hours? How many trips are over 1 day?
  * Answer: There are 17077 trips under 2 minutes, 6084 trips over 5 hours, and 1390 trips over 1 day.
  * SQL query:
    ```sql
    SELECT 
           COUNT(CASE WHEN duration_minutes <= 2 THEN 1 END) as min_count, 
           COUNT(CASE WHEN duration_hours_rounded >= 5 THEN 1 END) as hours_count, 
           COUNT(CASE WHEN duration_days_rounded >= 1 THEN 1 END) as days_count,
    FROM
    (
      SELECT duration_sec, 
         CAST(ROUND(duration_sec / 60.0) AS INT64) AS duration_minutes,
         CAST(ROUND(duration_sec / 3600.0) AS INT64) AS duration_hours_rounded,
         CAST(ROUND(duration_sec / 86400.0) AS INT64) AS duration_days_rounded
      FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    )
    ```

- Question 6: What days are the least busy? What days are the most busy?
  * Answer: The 3 least busiest days are Sunday with 51375 trips, Saturday with 60279 trips, and Friday with 159977 trips. The 3 most busiest days are Tuesday with 184405 trips, Thursday with Wednesday trips, and Thursday with  176908 trips.
  * SQL query:
    ```sql
    SELECT dow_str, count(*) as num_trips,
    FROM
    (
    SELECT start_date,
           EXTRACT(DAYOFWEEK FROM start_date) AS dow_int,
           CASE EXTRACT(DAYOFWEEK FROM start_date)
               WHEN 1 THEN "Sunday"
               WHEN 2 THEN "Monday"
               WHEN 3 THEN "Tuesday"
               WHEN 4 THEN "Wednesday"
               WHEN 5 THEN "Thursday"
               WHEN 6 THEN "Friday"
               WHEN 7 THEN "Saturday"
               END AS dow_str,
           CASE 
               WHEN EXTRACT(DAYOFWEEK FROM start_date) IN (1, 7) THEN "Weekend"
               ELSE "Weekday"
               END AS dow_weekday,
           EXTRACT(HOUR FROM start_date) AS start_hour,
           CASE 
               WHEN EXTRACT(HOUR FROM start_date) <= 5  OR EXTRACT(HOUR FROM start_date) >= 23 THEN "Nightime"
               WHEN EXTRACT(HOUR FROM start_date) >= 6 and EXTRACT(HOUR FROM start_date) <= 8 THEN "Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 9 and EXTRACT(HOUR FROM start_date) <= 10 THEN "Mid Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 11 and EXTRACT(HOUR FROM start_date) <= 13 THEN "Mid Day"
               WHEN EXTRACT(HOUR FROM start_date) >= 14 and EXTRACT(HOUR FROM start_date) <= 16 THEN "Early Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 17 and EXTRACT(HOUR FROM start_date) <= 19 THEN "Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 20 and EXTRACT(HOUR FROM start_date) <= 22 THEN "Evening"
               END AS start_hour_str
    FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    )
    GROUP BY dow_str
    ORDER BY num_trips ASC
    ```

- Question 7: What times (on average) are the least busy during the weekdays? Weekends?
  * Answer: During the weekdays, start hours from 2-3am are the least busy. During the weekends, start hours from 3-5am are the least busy. 
  * SQL query:
  ```sql
  SELECT dow_weekday, start_hour, count(*) as num_trips,
    FROM
    (
    SELECT start_date,
           EXTRACT(DAYOFWEEK FROM start_date) AS dow_int,
           CASE EXTRACT(DAYOFWEEK FROM start_date)
               WHEN 1 THEN "Sunday"
               WHEN 2 THEN "Monday"
               WHEN 3 THEN "Tuesday"
               WHEN 4 THEN "Wednesday"
               WHEN 5 THEN "Thursday"
               WHEN 6 THEN "Friday"
               WHEN 7 THEN "Saturday"
               END AS dow_str,
           CASE 
               WHEN EXTRACT(DAYOFWEEK FROM start_date) IN (1, 7) THEN "Weekend"
               ELSE "Weekday"
               END AS dow_weekday,
           EXTRACT(HOUR FROM start_date) AS start_hour,
           CASE 
               WHEN EXTRACT(HOUR FROM start_date) <= 5  OR EXTRACT(HOUR FROM start_date) >= 23 THEN "Nightime"
               WHEN EXTRACT(HOUR FROM start_date) >= 6 and EXTRACT(HOUR FROM start_date) <= 8 THEN "Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 9 and EXTRACT(HOUR FROM start_date) <= 10 THEN "Mid Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 11 and EXTRACT(HOUR FROM start_date) <= 13 THEN "Mid Day"
               WHEN EXTRACT(HOUR FROM start_date) >= 14 and EXTRACT(HOUR FROM start_date) <= 16 THEN "Early Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 17 and EXTRACT(HOUR FROM start_date) <= 19 THEN "Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 20 and EXTRACT(HOUR FROM start_date) <= 22 THEN "Evening"
               END AS start_hour_str
    FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    )
    GROUP BY dow_weekday, start_hour
    ORDER BY num_trips ASC
    ```
- Question 8: What times (on average) are the most busy during the weekdays? Weekends?
  * Answer: During the weekdays, start hours from 7-9am, 4-6pm are the most busy. These fall into commuter times. During the weekends, start hours from 11am-4pm are the most busy. 
  * SQL query:
  ```sql
  SELECT dow_weekday, start_hour, count(*) as num_trips,
    FROM
    (
    SELECT start_date,
           EXTRACT(DAYOFWEEK FROM start_date) AS dow_int,
           CASE EXTRACT(DAYOFWEEK FROM start_date)
               WHEN 1 THEN "Sunday"
               WHEN 2 THEN "Monday"
               WHEN 3 THEN "Tuesday"
               WHEN 4 THEN "Wednesday"
               WHEN 5 THEN "Thursday"
               WHEN 6 THEN "Friday"
               WHEN 7 THEN "Saturday"
               END AS dow_str,
           CASE 
               WHEN EXTRACT(DAYOFWEEK FROM start_date) IN (1, 7) THEN "Weekend"
               ELSE "Weekday"
               END AS dow_weekday,
           EXTRACT(HOUR FROM start_date) AS start_hour,
           CASE 
               WHEN EXTRACT(HOUR FROM start_date) <= 5  OR EXTRACT(HOUR FROM start_date) >= 23 THEN "Nightime"
               WHEN EXTRACT(HOUR FROM start_date) >= 6 and EXTRACT(HOUR FROM start_date) <= 8 THEN "Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 9 and EXTRACT(HOUR FROM start_date) <= 10 THEN "Mid Morning"
               WHEN EXTRACT(HOUR FROM start_date) >= 11 and EXTRACT(HOUR FROM start_date) <= 13 THEN "Mid Day"
               WHEN EXTRACT(HOUR FROM start_date) >= 14 and EXTRACT(HOUR FROM start_date) <= 16 THEN "Early Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 17 and EXTRACT(HOUR FROM start_date) <= 19 THEN "Afternoon"
               WHEN EXTRACT(HOUR FROM start_date) >= 20 and EXTRACT(HOUR FROM start_date) <= 22 THEN "Evening"
               END AS start_hour_str
    FROM `bigquery-public-data.san_francisco.bikeshare_trips`
    )
    GROUP BY dow_weekday, start_hour
    ORDER BY num_trips DESC
    ```


---

## Part 3 - Employ notebooks to synthesize query project results

### Get Going

Create a Jupyter Notebook against a Python 3 kernel named Project_1.ipynb in the assignment branch of your repo.

#### Run queries in the notebook 

At the end of this document is an example Jupyter Notebook you can take a look at and run.  

You can run queries using the "bang" command to shell out, such as this:

```
! bq query --use_legacy_sql=FALSE '<your-query-here>'
```

- NOTE: 
- Queries that return over 16K rows will not run this way, 
- Run groupbys etc in the bq web interface and save that as a table in BQ. 
- Max rows is defaulted to 100, use the command line parameter `--max_rows=1000000` to make it larger
- Query those tables the same way as in `example.ipynb`

Or you can use the magic commands, such as this:

```sql
%%bigquery my_panda_data_frame

select start_station_name, end_station_name
from `bigquery-public-data.san_francisco.bikeshare_trips`
where start_station_name <> end_station_name
limit 10
```

```python
my_panda_data_frame
```

#### Report in the form of the Jupter Notebook named Project_1.ipynb

- Using markdown cells, MUST definitively state and answer the two project questions:

  * What are the 5 most popular trips that you would call "commuter trips"? 
  
  * What are your recommendations for offers (justify based on your findings)?

- For any temporary tables (or views) that you created, include the SQL in markdown cells

- Use code cells for SQL you ran to load into Pandas, either using the !bq or the magic commands

- Use code cells to create Pandas formatted output tables (at least 3) to present or support your findings

- Use code cells to create simple data visualizations using Seaborn / Matplotlib (at least 2) to present or support your findings

### Resource: see example .ipynb file 

[Example Notebook](example.ipynb)

