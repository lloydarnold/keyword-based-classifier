## Overview 

This program was written during work experience with 3 sided cube in Bournemouth, as 
part of their desire to automate certain parts of their email processing. The goal of 
the project is to identify the likely topic of an email, based on keyword analysis. 
Emails are then given a score based on this, and can be forwarded to the relevant 
person.

In order to carry out this analysis, the program uses basic machine learning techniques,
starting with a randomly initiated score for each keyword and then updating this based 
on feedback. It updates these scores using the derivative of a sigmoid function, meaning 
if the program is initially high confidence in it's guess it only makes small adjustments,
but if it is low confidence it takes larger steps. 
