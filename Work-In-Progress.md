Work-In-Progress.md

Notes about what's in this branch for when I start to work on it later.

localhost:3011/unpoll-demo -- from the database initalised by iota.json
see app/components/web-components/unpoll/index.js

A user can check the boxes and submit a question of their own.
The question is written into the db. see app/api/input-and-votes.js
Check that the votes are written. Make sure all votes are written - yes's and no's.

Rounds,

For the first round, get the 5 random questions from the list that has no round 0 votes. If not 5 in that list, then get additioanl question from the list with 1 round 0 vote, etc. Doesn't matter if the vote is yes or not, just if it has been seen.

Implement additional rounds
get N questions at random from the the top 1/Nth of the list sorted by number of yes votes.

Show number of questions under consideration.

At the end, should the top N questions, as ranked by users, ask if user supports, accepts, or disapproves of the question
