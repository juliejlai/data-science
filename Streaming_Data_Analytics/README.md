# Project 3: Understanding User Behavior

- You're a data scientist at a game development company  

- Your latest mobile game has two events you're interested in tracking: `buy a
  sword` & `join guild`

- Each has metadata characterstic of such events (i.e., sword type, guild name,
  etc)


## Tasks

- Instrument your API server to log events to Kafka

- Assemble a data pipeline to catch these events: use Spark streaming to filter
  select event types from Kafka, land them into HDFS/parquet to make them
  available for analysis using Presto

- Use Apache Bench to generate test data for your pipeline

- Produce an analytics report where you provide a description of your pipeline
  and some basic analysis of the events

Use a notebook to present your queries and findings. Remember that this
notebook should be appropriate for presentation to someone else in your
business who needs to act on your recommendations.

It's understood that events in this pipeline are _generated_ events which make
them hard to connect to _actual_ business decisions.  However, we'd like
students to demonstrate an ability to plumb this pipeline end-to-end, which
includes initially generating test data as well as submitting a notebook-based
report of at least simple event analytics.


## Options

There are plenty of advanced options for this project.  Here are some ways to
take your project further than just the basics we'll cover in class:

- Generate and filter more types of events.  There are plenty of other things
  you might capture events for during gameplay

- Enhance the API to use additional http verbs such as `POST` or `DELETE` as
  well as additionally accept _parameters_ for events (e.g., purchase events
  might accept sword or item type)

- Connect a user-keyed storage engine such as Redis or Cassandra up to Spark so
  you can track user state during gameplay (e.g., user's inventory or health)
